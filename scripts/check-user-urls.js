const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Copy of getUserSlug function from user-utils.ts
function getUserSlug(user) {
  // Generate a human-readable slug for URLs
  if (user.email && !user.email.startsWith('did:privy:')) {
    // For email users, use the part before @
    return user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
  }
  
  if (user.phone) {
    // For phone users, use last 4 digits
    const digits = user.phone.replace(/\D/g, '')
    return `phone-${digits.slice(-4)}`
  }
  
  if (user.name?.includes('Wallet User')) {
    // For wallet users, use first 6 chars of address
    const match = user.name.match(/\(0x([a-fA-F0-9]{6})/)
    if (match) {
      return `wallet-${match[1].toLowerCase()}`
    }
  }
  
  // Fallback to ID
  return user.id
}

async function checkUserUrls() {
  try {
    console.log('Analyzing user URLs...\n');
    
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

    console.log('User URL Analysis:\n');
    
    users.forEach((user, index) => {
      const slug = getUserSlug(user);
      console.log(`User ${index + 1}: ${user.name || 'Unknown'}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Phone: ${user.phone || 'N/A'}`);
      console.log(`  Database ID: ${user.id}`);
      console.log(`  Generated Slug: ${slug}`);
      console.log(`  Admin URL: /admin/users/${slug}`);
      
      // Check if slug is still a Privy DID
      if (slug.startsWith('did:privy:')) {
        console.log(`  ⚠️  WARNING: URL still contains Privy DID!`);
        console.log(`  Reason: ${!user.phone ? 'No phone number stored' : 'Unknown'}`);
      } else {
        console.log(`  ✅ Human-readable URL generated`);
      }
      
      console.log('---\n');
    });
    
    // Summary
    const privyUrls = users.filter(u => getUserSlug(u).startsWith('did:privy:'));
    const humanUrls = users.filter(u => !getUserSlug(u).startsWith('did:privy:'));
    
    console.log('Summary:');
    console.log(`  Total users: ${users.length}`);
    console.log(`  Users with human-readable URLs: ${humanUrls.length}`);
    console.log(`  Users with Privy DID URLs: ${privyUrls.length}`);
    
    if (privyUrls.length > 0) {
      console.log('\nUsers that need fixing:');
      privyUrls.forEach(user => {
        console.log(`  - ${user.name || user.email} (${user.id})`);
        if (user.email === user.id) {
          console.log(`    Problem: Email field contains Privy DID instead of actual email`);
        }
        if (!user.phone) {
          console.log(`    Problem: No phone number stored for phone user`);
        }
      });
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkUserUrls();