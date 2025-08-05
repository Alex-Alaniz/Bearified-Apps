# Bearified Apps - Unified Business Platform

A comprehensive multi-app platform hosting SoleBrew (coffee shop management), Chimpanion (security & business intelligence), and a powerful project management system with Kanban boards, real-time collaboration, and advanced analytics.

## 🚀 Features

### Core Platform
- **Multi-App Architecture**: Unified platform for multiple business applications
- **Hybrid Authentication**: Support for both mock auth (development) and Privy integration (production)
- **Role-Based Access Control**: Super admin, admin, and user roles with granular permissions
- **Modern UI**: Built with Next.js 14, Tailwind CSS, and shadcn/ui components

### Project Management System
- **Drag-and-Drop Kanban Boards**: Intuitive task management with @dnd-kit
- **Rich Task Cards**: Priority indicators, assignees, labels, due dates, and time tracking
- **Real-time Collaboration**: Live updates with Supabase Realtime
- **Multiple Views**: Kanban, List, and Calendar views (List & Calendar coming soon)
- **Advanced Analytics**: Project progress tracking and team performance metrics
- **Custom Fields**: Extensible task and project metadata

### Applications
- **SoleBrew**: Coffee shop management system (development)
- **Chimpanion**: Security and business intelligence platform (production)
- **Admin Panel**: System administration interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime, Storage)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **State Management**: React Query + Context API
- **Authentication**: Privy integration with fallback to mock users
- **Deployment**: Vercel

## 📋 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account and project
- Vercel account (for deployment)

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/Bearified-Apps.git
cd Bearified-Apps
pnpm install
```

### 2. Environment Setup
Create `.env.local` with your Supabase credentials:
```env
# Authentication
NEXT_PUBLIC_USE_PRIVY_AUTH=false
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup
Run the SQL schema in your Supabase SQL editor:
```bash
# Copy and paste the contents of scripts/project-management-schema.sql
# into your Supabase SQL editor and execute
```

### 4. Development
```bash
pnpm dev
```
Visit `http://localhost:3000` and sign in with demo users:
- **Super Admin**: alex@alexalaniz.com
- **Admin**: admin@company.com  
- **User**: user@company.com

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── projects/             # Project CRUD endpoints
│   │   └── tasks/                # Task CRUD endpoints
│   ├── dashboard/                # Main application pages
│   │   ├── projects/             # Project management
│   │   ├── solebrew/             # Coffee shop app
│   │   └── chimpanion/           # Security platform
│   └── admin/                    # Admin interface
├── components/                   # Reusable UI components
│   ├── project-management/       # PM-specific components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities and configurations
│   ├── types/                    # TypeScript definitions
│   ├── hooks/                    # Custom React hooks
│   └── auth-context.tsx          # Authentication logic
└── scripts/                      # Database schemas
```

## 🎯 Implementation Status

### ✅ Phase 1 - Foundation (Completed)
- [x] Database schema with 10+ tables and RLS policies
- [x] TypeScript interfaces for all data models
- [x] RESTful API endpoints for CRUD operations
- [x] Drag-and-drop Kanban board with @dnd-kit
- [x] Enhanced task cards with rich metadata
- [x] Project selection and filtering
- [x] Authentication integration

### 🔄 Phase 2 - Core Features (In Progress)
- [ ] List view implementation
- [ ] Calendar view implementation
- [ ] Task creation and editing modals
- [ ] File attachments and comments
- [ ] Basic time tracking
- [ ] Search functionality

### 📅 Phase 3 - Advanced Features (Planned)
- [ ] Real-time collaboration
- [ ] Project analytics and reporting
- [ ] Automation rules and workflows
- [ ] Team management and permissions
- [ ] Mobile responsiveness improvements

### 🎨 Phase 4 - Enterprise Features (Planned)
- [ ] Advanced reporting dashboards
- [ ] API integrations and webhooks
- [ ] Bulk operations and imports
- [ ] Performance optimizations
- [ ] Security enhancements

## 🔧 Development Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 📊 Database Schema

The project uses a comprehensive PostgreSQL schema with:
- **Projects**: Core project management with progress tracking
- **Tasks**: Hierarchical tasks with dependencies and custom fields
- **Users & Permissions**: Role-based access control
- **Comments & Attachments**: Rich collaboration features
- **Time Tracking**: Detailed time logging and reporting
- **Analytics Views**: Pre-computed statistics and metrics

Key features:
- Row Level Security (RLS) for data protection
- Automatic triggers for progress calculation
- Optimized indexes for performance
- Support for custom fields and templates

## 🔐 Authentication

### Development Mode (Mock Auth)
Set `NEXT_PUBLIC_USE_PRIVY_AUTH=false` to use mock authentication with predefined test users.

### Production Mode (Privy)
Set `NEXT_PUBLIC_USE_PRIVY_AUTH=true` and configure Privy credentials for production authentication with social logins.

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Link Supabase project through Vercel integrations
4. Deploy automatically on push to main branch

### Supabase Setup
1. Create new Supabase project
2. Run the SQL schema from `scripts/project-management-schema.sql`
3. Configure RLS policies and enable Realtime
4. Set up authentication providers (if using Privy)

## 📚 Documentation

Detailed documentation available in:
- `CLAUDE.md` - Development guidelines for AI assistants
- `PROJECT_ARCHITECTURE.md` - Technical architecture overview
- `PROJECT_MANAGEMENT_FEATURES.md` - Comprehensive feature list
- `IMPLEMENTATION_PLAN.md` - Detailed development roadmap

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🛟 Support

For support and questions:
- Create an issue in this repository
- Check the documentation files
- Review the implementation plan for roadmap details

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.