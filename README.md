# PrintCare Business Management System

A comprehensive business management system built with Next.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Create the project
npx create-next-app@latest printcare-management --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd printcare-management

# Install dependencies
npm install @prisma/client prisma next-auth bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install lucide-react recharts date-fns react-hook-form @hookform/resolvers zod
npm install -D tsx
```

### 2. Setup PostgreSQL Database

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE printcare_db;
CREATE USER printcare_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE printcare_db TO printcare_user;
\q
```

### 3. Environment Configuration

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://printcare_user:your_password@localhost:5432/printcare_db?schema=public"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-characters-long"

# App Settings
NODE_ENV=development
```

### 4. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx prisma db seed
```

### 5. Run the Application

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── admin/
│   │   ├── clients/
│   │   ├── printers/
│   │   ├── orders/
│   │   ├── complaints/
│   │   ├── dispatch/
│   │   ├── billing/
│   │   ├── mis/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx
│   ├── ui/
│   ├── forms/
│   └── tables/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
└── types/
```

## 🗄️ Database Schema Overview

### Core Tables:
- **Users** - System users with roles (ADMIN, MANAGER, EMPLOYEE, CLIENT)
- **Clients** - Customer companies with detailed information
- **Branches** - Client branch locations
- **PrinterModels** - Printer model catalog
- **Printers** - Individual printer inventory
- **ClientPrinters** - Printers assigned to clients
- **CartridgeModels** - Cartridge specifications
- **Cartridges** - Individual cartridge inventory
- **Orders** - Customer orders
- **OrderItems** - Order line items
- **Dispatches** - Shipment tracking
- **Bills** - Billing information
- **Payments** - Payment records
- **Complaints** - Customer complaint tracking
- **Agreements** - Service agreements
- **PageCounting** - Printer usage tracking
- **AuditLog** - System activity logging
- **Settings** - Application configuration

## 🔐 Default Login Credentials

```
Username: admin
Password: admin123
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:push      # Push schema changes
npm run db:migrate   # Create and run migrations
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

## 🎯 Key Features

### ✅ Implemented
- 🔐 **Authentication & Authorization** - Role-based access control
- 📊 **Dashboard** - Real-time statistics and quick actions
- 👥 **User Management** - Admin panel for user management
- 📱 **Responsive Design** - Mobile-friendly interface
- 🗄️ **Database Schema** - Comprehensive business data model

### 🚧 To Be Implemented
- **Client Management** - Complete CRUD operations
- **Printer Management** - Inventory and allocation
- **Order Processing** - Full order lifecycle
- **Complaint System** - Ticket management
- **Dispatch Tracking** - Delivery management
- **Billing & Payments** - Financial management
- **MIS Reports** - Analytics and reporting
- **Real-time Notifications** - WebSocket integration
- **File Upload** - Document management
- **Export Functions** - PDF/Excel generation

## 🔧 Development Guidelines

### Adding New Features

1. **Database Changes**
   ```bash
   # Update schema.prisma
   # Run migration
   npx prisma db push
   npx prisma generate
   ```

2. **API Routes**
   ```typescript
   // app/api/[module]/route.ts
   export async function GET() { }
   export async function POST() { }
   ```

3. **Pages**
   ```typescript
   // app/dashboard/[module]/page.tsx
   export default function ModulePage() {
     return <div>Module content</div>
   }
   ```

4. **Components**
   ```typescript
   // components/[module]/ModuleComponent.tsx
   export default function ModuleComponent() {
     return <div>Component</div>
   }
   ```

### Code Style
- Use TypeScript for all files
- Follow ESLint rules
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

## 📚 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env.local
   - Ensure database exists

2. **Authentication Issues**
   - Check NEXTAUTH_SECRET is set
   - Verify NEXTAUTH_URL matches your domain

3. **Build Errors**
   - Run `npm run db:generate`
   - Clear .next folder and rebuild

### Getting Help:

1. Check the logs in terminal
2. Use `npx prisma studio` to inspect database
3. Review Next.js and Prisma documentation
4. Check browser console for client-side errors

---

**Happy Coding! 🎉**