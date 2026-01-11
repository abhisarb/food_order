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
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client

## 🎯 Features

### Role-Based Access Control (RBAC)
- **Admin**: Full access - manage orders, checkout, cancel, and manage payment methods
- **Manager**: Can create, checkout, and cancel orders
- **Member**: Can only view restaurants/menus and create orders (cannot checkout)

### Country-Based Access Control (Re-BAC)
- Users can only access restaurants in their assigned country (India or America)
- Orders can only be placed at restaurants within the user's country

### Core Features
- ✅ View restaurants and menu items (all roles)
- ✅ Create food orders with multiple items (all roles)
- ✅ Checkout & pay for orders (Admin/Manager only)
- ✅ Cancel orders (Admin/Manager only)
- ✅ Manage payment methods (Admin only)

## 📦 Database Schema

```prisma
- Country (India, America)
- User (with role: ADMIN, MANAGER, MEMBER)
- Restaurant (belongs to Country)
- MenuItem (belongs to Restaurant)
- Order (belongs to User and Restaurant)
- OrderItem (line items in Order)
- PaymentMethod (belongs to User, Admin only)
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database with mock data
npx ts-node prisma/seed.ts

# Start development server
npm run start:dev
```

**Backend will run on**: `http://localhost:4000`
**GraphQL Playground**: `http://localhost:4000/graphql`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

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

## 🔧 GraphQL API Examples

### Login
```graphql
mutation Login {
  login(input: {
    email: "admin@india.com"
    password: "password123"
  }) {
    access_token
    user {
      id
      name
      role
      country {
        name
      }
    }
  }
}
```

### Get Restaurants (Country-filtered)
```graphql
query GetRestaurants {
  restaurants {
    id
    name
    description
    imageUrl
    country {
      name
    }
  }
}
```

### Create Order
```graphql
mutation CreateOrder {
  createOrder(input: {
    restaurantId: "restaurant_id_here"
    items: [
      { menuItemId: "item_id_1", quantity: 2 }
      { menuItemId: "item_id_2", quantity: 1 }
    ]
  }) {
    id
    status
    total
    items {
      menuItem {
        name
      }
      quantity
      price
    }
  }
}
```

### Checkout Order (Admin/Manager only)
```graphql
mutation Checkout {
  checkoutOrder(orderId: "order_id_here") {
    id
    status
    paidAt
  }
}
```

## 🏛️ Project Structure

### Backend
```
backend/
├── prisma/
│   ├── schema.prisma       # Database models
│   └── seed.ts             # Mock data
├── src/
│   ├── auth/               # Authentication & JWT
│   ├── common/
│   │   ├── decorators/     # @CurrentUser, @Roles
│   │   └── guards/         # GqlAuthGuard, RolesGuard
│   ├── prisma/             # Prisma service
│   ├── restaurants/        # Restaurant module
│   ├── menu-items/         # Menu items module
│   ├── orders/             # Orders module (with RBAC)
│   ├── payment-methods/    # Payment methods (Admin only)
│   └── app.module.ts       # Main module
```

### Frontend
```
frontend/
├── src/
│   ├── app/
│   │   ├── login/          # Login page
│   │   ├── restaurants/    # Restaurants listing
│   │   ├── menu/           # Menu items
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout (Admin/Manager)
│   │   ├── orders/         # Order management
│   │   └── payment-methods/ # Payment methods (Admin)
│   ├── components/         # Reusable components
│   ├── lib/
│   │   ├── apollo-client.ts # GraphQL client
│   │   └── auth-context.tsx # Auth provider
│   └── graphql/            # GraphQL queries & mutations
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
- **Fast**: Optimized bundle sizes, lazy loading

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=4000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## 🚧 Known Issues & TODO

- [ ] Fix Apollo Server integration package compatibility
- [ ] Add real-time order updates with GraphQL subscriptions
- [ ] Implement pagination for restaurants and orders
- [ ] Add image upload for restaurant/menu items
- [ ] Deploy to production (Vercel + Railway/Render)

## 📚 Tech Stack Details

### Backend Dependencies
- `@nestjs/common`, `@nestjs/core` - NestJS framework
- `@nestjs/graphql`, `@nestjs/apollo` - GraphQL integration
- `@nestjs/passport`, `@nestjs/jwt` - Authentication
- `@prisma/client`, `prisma` - Database ORM
- `bcrypt` - Password hashing
- `graphql`, `@apollo/server` - GraphQL server

### Frontend Dependencies
- `next` - React framework
- `react`, `react-dom` - UI library
- `@apollo/client` - GraphQL client
- `tailwindcss` - Styling
- `typescript` - Type safety

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (all roles + countries)
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ using NestJS, Next.js, GraphQL, and Prisma**npx 
