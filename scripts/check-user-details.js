const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserDetails() {
  try {
    console.log('Checking problematic user details...\n');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'did:privy:cmely1iyi023cl80bn7pkyp3j')
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return;
    }

    console.log('User Details:');
    console.log('-------------');
    Object.entries(user).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        console.log(`${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`);
      }
    });
    
    console.log('\nAnalysis:');
    console.log('----------');
    
    // Check if this is actually a phone or wallet user
    if (user.name?.includes('Phone User')) {
      console.log('✓ This appears to be a phone user based on the name');
      console.log('✗ But no phone number is stored in the phone field');
      console.log('→ Need to extract phone number from Privy and update the phone field');
    } else if (user.name?.includes('Wallet User')) {
      console.log('✓ This appears to be a wallet user based on the name');
      console.log('→ Wallet address should be extracted from the name field');
    } else {
      console.log('? Cannot determine user type from available data');
      console.log('→ May need to query Privy API to get actual user details');
    }
    
    console.log('\nRecommended Fix:');
    console.log('----------------');
    console.log('1. Query Privy API to get the actual user details for this DID');
    console.log('2. Update the database with:');
    console.log('   - Correct email (if email user)');
    console.log('   - Phone number in phone field (if phone user)');
    console.log('   - Proper linked_accounts JSON structure');
    console.log('3. This will enable human-readable URLs like /admin/users/phone-1234');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkUserDetails();