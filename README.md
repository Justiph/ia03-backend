# IA03 Backend

A NestJS-based backend application with user authentication and MongoDB integration.

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

The application runs on `http://localhost:3000` by default.

### User Endpoints
- `POST /user/register` - Register a new user
- `POST /user/login` - Login user

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
└── user/
    ├── dto/
    │   └── register.dto.ts
    ├── schemas/
    │   └── user.schema.ts
    ├── user.controller.ts
    ├── user.module.ts
    └── user.service.ts
```

## Database Schema

The application uses MongoDB with Mongoose schemas for data modeling.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.