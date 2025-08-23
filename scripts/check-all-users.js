const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllUsers() {
  try {
    console.log('Fetching all users from database...\n');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    if (!users || users.length === 0) {
      console.log('No users found in database');
      return;
    }

    console.log(`Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: ${user.email || 'N/A'}`);
      console.log(`  Name: ${user.name || 'N/A'}`);
      console.log(`  Phone: ${user.phone || 'N/A'}`);
      console.log(`  Role: ${user.role || 'N/A'}`);
      console.log(`  Status: ${user.status || 'N/A'}`);
      console.log(`  Created: ${user.created_at}`);
      console.log(`  Updated: ${user.updated_at}`);
      
      // Check if ID contains Privy DID
      if (user.id && (user.id.startsWith('did:privy:') || user.id.startsWith('privy_'))) {
        console.log(`  ⚠️  This user has a Privy DID as ID`);
      }
      
      // Check linked accounts
      if (user.linked_accounts) {
        console.log(`  Linked Accounts: ${JSON.stringify(user.linked_accounts, null, 2)}`);
      }
      
      console.log('---');
    });
    
    // Summary
    console.log('\nSummary:');
    const privyUsers = users.filter(u => u.id && (u.id.startsWith('did:privy:') || u.id.startsWith('privy_')));
    console.log(`  Total users: ${users.length}`);
    console.log(`  Users with Privy DIDs: ${privyUsers.length}`);
    console.log(`  Users with email: ${users.filter(u => u.email).length}`);
    console.log(`  Users with phone: ${users.filter(u => u.phone).length}`);
    console.log(`  Users with name: ${users.filter(u => u.name).length}`);
    
    if (privyUsers.length > 0) {
      console.log('\nUsers with Privy DIDs:');
      privyUsers.forEach(user => {
        console.log(`  - ${user.id} (${user.email || user.phone || 'No email/phone'})`);
      });
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkAllUsers();