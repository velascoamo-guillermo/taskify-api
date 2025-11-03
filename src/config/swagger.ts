import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.ts";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taskify API",
      version: "1.0.0",
      description:
        "A modern, type-safe REST API for task management built with Bun, TypeScript, Prisma, and Express.",
      contact: {
        name: "Guillermo Velasco",
        url: "https://github.com/velascoamo-guillermo",
        email: "velascoamo.guillermo@gmail.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique user identifier",
              example: "clp123abc456",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            name: {
              type: "string",
              nullable: true,
              description: "User display name",
              example: "John Doe",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password (minimum 6 characters)",
              example: "password123",
            },
            name: {
              type: "string",
              description: "User display name (optional)",
              example: "John Doe",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "User password",
              example: "password123",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              description: "JWT access token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: {
              type: "string",
              description: "JWT refresh token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        RefreshRequest: {
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description: "Refresh token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
              example: "Validation failed",
            },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: {
                    type: "array",
                    items: { type: "string" },
                    description: "Field path that failed validation",
                  },
                  message: {
                    type: "string",
                    description: "Validation error message",
                  },
                },
              },
              description: "Detailed validation errors (when applicable)",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Health status",
              example: "ok",
            },
            message: {
              type: "string",
              description: "Health message",
              example: "Taskify API running",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJSDoc(options);
