# Project Setup
### Prerequisites
- Running PostgreSQL database (e.g. per docker)
- Bun

1. Clone repo via git clone or something similar like GitHub Desktop
2. Install all dependencies using `bun i` or `bun install`
3. Use the `.env.template` file and create your own `.env`
3.1. Fill in your own session password (atleast 32 characters long)
3.2. Fill in your database (PostgreSQL) connection string
4. Use `bun run prisma:generate` to generate the Prisma Client (Database ORM)
5. Start the development server using `bun run dev`

# What is to come?
- Initial seeding for the database (for easier setup)
- better setup process (per Web UI)

# Technology used
- Bun
- Nuxt 4
- PrismaORM
- Zod
- VueUse
- UI-Thing

# Data Validation
Data is validated twice. Once on the client side and once on the server side to ensure that the correct error messages are shown to the user and the correct data is being handled on the server.


