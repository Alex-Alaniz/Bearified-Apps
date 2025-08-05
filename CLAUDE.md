# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
pnpm dev

# Build the application
pnpm build

# Start production server
pnpm start

# Lint the codebase
pnpm lint
```

## Code Architecture

### Multi-App Platform Structure
This is a unified business platform called "Bearified Apps" that hosts multiple applications:
- **SoleBrew**: Coffee shop management system
- **Chimpanion**: Security and business intelligence platform
- **Admin Panel**: System administration interface

### Authentication & Authorization
- **Hybrid Authentication System**: Supports both mock auth (development) and Privy integration (production)
- **Environment-Controlled**: Set `NEXT_PUBLIC_USE_PRIVY_AUTH=true` to enable Privy authentication
- **Mock Auth (Development)**: Uses `lib/auth-context.tsx` with predefined test users
- **Privy Integration (Production)**: Uses `lib/privy-auth-context.tsx` with fallback to test users
- **User Roles**: `user`, `admin`, `super_admin` with role-based access control
- **App Status Tagging**: Applications marked as `production`, `development`, or `beta` in `lib/app-configs.ts`
- **Live Test Users**: Transition system allows testing with real Privy users while maintaining test user access
- **Supabase Integration**: Available for data persistence and user management

### Key Components
- `app-switcher.tsx`: Grid-based application launcher with role-based access and status badges
- `modular-sidebar.tsx`: Navigation sidebar with conditional admin sections
- `privy-provider.tsx`: Wrapper component for Privy authentication integration
- Role-based routing and component visibility throughout the app

### Data Layer
- Supabase client configured in `lib/supabase.ts`
- Database schemas available in `scripts/` directory
- Type definitions for User, App, and UserRole entities

### UI Framework
- Next.js 14 with App Router
- Tailwind CSS with shadcn/ui components
- Radix UI primitives for accessibility
- Custom CSS variables for theming

### File Organization
- `app/`: Next.js app router pages
- `components/`: Reusable UI components and layouts  
- `lib/`: Utilities, contexts, and configurations
  - `auth-context.tsx`: Mock authentication (development)
  - `privy-auth-context.tsx`: Hybrid Privy integration (production)
  - `privy-config.ts`: Privy configuration and helper functions
  - `app-configs.ts`: Centralized app configurations with status badges
- `hooks/`: Custom React hooks
- `scripts/`: Database schema files

### Chimpanion Production Reference
The Chimpanion app is in production at `/Users/alexalaniz/Documents/GitHub/chimpanion` and serves as the reference implementation. Key directories:
- `src/`: Main web application with comprehensive API routes, components, and services
- `mobile/`: React Native mobile app with authentication, wallet integration, and chat features

**Available Components from Chimpanion**:
- ElizaOS chat integration and AI agent framework
- Blockchain wallet services (multi-chain support)
- Authentication with Privy integration
- Real-time chat with WebSocket support
- Mobile-optimized components and navigation
- Comprehensive API endpoints for all features

**Implementation Pattern**: Components and services from the Chimpanion production app can be adapted and integrated into this unified platform to build out the Chimpanion section.

### Development Notes
- TypeScript with strict mode enabled
- ESLint and TypeScript errors are ignored during builds (configured in next.config.mjs)
- Uses pnpm for package management
- Custom path alias `@/*` maps to project root