# 🚀 Taskify API

> A modern, type-safe REST API for task management built with **Bun**, **TypeScript**, **Prisma**, and **Express**.

[![CI](https://github.com/velascoamo-guillermo/taskify-api/actions/workflows/ci.yml/badge.svg)](https://github.com/velascoamo-guillermo/taskify-api/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

## ✨ Features

- 🔐 **JWT Authentication** - Access & refresh token system
- 🛡️ **Type Safety** - Full TypeScript with strict configuration
- ⚡ **Modern Runtime** - Built with Bun for incredible performance
- 🔧 **Data Validation** - Zod schemas for request/response validation
- 📊 **Database ORM** - Prisma with PostgreSQL
- 🧪 **Testing Suite** - Vitest with unit & integration tests
- 📝 **Structured Logging** - Winston with different log levels
- 🔒 **Security First** - Helmet, CORS, Rate limiting
- 🎯 **Clean Architecture** - Repository pattern with service layer
- 📚 **Auto Documentation** - OpenAPI/Swagger integration

## 🏗️ Architecture

```
src/
├── config/          # Environment validation & configuration
├── controllers/     # HTTP request handlers
├── middlewares/     # Express middlewares (auth, validation, etc.)
├── repositories/    # Data access layer
├── routes/          # API routes definition
├── schemas/         # Zod validation schemas
├── services/        # Business logic layer
├── test/            # Test suites (unit & integration)
└── utils/           # Utility functions (JWT, hashing, logging)
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [PostgreSQL](https://postgresql.org/) >= 14
- [Node.js](https://nodejs.org/) >= 18 (for IDE support)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/velascoamo-guillermo/taskify-api.git
   cd taskify-api
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```env
   NODE_ENV=development
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/taskify_db"
   JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-chars"
   JWT_REFRESH_SECRET="your-refresh-secret-key-here-minimum-32-chars"
   JWT_ACCESS_EXPIRES="15m"
   JWT_REFRESH_EXPIRES="7d"
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   bunx prisma generate

   # Run migrations
   bunx prisma migrate deploy

   # (Optional) Seed database
   bunx prisma db seed
   ```

5. **Start development server**

   ```bash
   bun dev
   ```

   The API will be available at `http://localhost:3000`

## 📋 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**

```json
{
  "id": "clp123...",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Taskify API running"
}
```

### Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [
    /* Validation errors if applicable */
  ]
}
```

Common HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

### Run Tests

```bash
# Run all tests
bun test

# Watch mode
bun test:watch

# Coverage report
bun test:coverage
```

### Test Structure

- **Unit Tests** - `src/test/services/`, `src/test/utils/`
- **Integration Tests** - `src/test/integration/`
- **Repository Tests** - `src/test/repositories/`

### Coverage Goals

- **Lines**: > 90%
- **Functions**: > 90%
- **Branches**: > 85%
- **Statements**: > 90%

## 🛠️ Development

### Database Operations

```bash
# Reset database
bunx prisma migrate reset

# View database in browser
bunx prisma studio

# Generate new migration
bunx prisma migrate dev --name migration_name
```

### Code Quality

```bash
# Type checking
bunx tsc --noEmit

# Linting (if configured)
bun lint

# Format code (if configured)
bun format
```

### Environment Variables

| Variable              | Description                         | Default       | Required |
| --------------------- | ----------------------------------- | ------------- | -------- |
| `NODE_ENV`            | Environment mode                    | `development` | No       |
| `PORT`                | Server port                         | `3000`        | No       |
| `DATABASE_URL`        | PostgreSQL connection string        | -             | **Yes**  |
| `JWT_SECRET`          | JWT signing secret (min 32 chars)   | -             | **Yes**  |
| `JWT_REFRESH_SECRET`  | Refresh token secret (min 32 chars) | -             | **Yes**  |
| `JWT_ACCESS_EXPIRES`  | Access token expiration             | `15m`         | No       |
| `JWT_REFRESH_EXPIRES` | Refresh token expiration            | `7d`          | No       |

## 🔒 Security Features

- **JWT Authentication** with access/refresh token rotation
- **Password Hashing** using bcrypt with salt rounds
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with configurable origins
- **Helmet Security Headers** for XSS, CSRF protection
- **Input Validation** with Zod schemas
- **SQL Injection Protection** via Prisma ORM
- **Environment Variable Validation** on startup

## 📊 Monitoring & Logging

### Log Levels

- **Error**: Application errors and exceptions
- **Warn**: Warning messages and handled errors
- **Info**: General application information
- **Debug**: Detailed debugging information

### Log Format

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "message": "Server started",
  "service": "taskify-api",
  "metadata": {
    /* additional context */
  }
}
```

## 🚀 Deployment

### Build for Production

```bash
# Build the application
bun build

# Start production server
bun start
```

### Docker Deployment

```dockerfile
FROM oven/bun:1

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bunx prisma generate
RUN bun build

EXPOSE 3000
CMD ["bun", "start"]
```

### Environment Variables for Production

Ensure these are set in your production environment:

- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- Strong, unique values for `JWT_SECRET` and `JWT_REFRESH_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript strict mode
- Use conventional commit messages
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Bun](https://bun.sh/) for the incredible JavaScript runtime
- [Prisma](https://prisma.io/) for the amazing database toolkit
- [Zod](https://zod.dev/) for runtime type validation
- [Express](https://expressjs.com/) for the web framework

---

**Built with ❤️ by [Guillermo Velasco](https://github.com/velascoamo-guillermo)**

> 📧 Questions? Open an issue or reach out!
