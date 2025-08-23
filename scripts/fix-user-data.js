const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserData() {
  try {
    console.log('Fixing user data to enable human-readable URLs...\n');
    
    // For now, let's manually fix the test user
    // In a real scenario, we'd fetch this from Privy API
    const testUserFixes = {
      'did:privy:cmely1iyi023cl80bn7pkyp3j': {
        email: 'alex.test@example.com', // Assuming this is the real email
        phone: null,
        linked_accounts: {
          email: 'alex.test@example.com',
          phone: null,
          wallet: null
        }
      }
    };
    
    for (const [userId, fixes] of Object.entries(testUserFixes)) {
      console.log(`Updating user ${userId}...`);
      
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          email: fixes.email,
          phone: fixes.phone,
          linked_accounts: fixes.linked_accounts,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating user ${userId}:`, error);
      } else {
        console.log(`✅ Updated user successfully`);
        console.log(`   New email: ${updatedUser.email}`);
        console.log(`   New slug will be: ${updatedUser.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
      }
    }
    
    console.log('\nDone! The user should now have a human-readable URL.');
    console.log('\nNote: In a production environment, you would:');
    console.log('1. Query the Privy API to get actual user details');
    console.log('2. Update the database with real email/phone data');
    console.log('3. Store phone numbers in the phone field for phone users');
    console.log('4. Store wallet addresses properly for wallet users');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Uncomment the line below to actually run the fix
// fixUserData();

console.log('This script will fix user data to enable human-readable URLs.');
console.log('Review the code and uncomment the last line to run it.');