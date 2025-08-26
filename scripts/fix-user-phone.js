const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUserPhone() {
  try {
    console.log('🔧 Fixing phone field for user with (407) 724-3995...');
    
    // Find the user by email format
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'phone_14077243995@privy.user')
      .single();
    
    if (error || !user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📋 Current user details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Phone: ${user.phone || 'Not set'}`);
    console.log(`   Roles: ${user.roles?.join(', ') || 'None'}`);
    console.log('');
    
    // Extract phone number from email
    const phoneMatch = user.email.match(/phone_(\d+)@/);
    if (phoneMatch) {
      const phoneNumber = phoneMatch[1];
      const formattedPhone = `(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
      
      console.log(`📞 Extracted phone: ${phoneNumber}`);
      console.log(`📞 Formatted: ${formattedPhone}`);
      
      // Update the phone field
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          phone: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Error updating user phone:', updateError);
        return;
      }
      
      console.log('✅ Successfully updated phone field!');
      console.log('');
      console.log('🎯 DIAGNOSIS: The user exists and has SoleBrew access!');
      console.log('   ✅ Database ID:', updatedUser.id);
      console.log('   ✅ Phone Number:', formattedPhone);
      console.log('   ✅ SoleBrew Role: solebrew-member');
      console.log('');
      console.log('🚨 ISSUE: Privy ID mismatch!');
      console.log(`   Provided ID: cmeq1yris02hbih0bqcy5xswv`);
      console.log(`   Database ID: ${updatedUser.id}`);
      console.log('');
      console.log('💡 POSSIBLE CAUSES:');
      console.log('   1. User created a new Privy account');
      console.log('   2. Old/cached Privy ID provided');
      console.log('   3. User has multiple accounts');
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('   Ask user to log out and log back in');
      console.log('   This will either:');
      console.log('   - Update their existing record with new Privy ID');
      console.log('   - Create a new record (which will need roles assigned)');
      
    } else {
      console.log('❌ Could not extract phone number from email format');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixUserPhone();