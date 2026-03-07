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
- 🐳 **Containerized** - Multi-stage Docker builds with Bun
- ☸️ **Kubernetes Ready** - Full GKE deployment with Kustomize
- 🔄 **CI/CD Pipeline** - GitHub Actions with automated deploy to GKE

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

### Arquitectura del Deploy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GITHUB REPOSITORY                                │
│                                                                             │
│  push to main                                                               │
│      │                                                                      │
│      ▼                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                      GitHub Actions Pipeline                           │  │
│  │                                                                        │  │
│  │   ┌──────────┐      ┌──────────────┐      ┌────────────────────────┐  │  │
│  │   │  1. CI    │─────▶│ 2. Build &   │─────▶│  3. Deploy to GKE     │  │  │
│  │   │          │      │    Push       │      │                        │  │  │
│  │   │  Lint    │      │              │      │  Auth (OIDC)           │  │  │
│  │   │  Test    │      │  Docker img  │      │  Get GKE credentials   │  │  │
│  │   │  Build   │      │   ──▶ GHCR   │      │  Create namespace      │  │  │
│  │   │          │      │              │      │  Apply secrets          │  │  │
│  │   └──────────┘      └──────────────┘      │  Kustomize deploy      │  │  │
│  │                                            │  Wait for rollout      │  │  │
│  │                                            └────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          GOOGLE CLOUD PLATFORM                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                 Google Kubernetes Engine (GKE)                         │  │
│  │                 Namespace: taskify-staging                             │  │
│  │                                                                       │  │
│  │   ┌───────────┐      ┌──────────────────────────────────────────┐    │  │
│  │   │  Ingress  │─────▶│         Service (NodePort)               │    │  │
│  │   │  (GCE LB) │      │           port 80 ──▶ 3000              │    │  │
│  │   │  Static   │      └──────────────┬───────────────────────────┘    │  │
│  │   │  IP       │                     │                                │  │
│  │   └───────────┘     ┌───────────────┼───────────────┐                │  │
│  │                      ▼               ▼               ▼                │  │
│  │                ┌──────────┐   ┌──────────┐   ┌──────────┐           │  │
│  │                │  Pod 1   │   │  Pod 2   │   │  Pod N   │           │  │
│  │                │ taskify  │   │ taskify  │   │ taskify  │           │  │
│  │                │  -api    │   │  -api    │   │  -api    │           │  │
│  │                └──────────┘   └──────────┘   └──────────┘           │  │
│  │                      ▲                               ▲                │  │
│  │                      │     HPA (autoscaling)         │                │  │
│  │                      │     min: 1  ·  max: 2         │                │  │
│  │                      │     CPU target: 70%           │                │  │
│  │                      └───────────────────────────────┘                │  │
│  │                          │                     │                       │  │
│  │                          ▼                     ▼                       │  │
│  │   ┌──────────────────────────┐  ┌──────────────────────────┐         │  │
│  │   │  PostgreSQL (in-cluster) │  │    Redis (in-cluster)    │         │  │
│  │   │  postgres-service:5432   │  │    redis-service:6379    │         │  │
│  │   │  PVC: 1Gi                │  │    emptyDir              │         │  │
│  │   └──────────────────────────┘  └──────────────────────────┘         │  │
│  │                                                                       │  │
│  │   ┌──────────────┐   ┌──────────────────┐                           │  │
│  │   │  ConfigMap    │   │    Secrets        │                           │  │
│  │   │              │   │  (via pipeline)   │                           │  │
│  │   │  NODE_ENV    │   │                  │                           │  │
│  │   │  PORT        │   │  DATABASE_URL    │                           │  │
│  │   │  REDIS_URL   │   │  JWT_SECRET      │                           │  │
│  │   │  JWT_EXPIRES │   │  JWT_REFRESH_*   │                           │  │
│  │   └──────────────┘   │  CLOUDINARY_*    │                           │  │
│  │                      └──────────────────┘                           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Workload Identity Federation                                         │  │
│  │                                                                       │  │
│  │  GitHub OIDC token ──▶ Identity Pool ──▶ Service Account              │  │
│  │  (sin claves estaticas, credenciales temporales por cada ejecucion)   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Flujo de Deploy paso a paso

#### 1. CI (Lint + Test + Build)

Se ejecuta el workflow `workflow.yml` que valida el codigo:

- **Lint** con Biome
- **Tests** con Vitest (levanta Postgres y Redis como services)
- **Build** con Bun

#### 2. Build & Push de la imagen Docker

```
Dockerfile (multi-stage)
├── Stage 1: deps      → Instala dependencias + genera Prisma Client
├── Stage 2: build     → Compila la aplicacion con Bun
└── Stage 3: runtime   → Imagen slim solo con lo necesario para produccion
```

La imagen se publica en **GitHub Container Registry** (`ghcr.io`) con tag del SHA del commit.

#### 3. Deploy a GKE Staging

1. **Autenticacion** via Workload Identity Federation (OIDC, sin service account keys)
2. **Obtiene credenciales** del cluster GKE
3. **Crea el namespace** `taskify-staging` si no existe
4. **Inyecta los secrets** desde GitHub Secrets al cluster (DATABASE_URL apunta al PostgreSQL in-cluster)
5. **Aplica manifests** con Kustomize (actualiza la imagen al nuevo tag)
6. **Espera PostgreSQL y Redis** antes de desplegar la app
7. **Espera el rollout** de taskify-api con timeout de 5 minutos

### Autenticacion con GCP (Workload Identity Federation)

```
GitHub Actions                     Google Cloud
┌───────────────┐                 ┌────────────────────────────┐
│               │  1. Token OIDC  │                            │
│   Workflow    │────────────────▶│  Workload Identity Pool    │
│  (push main)  │                 │  (github-provider)         │
│               │  2. Credencial  │            │               │
│               │◀────────────────│            ▼               │
│               │    temporal     │    Service Account          │
│               │                 │    (rol: GKE Developer)    │
└───────────────┘                 └────────────────────────────┘
```

- **Sin claves estaticas:** GitHub genera un token OIDC temporal en cada ejecucion
- **GCP lo verifica** contra el emisor `https://token.actions.githubusercontent.com`
- **Otorga credenciales temporales** para operar con GKE

### Estructura de Kubernetes

```
k8s/
├── base/                          # Configuracion base
│   ├── kustomization.yml          # Orquesta todos los recursos
│   ├── namespace.yml              # Namespace del proyecto
│   ├── configmap.yml              # Variables de entorno no sensibles
│   ├── secret.yml                 # Plantilla de secrets (valores reales via pipeline)
│   ├── postgres.yml               # PostgreSQL: Deployment + Service + PVC + Secret
│   ├── redis.yml                  # Redis: Deployment + Service
│   ├── deployment.yml             # App deployment con init container para migraciones
│   ├── service.yml                # NodePort service (80 → 3000)
│   ├── ingress.yml                # Ingress con GCE Load Balancer + static IP
│   └── hpa.yml                    # Autoscaling horizontal
│
└── overlays/
    └── staging/                   # Override para staging
        ├── kustomization.yml      # Patches: 1 replica, HPA 1-2
        └── configmap-patch.yml    # NODE_ENV=production
```

- **In-cluster databases:** PostgreSQL (PVC 1Gi) y Redis desplegados como pods dentro del cluster
- **Init Container:** Ejecuta `prisma migrate deploy` antes de iniciar los pods
- **Readiness probe:** `GET /health` cada 10s (no recibe trafico hasta responder)
- **Liveness probe:** `GET /health` cada 20s (reinicia el pod si deja de responder)
- **Secrets management:** Los secrets se inyectan via el pipeline de deploy (no versionados en git)

### Setup de Infraestructura

#### Prerrequisitos

- Cuenta de Google Cloud con proyecto activo
- Cluster GKE creado
- [GitHub CLI](https://cli.github.com/) instalado (`brew install gh`)

#### 1. Configurar Workload Identity Federation en GCP

1. Crear un **Workload Identity Pool** (ej: `github-provider`)
2. Agregar un **proveedor OIDC** con emisor: `https://token.actions.githubusercontent.com`
3. Crear una **Service Account** con rol `Kubernetes Engine Developer`
4. Vincular el pool a la Service Account con rol `Workload Identity User`

#### 2. Configurar secrets en GitHub

```bash
gh auth login
./scripts/setup-gh-secrets.sh
```

| Secret | Descripcion |
|--------|-------------|
| `GCP_PROJECT_ID` | ID del proyecto en GCP |
| `GCP_SERVICE_ACCOUNT` | Email de la service account |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Resource name del provider OIDC |
| `GKE_CLUSTER` | Nombre del cluster GKE |
| `GKE_ZONE` | Zona del cluster |
| `JWT_SECRET` | Secret para access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret para refresh tokens (min 32 chars) |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

> **Nota:** `DATABASE_URL` no se configura como GitHub Secret. Apunta automaticamente al PostgreSQL in-cluster (`postgres-service:5432`).

#### 3. Deploy

Push a `main` dispara automaticamente el pipeline completo:

```bash
git push origin main
gh run watch  # monitorear en tiempo real
```

### Live API

Una vez desplegado, obtener la IP del ingress:

```bash
kubectl get ingress -n taskify-staging
```

```bash
# Health check
curl http://<INGRESS_IP>/health

# Register
curl -X POST http://<INGRESS_IP>/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://<INGRESS_IP>/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Cost Management

```bash
# Apagar el cluster (nodos a 0, deja de cobrar)
gcloud container clusters resize <CLUSTER_NAME> \
  --zone <ZONE> --num-nodes 0 --project <PROJECT_ID>

# Encender el cluster
gcloud container clusters resize <CLUSTER_NAME> \
  --zone <ZONE> --num-nodes 1 --project <PROJECT_ID>
```

Se recomienda configurar **Budget Alerts** en Google Cloud Console (Billing → Budgets & alerts) para recibir notificaciones al alcanzar umbrales de gasto.

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
