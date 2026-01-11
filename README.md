# Full-Stack Role-Based Food Ordering Application

A comprehensive food ordering platform with role-based access control (RBAC) and relationship-based access control (Re-BAC) built with modern technologies.

## 🏗️ Architecture

### Backend
- **Framework**: NestJS
- **API**: GraphQL with Apollo Server
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: JWT with Passport

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **Animations**: Framer Motion

## 🎯 Features

### Role-Based Access Control (RBAC)
- **Admin**: Full access - manage orders, checkout, cancel, and manage payment methods
- **Manager**: Can create, checkout, and cancel orders
- **Member**: Can only view restaurants/menus and create orders (cannot checkout)

### Country-Based Access Control (Re-BAC)
- Users can only access restaurants in their assigned country (India or USA)
- Orders can only be placed at restaurants within the user's country

### Core Features
- ✅ View restaurants and menu items (all roles)
- ✅ Create food orders with multiple items (all roles)
- ✅ Shopping cart with persistent storage
- ✅ Checkout & pay for orders (Admin/Manager only)
- ✅ Cancel orders (Admin/Manager only)
- ✅ Manage payment methods (Admin only)
- ✅ Order history and tracking

## 📦 Database Schema

```prisma
- Country (India, USA)
- User (with role: ADMIN, MANAGER, MEMBER)
- Restaurant (belongs to Country)
- MenuItem (belongs to Restaurant)
- Order (belongs to User and Restaurant)
- OrderItem (line items in Order)
- PaymentMethod (belongs to User, Admin only)
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Synchronize database
npx prisma db push

# Seed database with mock data
npx ts-node prisma/seed.ts

# Start development server
npm run start:dev
```

**Backend API**: `http://localhost:4000/graphql` (Playground)

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend App**: `http://localhost:3000`

## 👤 Test Accounts

After seeding, use these accounts to test different roles:

### India Users
- **Admin**: admin@india.com / password123
- **Manager**: manager@india.com / password123
- **Member**: member@india.com / password123

### USA Users
- **Admin**: admin@usa.com / password123
- **Manager**: manager@usa.com / password123
- **Member**: member@usa.com / password123

## 🏛️ Project Structure

```
food_order/
├── backend/                # NestJS + GraphQL + Prisma
│   ├── prisma/             # Schema & Seeding
│   └── src/                # API Logic (Auth, Orders, etc.)
└── frontend/               # Next.js 15 + Apollo Client
    ├── src/app/            # App Router Pages
    ├── src/components/     # Reusable UI
    ├── src/context/        # Auth & Cart Providers
    └── src/graphql/        # Queries & Mutations
```

## 🔐 Security Features

- JWT-based authentication
- Role-based guards on GraphQL resolvers
- Country-based data filtering
- Password hashing with bcrypt
- Protected routes on frontend

## 🎨 Design Philosophy

- **Modern UI**: Gradient designs, smooth animations, premium feel
- **Responsive**: Mobile-first design approach
- **Accessible**: Semantic HTML, ARIA labels

## 📝 Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

---

**Built with ❤️ using NestJS, Next.js, GraphQL, and Prisma**
