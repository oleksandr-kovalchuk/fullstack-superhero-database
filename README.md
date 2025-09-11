# Superhero Database

A full-stack web application for managing a superhero database with CRUD operations, image uploads, and a modern responsive UI.

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL with pgAdmin
- **Containerization**: Docker and Docker Compose

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Running the Application

1. **Clone and start**
   ```bash
   git clone https://github.com/oleksandr-kovalchuk/fullstack-superhero-database.git
   cd fullstack-superhero-database
   docker-compose up --build
   ```

2. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **pgAdmin**: http://localhost:5050 (admin@superhero.com / admin123)

### Environment Setup
Create a `.env` file in the `backend` directory:
```env
DATABASE_URL="postgresql://superhero_user:superhero_password@localhost:5432/superhero_db"
PORT=3001
NODE_ENV=development
```

## 🎨 Features

- CRUD operations for superheroes
- Multiple image uploads per superhero
- Pagination and responsive design
- Real-time UI updates
- Comprehensive error handling
- TypeScript support across the stack

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 🚨 Troubleshooting

**Common Issues:**
- Ensure ports 3000, 3001, 5432, and 5050 are available
- Wait for PostgreSQL to fully start before accessing the application
- Check uploads directory permissions

**Reset Database:**
```bash
docker-compose down -v
docker-compose up --build
```

---

**Happy Superhero Management! 🦸‍♂️🦸‍♀️**
