# App & Team Onboarding Guide

This guide outlines the process for onboarding new applications and their teams to the Bearified Apps platform.

## 🚀 Quick Start Checklist

### For New Apps:
- [ ] Create app configuration 
- [ ] Add app to APP_CONFIGS
- [ ] Set up team roles
- [ ] Invite team members
- [ ] Configure app-specific permissions

### For New Team Members:
- [ ] Create user account
- [ ] Add to Privy allowlist
- [ ] Assign appropriate roles
- [ ] Activate user status

## 📋 Detailed Onboarding Process

### Step 1: Create New App

1. **Via Admin Dashboard** (Recommended)
   - Navigate to `/admin/apps`
   - Click "Add New App"
   - Fill out app details:
     - Name (e.g., "MyApp")
     - Description
     - Icon and color scheme
     - Status (development/beta/production)
     - Features list

2. **Manual Configuration** (Required)
   - Add the generated configuration to `lib/app-configs.ts`
   - Example app config:
   ```typescript
   {
     id: "myapp",
     name: "MyApp", 
     description: "App description",
     icon: "Coffee",
     color: "from-blue-500 to-purple-600",
     href: "/dashboard/myapp",
     requiredRoles: ["super_admin", "admin", "myapp-admin", "myapp-member"],
     features: ["Feature 1", "Feature 2"],
     status: "development", // or "beta" or "production"
     isActive: true,
   }
   ```

### Step 2: Define Team Roles

Each app should have these role types:
- `{app-name}-admin`: App administrators with full access
- `{app-name}-member`: Regular team members with limited access

Example for "MyApp":
- `myapp-admin`
- `myapp-member`

### Step 3: Invite Team Members

#### 3.1 Create User Account
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"founder@myapp.com","name":"App Founder","roles":["myapp-admin"]}' \
  http://localhost:3000/api/admin/users
```

#### 3.2 Add to Privy Allowlist
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"type":"email","value":"founder@myapp.com"}' \
  http://localhost:3000/api/privy/allowlist
```

#### 3.3 Set User Status to Active
- Navigate to `/admin/users`
- Find the user and click "Edit User"
- Set status to "Active"
- Save changes

### Step 4: Role Management

#### Available Role Hierarchy:
1. **super_admin**: Platform owner (Alex) - access to everything
2. **admin**: Platform admin - access to all apps + admin panel
3. **{app}-admin**: App administrator - full access to specific app
4. **{app}-member**: App team member - limited access to specific app

#### Role Assignment Examples:
- **App Founder**: `["myapp-admin"]`
- **Lead Developer**: `["myapp-admin"]` 
- **Developer**: `["myapp-member"]`
- **Designer**: `["myapp-member"]`
- **QA Tester**: `["myapp-member"]`

### Step 5: Verify Access

1. **Check User Dashboard Access**
   - User logs in via Privy
   - Should see their assigned apps in app launcher
   - Can access app-specific features

2. **Verify Role-Based Permissions**
   - Admin users: Full app management access
   - Members: Limited feature access

## 🔧 Administrative Tasks

### Sync Privy Users
Run this to sync allowlist with internal database:
```bash
curl http://localhost:3000/api/privy/allowlist
```

### Update User Roles
Via API or admin dashboard:
```bash
curl -X PUT -H "Content-Type: application/json" \
  -d '{"name":"User Name","roles":["myapp-admin"],"status":"active"}' \
  http://localhost:3000/api/admin/users/{user-slug}
```

### Check User Access
```bash
curl http://localhost:3000/api/admin/users/{user-slug}
```

## 📊 Current System Status

### Active Apps:
- **SoleBrew**: Coffee & Sneaker Marketplace (Development)
- **Chimpanion**: Blockchain AI Companion (Production)
- **Admin Panel**: System Administration (Production)

### User Count: 5 users
- Alex Alaniz (super_admin) - Platform owner
- Alex Test (no roles) - Test phone user  
- App Founder (newapp-admin) - Example app admin
- App Developer (newapp-admin) - Example promoted user
- App Designer (newapp-member) - Example team member

## 🚨 Important Notes

### Security:
- Only `alex@alexalaniz.com` gets `super_admin` role automatically
- All other users start with no roles (pending status)
- Must manually assign roles and activate users
- App access is strictly controlled by role-based permissions

### Development Workflow:
1. Create app via dashboard (generates config)
2. Manually add config to `lib/app-configs.ts`
3. Restart application to load new app
4. Invite team members and assign roles
5. Test access and permissions

### Authentication Methods Supported:
- Email authentication
- SMS/Phone authentication  
- Wallet address authentication
- All managed through Privy integration

## 🎯 Ready for Production Onboarding

The system is ready to onboard new apps and teams with:
- ✅ Working user creation and role assignment
- ✅ Privy allowlist integration
- ✅ Role-based access controls
- ✅ Status management (pending → active)
- ✅ App-specific permission system
- ✅ Human-readable user management URLs
- ✅ Real-time data in admin dashboards

Start onboarding by following the Step-by-Step process above!