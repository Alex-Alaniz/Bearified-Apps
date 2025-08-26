const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function grantSolebrewAccess() {
  const targetPrivyId = 'cmeq1yris02hbih0bqcy5xswv';
  const targetPhone = '4077243995';
  
  try {
    console.log('🔍 Looking for user with Privy ID:', targetPrivyId);
    console.log('🔍 Phone number:', targetPhone);
    console.log('');

    // First, let's see if the user exists with any variant of the ID
    const searchVariants = [
      targetPrivyId,
      `did:privy:${targetPrivyId}`,
      `phone_${targetPhone}@privy.user`,
      `phone_1${targetPhone}@privy.user` // with country code
    ];

    let foundUser = null;
    
    for (const variant of searchVariants) {
      console.log(`Searching for: ${variant}`);
      
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', variant)
        .single();
        
      if (!error && user) {
        foundUser = user;
        console.log('✅ Found user by ID!');
        break;
      }
      
      // Also try by email
      ({ data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', variant)
        .single());
        
      if (!error && user) {
        foundUser = user;
        console.log('✅ Found user by email!');
        break;
      }
    }

    if (!foundUser) {
      console.log('❌ User not found in database.');
      console.log('');
      console.log('💡 This means the user hasn\'t logged into the app yet.');
      console.log('📱 When they first log in with phone number (407) 724-3995,');
      console.log('   a new user will be created with NO roles (no access).');
      console.log('');
      console.log('🔧 SOLUTION: They need to:');
      console.log('   1. Log into the app once (this creates their database record)');
      console.log('   2. Then an admin can grant them SoleBrew access');
      console.log('');
      console.log('🎯 ALTERNATIVE: Create user manually with solebrew-member role');
      
      // Ask if we should create the user
      console.log('');
      console.log('Would you like to pre-create this user with SoleBrew access?');
      console.log('This will allow them to access SoleBrew immediately when they log in.');
      
      // For now, let's create the user with SoleBrew access
      console.log('');
      console.log('📝 Creating user with SoleBrew access...');
      
      const newUser = {
        id: `did:privy:${targetPrivyId}`,
        email: `phone_1${targetPhone}@privy.user`,
        name: `Phone User (${targetPhone})`,
        phone: targetPhone,
        roles: ['solebrew-member'], // Grant SoleBrew access
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating user:', createError);
        return;
      }

      console.log('✅ User created successfully!');
      console.log('User details:', JSON.stringify(createdUser, null, 2));
      console.log('');
      console.log('🎉 User can now access SoleBrew!');
      return;
    }

    // User exists, let's check their current roles
    console.log('');
    console.log('📋 Current user details:');
    console.log(`   Name: ${foundUser.name}`);
    console.log(`   Email: ${foundUser.email}`);
    console.log(`   Phone: ${foundUser.phone || 'Not set'}`);
    console.log(`   Current roles: ${foundUser.roles?.join(', ') || 'None'}`);
    console.log('');

    // Check if they already have SoleBrew access
    const hasSolebrewAccess = foundUser.roles && (
      foundUser.roles.includes('solebrew-admin') ||
      foundUser.roles.includes('solebrew-member') ||
      foundUser.roles.includes('admin') ||
      foundUser.roles.includes('super_admin')
    );

    if (hasSolebrewAccess) {
      console.log('✅ User already has SoleBrew access!');
      return;
    }

    // Grant SoleBrew access
    console.log('🔧 Granting SoleBrew access...');
    
    const updatedRoles = [...(foundUser.roles || []), 'solebrew-member'];
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ 
        roles: updatedRoles,
        updated_at: new Date().toISOString()
      })
      .eq('id', foundUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating user roles:', updateError);
      return;
    }

    console.log('✅ Successfully granted SoleBrew access!');
    console.log(`   New roles: ${updatedUser.roles.join(', ')}`);
    console.log('');
    console.log('🎉 User can now access SoleBrew!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

grantSolebrewAccess();