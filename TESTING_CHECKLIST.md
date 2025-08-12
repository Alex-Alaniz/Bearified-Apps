# Bearified Apps Testing Checklist

## 🔐 Authentication & Access Control

### Privy Authentication
- [ ] Email login with OTP verification
- [ ] Phone login (if configured in Privy)
- [ ] Wallet connection (if configured in Privy)
- [ ] Logout functionality (no infinite loops)
- [ ] Session persistence after page refresh
- [ ] Access denied for non-allowlisted emails

### Role-Based Access
- [ ] Super admin sees all apps and admin panel
- [ ] Regular admin sees admin panel but limited features
- [ ] SoleBrew-only admins see only SoleBrew
- [ ] Chimpanion-only admins see only Chimpanion
- [ ] Users without roles see "Access Pending" message

## 👥 User Management

### User List (`/admin/users`)
- [ ] View all users with correct roles and status
- [ ] Search functionality filters users correctly
- [ ] User count cards show accurate numbers
- [ ] Dropdown menu actions work:
  - [ ] Edit User → navigates to edit page
  - [ ] Manage Roles → navigates to permissions tab
  - [ ] Send Email (placeholder)
  - [ ] Delete User (if implemented)

### Create User (`/admin/users/new`)
- [ ] Form validation for required fields
- [ ] Email format validation
- [ ] Role assignment checkboxes work
- [ ] App access checkboxes work
- [ ] Success message and redirect after creation
- [ ] Error handling for duplicate emails

### Edit User (`/admin/users/[id]`)
- [ ] User data loads correctly
- [ ] Profile tab: Name and status updates save
- [ ] Linked Accounts tab:
  - [ ] Add phone number simulation
  - [ ] Add wallet address simulation
  - [ ] Remove linked accounts
- [ ] Permissions tab:
  - [ ] Toggle roles on/off
  - [ ] Toggle app access on/off
- [ ] Save changes persists data
- [ ] Direct navigation to permissions tab works

## 📱 App Management

### App List (`/admin/apps`)
- [ ] Shows apps from database (not just hardcoded)
- [ ] Search filters apps correctly
- [ ] Status badges display correctly
- [ ] App counts are accurate

### Create App (`/admin/apps/new`)
- [ ] Form validation works
- [ ] Slug auto-generation from name
- [ ] Feature toggles work
- [ ] Role selection works
- [ ] New apps appear in:
  - [ ] App launcher
  - [ ] Admin apps list
  - [ ] User app access options

## 🎯 App Launcher

### App Switcher Component
- [ ] Shows only apps user has access to
- [ ] Disabled/locked apps for users without access
- [ ] Admin panel only visible to admins
- [ ] Database apps merge with hardcoded apps
- [ ] Status badges (Production/Beta/Development)

## ☕ SoleBrew Dashboard

### Access Control
- [ ] Only accessible to authorized roles
- [ ] Access denied message for unauthorized users

### Dashboard Content
- [ ] Development status banner displays
- [ ] Coffee & Sneaker marketplace description accurate
- [ ] Solana integration information visible
- [ ] All placeholder data removed
- [ ] Feature cards show "coming soon" appropriately

## 🤖 Chimpanion Dashboard

### Access Control
- [ ] Only accessible to authorized roles
- [ ] Access denied message for unauthorized users

### Dashboard Content
- [ ] Production status banner with links
- [ ] Blockchain AI description accurate
- [ ] Multi-chain support information
- [ ] ElizaOS integration mentioned
- [ ] All security platform references removed

## 🛠️ Admin Panel

### Dashboard (`/admin`)
- [ ] User count from API (not hardcoded)
- [ ] Database status shows Supabase connection
- [ ] Recent activity shows current user login
- [ ] Quick action buttons work
- [ ] No hardcoded system resource percentages

### Permissions (`/admin/permissions`)
- [ ] Role matrix displays correctly
- [ ] Permission descriptions accurate
- [ ] Toggle switches are interactive (UI only)

### Settings (`/admin/settings`)
- [ ] All tabs load without errors
- [ ] Settings display current configurations
- [ ] Form inputs are functional (UI only)

### Logs (`/admin/logs`)
- [ ] Activity log displays
- [ ] Filters work
- [ ] Export button present

## 🔄 API Endpoints

### User APIs
- [ ] GET `/api/admin/users` - returns user list
- [ ] POST `/api/admin/users` - creates new user
- [ ] GET `/api/admin/users/[id]` - returns specific user
- [ ] PUT `/api/admin/users/[id]` - updates user
- [ ] DELETE `/api/admin/users/[id]` - deletes user (if implemented)

### App APIs
- [ ] GET `/api/apps` - returns active apps
- [ ] GET `/api/admin/apps` - returns all apps
- [ ] POST `/api/admin/apps` - creates new app

### Other APIs
- [ ] GET `/api/admin/stats` - returns user count
- [ ] POST `/api/privy/link` - simulates account linking
- [ ] DELETE `/api/privy/link` - simulates account unlinking

## 🐛 Known Issues to Test

1. **Navigation Issues**
   - [ ] No infinite loops on login/logout
   - [ ] Back button works correctly
   - [ ] Direct URL navigation works

2. **Data Persistence**
   - [ ] Changes save to database
   - [ ] Page refresh maintains data
   - [ ] No data loss on navigation

3. **Error Handling**
   - [ ] API errors show user-friendly messages
   - [ ] Form validation prevents bad data
   - [ ] Loading states display correctly

## 🚀 Deployment Testing

### Vercel Production
- [ ] Environment variables configured
- [ ] Supabase connection works
- [ ] Privy authentication works
- [ ] All routes accessible
- [ ] No build errors
- [ ] No runtime errors in console

### Performance
- [ ] Pages load quickly
- [ ] API responses are fast
- [ ] No memory leaks
- [ ] Images and assets load

## 📝 Additional Testing Notes

### For Team Onboarding
1. Create test user with only `solebrew-admin` role
2. Verify they can:
   - [ ] Login with Privy
   - [ ] See only SoleBrew in app launcher
   - [ ] Access SoleBrew dashboard
   - [ ] Cannot see Chimpanion or Admin Panel

### Security Testing
- [ ] Cannot access admin routes without admin role
- [ ] Cannot bypass Privy allowlist
- [ ] API endpoints require authentication
- [ ] No sensitive data exposed in responses

---

**Last Updated**: [Current Date]
**Tested By**: [Your Name]
**Environment**: [Development/Production]