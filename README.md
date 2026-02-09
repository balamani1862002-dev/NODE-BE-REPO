# Life Manager Backend API

A comprehensive REST API for managing todos and personal finances with user authentication and admin panel built with TypeScript.

## Features

- 🔐 JWT-based authentication with bcrypt password hashing
- 👤 Role-based access control (user/admin)
- ✅ Todo management system
- 💰 Personal finance tracking (income, expenses, loans, savings)
- 📊 Dashboard with analytics and statistics
- 👑 Admin panel for user and system management
- 🔷 Full TypeScript support with strict type checking

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (Supabase)
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
life-manager-backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   └── database.sql         # Database schema
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── todoController.ts    # Todo CRUD operations
│   │   ├── transactionController.ts  # Transaction CRUD
│   │   ├── dashboardController.ts    # Analytics endpoints
│   │   └── adminController.ts   # Admin operations
│   ├── middleware/
│   │   ├── auth.ts             # JWT & admin middleware
│   │   ├── validation.ts       # Request validation
│   │   └── errorHandler.ts     # Global error handler
│   ├── models/
│   │   ├── User.ts             # User model
│   │   ├── Todo.ts             # Todo model
│   │   └── Transaction.ts      # Transaction model
│   ├── routes/
│   │   ├── authRoutes.ts       # Auth endpoints
│   │   ├── todoRoutes.ts       # Todo endpoints
│   │   ├── transactionRoutes.ts # Transaction endpoints
│   │   ├── dashboardRoutes.ts  # Dashboard endpoints
│   │   └── adminRoutes.ts      # Admin endpoints
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   └── server.ts               # Entry point
├── dist/                       # Compiled JavaScript (generated)
├── .env.example
├── .gitignore
├── tsconfig.json
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database on Supabase and run the SQL schema from `src/config/database.sql`.

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Build & Run the Server

Build TypeScript:
```bash
npm run build
```

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Watch mode (compile on changes):
```bash
npm run watch
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Todos

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/todos` | Create todo | Yes |
| GET | `/api/todos` | Get all user todos | Yes |
| PUT | `/api/todos/:id` | Update todo | Yes |
| DELETE | `/api/todos/:id` | Delete todo | Yes |

### Transactions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions` | Get all user transactions | Yes |
| PUT | `/api/transactions/:id` | Update transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction | Yes |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get current month stats | Yes |
| GET | `/api/dashboard/monthly-comparison` | Get monthly comparison | Yes |

### Admin (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all users | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/transactions/total` | Get total transaction count | Admin |
| GET | `/api/admin/users/most-active` | Get most active users | Admin |

## Request Examples

### Register User

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Todo

```json
POST /api/todos
Headers: { "Authorization": "Bearer <token>" }
{
  "title": "Complete project documentation"
}
```

### Create Transaction

```json
POST /api/transactions
Headers: { "Authorization": "Bearer <token>" }
{
  "type": "expense",
  "category": "Food",
  "amount": 50.00,
  "note": "Lunch at restaurant",
  "date": "2026-02-10"
}
```

### Get Dashboard Stats

```json
GET /api/dashboard/stats
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "currentMonth": { "year": 2026, "month": 2 },
  "totalIncome": 5000,
  "totalExpenses": 2000,
  "savingsBalance": 3000,
  "expensesByCategory": [
    { "category": "Food", "total": 500 },
    { "category": "Transport", "total": 300 }
  ]
}
```

## TypeScript Types

All request/response types are defined in `src/types/index.ts`:

- `User`, `UserResponse`
- `Todo`
- `Transaction`, `TransactionType`
- `AuthRequest` (extends Express Request with user)
- Request DTOs: `RegisterRequest`, `LoginRequest`, `CreateTodoRequest`, etc.

## Transaction Types

- `income` - Money received
- `expense` - Money spent
- `loan_given` - Money lent to others
- `loan_taken` - Money borrowed
- `savings` - Money saved

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Protected routes with authentication middleware
- Role-based access control for admin features
- Users can only access their own data
- SQL injection prevention with parameterized queries
- TypeScript strict mode for type safety

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error message here"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database Schema

### Users Table
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (user/admin)
- created_at

### Todos Table
- id (Primary Key)
- user_id (Foreign Key)
- title
- completed
- created_at

### Transactions Table
- id (Primary Key)
- user_id (Foreign Key)
- type
- category
- amount
- note
- date
- created_at

## License

ISC
