# IA03 Backend

NestJS backend with JWT authentication (access + refresh tokens) and MongoDB (Mongoose).

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd ia03-backend
```

2. Install dependencies:
```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ia03-db

# Server
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173

# JWT
ACCESS_TOKEN_SECRET=replace-with-strong-secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_SECRET=replace-with-strong-secret
REFRESH_TOKEN_EXPIRES=7d
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

## API Endpoints

Base URL: `http://localhost:${PORT}` (default `3000`).

### Auth
- `POST /auth/login` → body: `{ email, password }` → `{ accessToken, refreshToken, user }`
- `POST /auth/refresh` → body: `{ refreshToken }` → `{ accessToken, refreshToken }` (rotated)
- `POST /auth/logout` (Bearer access token) → `{ message }` (revokes refresh via `tokenVersion`)
- `GET /auth/profile` (Bearer access token) → `{ id, email }`

### User
- `POST /user/register` → body: `{ email, password }` → `{ message, user }`

## Technologies Used

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **TypeScript** - Type-safe JavaScript
- **ESLint & Prettier** - Code linting and formatting

## Project Structure

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.guard.ts
│   └── jwt.strategy.ts
└── user/
    ├── dto/
    │   └── register.dto.ts
    ├── schemas/
    │   └── user.schema.ts
    ├── user.controller.ts
    ├── user.module.ts
    └── user.service.ts
```

## Auth Flow (Summary)

- Login verifies credentials, returns short-lived access token and long-lived refresh token.
- Protected routes use `JwtAuthGuard` with access token (Authorization: `Bearer <token>`).
- When refresh requested, the server verifies refresh token, checks `tokenVersion`, and returns a new pair (access + rotated refresh).
- Logout increments `tokenVersion` to invalidate all existing refresh tokens for that user.

See `BACKEND_AUTH_FLOW.md` for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.