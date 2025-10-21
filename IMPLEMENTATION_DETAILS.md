# WMNM - Implementation Details

## Project Overview

**WMNM (Working Man Needs Money)** is a Next.js-based web application that connects service professionals with customers. The platform enables customers to find local professionals, send inquiries, and schedule appointments, while professionals can manage their business, track earnings, and respond to customer requests.

## Architecture

### Technology Stack

- **Framework**: Next.js 14.2.25 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives + shadcn/ui components
- **Charts**: Recharts 2.15.4
- **Form Validation**: React Hook Form + Zod
- **Notifications**: Sonner (toast notifications)
- **State Management**: React hooks + sessionStorage (mock backend)

### Project Structure

```
/app
  /customer
    /dashboard              - Browse service categories
    /professionals          - View professionals by category
    /professional/[id]      - Professional profile + inquiry form
    /inquiries              - Customer's inquiries list
    /appointments           - Customer's appointments (grouped by category)
    /payments               - View and pay invoices from professionals
    /login                  - Customer login
  /professional
    /home                   - Professional dashboard with earnings charts
    /inquiries              - Professional's inquiries from customers
    /appointments           - Professional's appointments (grouped by customer)
    /jobs                   - Job tracking & payment management
    /expenses               - Expense tracking by category
    /form-builder           - Customize inquiry form
    /profile                - Edit business profile
    /login                  - Professional login
  /chat/[id]                - Chat interface for inquiries
  /page.tsx                 - Landing page
  /layout.tsx               - Root layout with Toaster

/components
  /ui                       - Reusable UI components (shadcn/ui)
  app-header.tsx            - Navigation header (user-type aware)
  appointment-*.tsx         - Appointment modals
  invoice-modal.tsx         - Invoice generator

/lib
  utils.ts                  - Utility functions (cn, etc.)
```

## User Roles

### Customer
- Browse service categories
- View professional profiles
- Send inquiries via customizable forms
- Upload images with inquiries
- Manage inquiries and appointments
- View appointments grouped by professional category
- Receive and view invoices from professionals
- Pay invoices with multiple payment methods
- Track payment history

### Professional
- Manage business profile
- Customize inquiry forms (text, textarea, dropdown, image upload)
- View and respond to customer inquiries
- Manage appointments grouped by customer
- Track completed jobs with payments
- Categorize expenses (materials, transportation, miscellaneous)
- Auto-link job materials to expense tracking
- Generate and send invoices to customers
- View earnings analytics (income vs expenses charts)
- Track payment methods breakdown
- Monitor expense breakdown by category

## Data Models

### User

```typescript
// Customer
{
  customerName: string       // Stored in sessionStorage
}

// Professional
{
  professionalName: string   // Stored in sessionStorage
  businessName: string       // Stored in sessionStorage
}
```

### Professional Profile

```typescript
{
  id: string
  businessName: string
  rating: number
  distance: string
  bio: string
  pictures: string[]
  formTemplate: FormField[]
}
```

### Form Field (Inquiry Form)

```typescript
{
  id: string
  label: string
  type: "text" | "textarea" | "select" | "image"
  options?: string[]         // For select type
  required: boolean
}
```

### Inquiry

```typescript
{
  inquiryId: string
  professionalName: string   // or customerName (depending on view)
  lastMessagePreview: string
  timestamp: string
  category: string
  status: "initial" | "pending" | "appointment"
  unread?: boolean           // For professionals
}
```

### Appointment

```typescript
{
  id: string
  title: string
  status: "pending" | "scheduled"
  start: string              // ISO date string
  end: string                // ISO date string
  customerName: string       // or professionalName (depending on view)
  category?: string          // For customer view
  address: string
  priceInfo: string
  inquiryId: string
}
```

### Job (Professional Earnings)

```typescript
{
  id: string
  jobName: string
  customerName: string
  date: string               // ISO date string
  paymentReceived: number    // Dollar amount (gross income)
  materialsCost: number      // Dollar amount (auto-creates expense entry)
  paymentMethod: "cash" | "card" | "manual"
  paymentStatus: "paid" | "pending"
  notes?: string
  invoiceId?: string         // Links to sent invoice
}
```

### Invoice

```typescript
{
  id: string
  professionalId: string
  professionalName: string
  businessName: string
  customerId: string
  customerName: string
  jobId: string
  jobName: string
  jobDescription: string
  amount: number             // Total amount due (without materials breakdown)
  dueDate: string            // ISO date string (30 days from date sent)
  dateSent: string           // ISO date string
  datePaid?: string          // ISO date string
  paymentMethod?: "cash" | "card" | "other"
  status: "unpaid" | "paid" | "overdue"
}
```

### Expense

```typescript
{
  id: string
  professionalId: string
  name: string
  category: "materials" | "transportation" | "miscellaneous"
  amount: number
  date: string               // ISO date string
  relatedJobId?: string      // Links to related job
  relatedJobName?: string
  notes?: string
  autoGenerated?: boolean    // True if auto-created from job materials
}
```

## Key Features

### 1. Toast Notifications
- **Library**: Sonner
- **Location**: Root layout (`app/layout.tsx`)
- **Usage**: Success/error messages for form submissions
- **Example**: Inquiry submission, job creation

### 2. User-Specific Navigation
- **Component**: `components/app-header.tsx`
- **Behavior**: 
  - Detects user type from sessionStorage
  - Dynamically renders navigation based on role
  - Customer: `/customer/dashboard`, `/customer/inquiries`, `/customer/appointments`
  - Professional: `/professional/home`, `/professional/inquiries`, `/professional/appointments`

### 3. Appointments System
- **Customer View** (`/customer/appointments`):
  - Grouped by professional category (Plumbing, Electrical, HVAC, etc.)
  - Shows pending and scheduled appointments
  - Click scheduled appointments for details
- **Professional View** (`/professional/appointments`):
  - Grouped by customer
  - Accept/decline pending requests
  - View scheduled appointments
  - Appointment acceptance modal for pricing

### 4. Professional Earnings Tracking
- **Page**: `/professional/jobs`
- **Features**:
  - Manual job entry form
  - Track payment received, materials cost, payment method
  - Payment status (paid/pending)
  - Filter by status (all/paid/pending)
  - Financial summary cards (income, expenses, net profit, pending)
  - Generate invoices for jobs
- **Storage**: `sessionStorage.professionalJobs` (JSON array)

### 5. Dashboard Analytics
- **Page**: `/professional/home`
- **Charts**:
  - **Bar Chart**: Monthly income vs expenses (Recharts)
  - **Pie Chart**: Payment method breakdown (cash/card/manual)
- **Metrics**:
  - Total Income (from paid jobs)
  - Total Expenses (materials costs)
  - Net Profit (income - expenses)
  - Business rating
- **Data Source**: Calculated from jobs in sessionStorage

### 6. Invoice Generator
- **Component**: `components/invoice-modal.tsx`
- **Features**:
  - Professional branding (business name)
  - Customer details
  - Job description
  - Itemized breakdown (labor + materials)
  - Payment status badge
  - Due date calculation (30 days)
  - Print functionality
  - Download as PDF (triggers print dialog)

### 7. Invoice & Payment System

#### Invoice Generation (Professional)
- **Page**: `/professional/jobs`
- **Features**:
  - Generate invoices from completed jobs
  - Invoice shows only service amount (materials cost hidden from customer)
  - Send invoice to customer via WMNM ID
  - Track invoice status (sent/paid)
  - Print or download invoices
- **Component**: `components/invoice-modal.tsx`

#### Customer Payments
- **Page**: `/customer/payments`
- **Features**:
  - View all received invoices from professionals
  - Filter by status (all/unpaid/paid/overdue)
  - Summary cards: total unpaid, total paid, total invoices
  - Pay invoices with payment method selection
  - Automatic status updates (unpaid → paid)
  - Payment syncs with professional's job records
- **Workflow**:
  1. Professional generates invoice and enters customer WMNM ID
  2. Invoice stored in both `sentInvoices` and `customerInvoices`
  3. Customer views invoice in Payments page
  4. Customer pays invoice with payment method
  5. Invoice status updates to "paid" everywhere
  6. Professional's job record updates to "paid"

### 8. Expense Tracking System

#### Expense Management (Professional)
- **Page**: `/professional/expenses`
- **Categories**: Materials, Transportation, Miscellaneous
- **Features**:
  - Manual expense entry form
  - Link expenses to specific jobs (optional)
  - Filter by category
  - Summary cards by category
  - Auto-generated expenses from job materials
  - Cannot delete auto-generated expenses
- **Auto-Linking**: When a job is added with materials cost > 0, automatically creates an expense entry:
  - Category: "Materials"
  - Amount: Job's materials cost
  - Date: Job date
  - Related job: Linked to job ID
  - Auto-generated flag: true

#### Dashboard Integration
- **Page**: `/professional/home`
- **Updated Charts**:
  - Income vs Expenses bar chart (uses expense tracking data)
  - Expense breakdown pie chart (by category: materials/transportation/miscellaneous)
  - Payment method breakdown pie chart
- **Metrics**:
  - Total income (from paid jobs)
  - Total expenses (from all expense entries)
  - Net profit (income - expenses)
- **WMNM Tools**: Horizontal quick action bar with links to Inquiries, Appointments, Jobs, Expenses, Form Builder, Profile

### 9. Customizable Inquiry Forms
- **Form Builder** (`/professional/form-builder`):
  - Add/remove/reorder fields
  - Field types: text input, textarea, dropdown, image upload
  - Configure dropdown options
  - Mark fields as required
  - Live preview
  - Save to sessionStorage
- **Customer Experience** (`/customer/professional/[id]`):
  - Loads professional's custom form template
  - Image upload with preview
  - File size validation (5MB max)
  - Data URL storage for mock implementation
  - Required field validation

## State Management

### SessionStorage Schema

```javascript
// User authentication
sessionStorage.customerName: string
sessionStorage.professionalName: string
sessionStorage.businessName: string

// Professional data
sessionStorage.professionalJobs: Job[]
sessionStorage.professionalFormTemplate: FormField[]
sessionStorage.professionalExpenses: Expense[]
sessionStorage.sentInvoices: Invoice[]

// Customer data
sessionStorage.customerInvoices: Invoice[]
```

### Why SessionStorage?
- **No backend**: Simulates persistent data without a server
- **User-specific**: Data persists per browser session
- **Easy to clear**: Sign out clears all data
- **Mock implementation**: Ready for real backend integration

## Routing

### Customer Routes
- `/` - Landing page
- `/customer/login` - Login
- `/customer/dashboard` - Browse categories
- `/customer/professionals?category=X` - View professionals
- `/customer/professional/[id]` - Professional profile + inquiry form
- `/customer/inquiries` - My inquiries
- `/customer/appointments` - My appointments (grouped by category)
- `/customer/payments` - View and pay invoices

### Professional Routes
- `/` - Landing page
- `/professional/login` - Login
- `/professional/home` - Dashboard with analytics and charts
- `/professional/inquiries` - Customer inquiries
- `/professional/appointments` - Appointment requests (grouped by customer)
- `/professional/jobs` - Job tracking & invoice generation
- `/professional/expenses` - Expense tracking by category
- `/professional/form-builder` - Customize inquiry form
- `/professional/profile` - Edit profile

### Shared Routes
- `/chat/[id]` - Chat interface (both roles)

## Component Hierarchy

### Layout
```
RootLayout
├── AppHeader (user-type aware navigation)
├── Page Content
└── Toaster (global toast notifications)
```

### Professional Dashboard
```
ProfessionalHome
├── Financial Metrics Cards (4)
├── Bar Chart (Income vs Expenses)
├── Pie Chart (Payment Methods)
├── Quick Actions Card
└── Recent Activity Card
```

### Jobs Page
```
ProfessionalJobs
├── Financial Summary (4 cards)
├── Add Job Form (collapsible)
├── Filter Buttons
├── Jobs List
│   └── Job Card
│       └── Invoice Button → InvoiceModal
└── InvoiceModal (printable)
```

### Form Builder
```
FormBuilderPage
├── Form Preview
│   └── Field Cards
│       └── Move Up/Down/Delete buttons
├── Add Field Button
└── Add Field Form (collapsible)
    └── Dynamic options for select type
```

## Future Enhancements

### Backend Integration
When implementing a real backend, replace sessionStorage with API calls:

```typescript
// Example: Load jobs
// Current: const jobs = JSON.parse(sessionStorage.getItem("professionalJobs"))
// Future: const jobs = await fetch("/api/professional/jobs").then(r => r.json())
```

### Database Schema
Recommended tables:
- `users` (id, email, password, role, wmnm_id, created_at)
- `professionals` (user_id, business_name, bio, category, rating)
- `customers` (user_id, name, location)
- `inquiries` (id, customer_id, professional_id, status, created_at)
- `messages` (id, inquiry_id, sender_id, content, images, created_at)
- `appointments` (id, inquiry_id, start_time, end_time, status, price)
- `jobs` (id, professional_id, customer_id, appointment_id, payment_received, materials_cost, payment_method, status, date, invoice_id)
- `expenses` (id, professional_id, name, category, amount, date, related_job_id, notes, auto_generated)
- `invoices` (id, professional_id, customer_id, job_id, amount, due_date, date_sent, date_paid, payment_method, status)
- `form_templates` (id, professional_id, fields_json)

### Real-Time Features
- WebSocket for chat messages
- Push notifications for new inquiries
- Live appointment updates

### File Storage
- Use S3/Cloudinary for image uploads
- Replace data URLs with proper file URLs
- Implement proper file validation on server

### Authentication
- Replace sessionStorage with JWT tokens
- Implement proper login/signup with validation
- Password hashing with bcrypt
- OAuth integration (Google, Facebook)

### Payment Integration
- Stripe/PayPal for actual payments
- Real-time payment processing
- Payment confirmation emails
- Automatic receipt generation
- Payment reminders for pending/overdue invoices
- Refund handling

### Search & Filtering
- Full-text search for professionals
- Advanced filters (rating, distance, availability)
- Map integration for location-based search

### Reviews & Ratings
- Customer review system
- Rating aggregation
- Photo/video reviews
- Response system for professionals

### Analytics
- Advanced business analytics dashboard
- Revenue forecasting
- Customer acquisition metrics
- Conversion funnels

## Development Notes

### Running Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

### Testing Users
**Customer Login**: Enter any name
**Professional Login**: Enter name and business name

### Mock Data
Initial data is hardcoded in page components:
- `MOCK_PROFESSIONALS` - Professional listings
- `MOCK_INQUIRIES` - Sample inquiries
- `MOCK_APPOINTMENTS` - Sample appointments
- `INITIAL_JOBS` - Sample completed jobs

### Styling
- Tailwind CSS utility classes
- Dark mode support (via Tailwind)
- Responsive design (mobile-first)
- Custom color palette in `globals.css`

## Contributing

When adding new features:
1. Create new components in `/components`
2. Add new pages in `/app`
3. Use TypeScript for type safety
4. Follow existing naming conventions
5. Use shadcn/ui components when possible
6. Update this documentation

## License

This is a demo/portfolio project. Use as needed for learning or inspiration.

