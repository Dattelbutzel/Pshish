# Commerzbank Phishing Panel

## Overview

This is a phishing demonstration tool specifically designed for Commerzbank (German bank) educational purposes. The application consists of two main components: an administrative panel for monitoring captured data and a realistic phishing site that mimics Commerzbank's login page. The tool captures login credentials with IP addresses for cybersecurity education and awareness training.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Database storage with real-time persistence
- **Development**: Hot-reload with Vite integration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: Neon Database serverless connection
- **Schema Management**: Type-safe schema definitions with Zod validation

## Key Components

### Core Features
1. **Admin Panel**: Real-time monitoring dashboard showing captured credentials with IP addresses
2. **Phishing Site**: Realistic Commerzbank login page that captures user credentials
3. **Data Capture**: Automatic logging of usernames, passwords, and IP addresses
4. **Live Updates**: Admin panel refreshes every 2 seconds to show new captures
5. **Export Functionality**: Download captured data as JSON files

### Database Schema  
- **phishing_attempts**: Stores IP address, username, password, user agent, and timestamp
- **session_stats**: Tracks total attempts and counters

### API Endpoints
- `GET /api/stats` - Retrieve session statistics
- `POST /api/phishing-attempts` - Capture login attempt data with IP address
- `GET /api/phishing-attempts` - Retrieve all captured attempts
- `POST /api/reset` - Reset all captured data
- `DELETE /api/phishing-attempts` - Clear captured attempts

### UI Components
- **AdminPanel**: Main dashboard for monitoring captures with IP addresses
- **PhishingSite**: Authentic-looking Commerzbank login page in German
- **Real-time Table**: Shows timestamps, IPs, usernames, and masked passwords

## Data Flow

1. **User Interaction**: User selects a phishing scenario from the dashboard
2. **Scenario Rendering**: Fake login page is displayed with educational overlays
3. **Data Capture**: Form submissions are intercepted and stored via API
4. **Statistics Update**: Session stats are updated in real-time
5. **Educational Feedback**: Captured data is displayed to show attack effectiveness
6. **Prevention Education**: Tips and red flags are presented to users

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for React
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS post-processing

### Validation & Utilities
- **zod**: Runtime type validation
- **class-variance-authority**: Type-safe CSS class variants
- **date-fns**: Date manipulation utilities

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot-reload via `npm run dev`
- **Production Build**: Optimized build with `npm run build`
- **Production Server**: Node.js server with `npm run start`

### Platform Integration
- **Replit Configuration**: Configured for Replit deployment with autoscale
- **Database**: Requires PostgreSQL connection via DATABASE_URL environment variable
- **Port Configuration**: Server runs on port 5000, exposed as port 80 externally

### Build Process
1. Frontend assets built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served from Express in production
4. Database migrations applied via `npm run db:push`

## Changelog
```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```