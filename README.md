# ExpertBook - Production-Grade Expert Session Booking System

ExpertBook is a professional, real-time consultation booking platform built with the MERN stack. It features a modern UI/UX inspired by Calendly and Airbnb, robust backend architecture, and real-time synchronization.

## 🚀 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development and build.
- **Redux Toolkit**: Enterprise-level state management.
- **Tailwind CSS v4**: Utility-first styling with modern features.
- **Framer Motion**: Smooth, high-performance animations.
- **React Hook Form + Zod**: Advanced form validation and type safety.
- **Lucide React**: Beautiful, consistent iconography.
- **Socket.io-client**: Real-time slot synchronization.

### Backend
- **Node.js & Express**: Scalable server-side logic.
- **MongoDB & Mongoose**: Flexible document storage with optimized indexing.
- **Socket.io**: Real-time event broadcasting via rooms.
- **Clean Architecture**: Repository-Service-Controller pattern.
- **Security**: Helmet, Rate Limiting, Mongo Sanitize, XSS Protection.
- **Error Handling**: Global async error middleware and custom ApiError class.

## 🛠 Architecture Decisions

### 1. Clean Architecture (Service-Repository Pattern)
We decoupled business logic from the HTTP layer. 
- **Repositories**: Handle direct database operations.
- **Services**: Contain core business logic and orchestration.
- **Controllers**: Handle HTTP requests/responses and use Services.
- **Middleware**: Manage cross-cutting concerns (Auth, Error, Validation).

### 2. Race-Condition-Safe Booking
To prevent double booking of the same slot:
- **Unique Compound Index**: `{ expert: 1, date: 1, timeSlot: 1 }` in MongoDB ensures atomic prevention at the DB level.
- **Optimistic UI**: Frontend disables slots instantly upon booking.
- **Socket.io Rooms**: Users join a room specific to an expert (`expert_{id}`) to receive real-time availability updates without polling.

### 3. Security & Performance
- **Rate Limiting**: Prevents brute-force attacks on booking APIs.
- **Data Sanitization**: Protects against NoSQL injection and XSS.
- **Pagination**: Optimized API queries using `skip` and `limit`.
- **Debounced Search**: Reduces unnecessary API calls during search.

## 📦 Project Structure

```text
├── backend/
│   ├── config/          # Database & env config
│   ├── controllers/     # HTTP controllers
│   ├── middleware/      # Error & Security middleware
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # DB abstraction layer
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utilities (asyncHandler, ApiError)
│   └── server.js        # Entry point & Socket.io setup
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI & Layout components
    │   ├── hooks/       # Custom hooks
    │   ├── pages/       # Feature screens
    │   ├── store/       # Redux state management
    │   ├── utils/       # Config & helper functions
    │   └── App.jsx      # Main routing
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### Setup
1. **Clone and Install**
   ```bash
   # Backend
   cd backend && npm install
   # Frontend
   cd frontend && npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5005
   MONGODB_URI=mongodb://localhost:27017/expert_booking
   NODE_ENV=development
   ```

3. **Run the App**
   ```bash
   # In backend/
   npm run seed  # Seed initial expert data
   npm run dev   # Start dev server

   # In frontend/
   npm run dev   # Start Vite dev server
   ```

## 📄 License
MIT
