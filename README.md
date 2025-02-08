# Express.js TypeScript Backend Starter

A production-ready Express.js backend starter template with TypeScript, Prisma ORM, JWT authentication, request validation, error handling, and logging.

## Features

- 🚀 **Express.js** with TypeScript
- 📦 **Prisma ORM** for database operations
- ✅ **Zod** for request validation
- 🔐 **JWT** based authentication
- 🔒 **Argon2** for password hashing
- 📝 **Winston** for logging
- 🚦 **Error Handling** with custom error classes
- 🎯 **Environment Variables** validation
- 🔄 **CORS** enabled
- 📚 **Cookie Parser** for handling cookies
- 🗜️ **Compression** for response optimization

## Project Structure

```
├── config/             # Configuration files
├── controllers/        # Route controllers
├── custom-class/      # Custom classes (e.g., CustomError)
├── db/                # Database client setup
├── lib/               # Utility libraries
├── middleware/        # Express middlewares
├── prisma/            # Prisma schema and migrations
├── routes/            # API routes
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── validators/        # Request validation schemas
└── index.ts          # Application entry point
```

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd <project-name>
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://<user>:<password>@<hostname>:5432/<database_name>" (replace without '<' and '>')
JWT_SECRET="your-secret-key" (any random string is ok, make sure to make it strong and keep it safe)
PORT=9090 (default)
NODE_ENV=development (default, for production use 'production')
```

4. **Set up the database**

```bash
# Run migrations
pnpm db:deploy

# Generate Prisma client
pnpm db:generate

# Create a new migration with updated schema
pnpm db:migrate

# Push schema changes to database directly, not recommended
pnpm db:push
```

5. **Start the development server**

```bash
pnpm dev
```

## Available Scripts

- `pnpm build` - Build the TypeScript code
- `pnpm start:prod` - Start the production server ( after building the code)
- `pnpm dev` - Start the development server with hot reload
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:deploy` - Deploy migrations in production
- `pnpm start` - Start production server with database setup (use this in production, after building the code, this will run migrations and generate Prisma client, and start the server)

## API Authentication

The API uses JWT tokens for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Error Handling

The application includes a centralized error handling system with custom error classes and formatted error responses. Common error scenarios are handled automatically:

- Validation errors (Zod)
- Database errors (Prisma)
- Authentication errors
- Custom business logic errors

## Logging

Winston logger is configured with:

- Console logging
- File logging (error.log and combined.log) (in logs folder)
- Custom log levels and formatting
- Request logging middleware

## Database

The template uses Prisma ORM with PostgreSQL. The initial schema includes a User model with basic authentication fields. You can change it by replacing the database provider name in the `prisma/schema.prisma` file.

## Contributing

Feel free to submit issues and pull requests.

## License

ISC

## Author

Md. Ariful Islam
