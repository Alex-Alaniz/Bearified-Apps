const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function findUser() {
  try {
    // Search by exact Privy ID
    console.log('Searching for user with Privy ID: cmeq1yris02hbih0bqcy5xswv');
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'cmeq1yris02hbih0bqcy5xswv')
      .single();
    
    if (!error && user) {
      console.log('✅ Found user by Privy ID:');
      console.log(JSON.stringify(user, null, 2));
      return;
    }

    // Search by Privy ID with did:privy: prefix
    console.log('Searching for user with full Privy ID: did:privy:cmeq1yris02hbih0bqcy5xswv');
    ({ data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'did:privy:cmeq1yris02hbih0bqcy5xswv')
      .single());
    
    if (!error && user) {
      console.log('✅ Found user by full Privy ID:');
      console.log(JSON.stringify(user, null, 2));
      return;
    }
    
    // Search by phone number
    console.log('Searching for user with phone 4077243995...');
    ({ data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', '4077243995')
      .single());
      
    if (!error && user) {
      console.log('✅ Found user by phone:');
      console.log(JSON.stringify(user, null, 2));
      return;
    }
    
    // Search by phone email format
    console.log('Searching for user with phone_4077243995@privy.user...');
    ({ data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'phone_4077243995@privy.user')
      .single());
      
    if (!error && user) {
      console.log('✅ Found user by phone email:');
      console.log(JSON.stringify(user, null, 2));
      return;
    }

    console.log('❌ User not found in any search method');
    
    // List all phone users
    console.log('\n📱 All phone users in database:');
    const { data: phoneUsers, error: phoneError } = await supabase
      .from('users')
      .select('*')
      .like('email', 'phone_%@privy.user');
    
    if (phoneUsers) {
      phoneUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) ID: ${u.id} Phone: ${u.phone} Roles: ${u.roles?.join(', ') || 'none'}`);
      });
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

findUser();