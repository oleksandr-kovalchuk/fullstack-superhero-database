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
   docker-compose up --build -d
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

### Local Development (Without Docker)
```bash
# Backend
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🎨 Features

- **CRUD Operations**: Create, read, update, and delete superheroes
- **Image Management**: Multiple image uploads per superhero with validation
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **State Management**: Zustand for efficient client-side state
- **Data Validation**: Zod schemas for type-safe validation
- **Database**: PostgreSQL with Prisma ORM and automatic migrations
- **Security**: Helmet.js, CORS, file upload validation
- **TypeScript**: Full-stack type safety

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superheroes` | Get all superheroes (paginated) |
| GET | `/api/superheroes/:id` | Get superhero by ID |
| POST | `/api/superheroes` | Create new superhero |
| PUT | `/api/superheroes/:id` | Update superhero |
| DELETE | `/api/superheroes/:id` | Delete superhero |

## 🚨 Troubleshooting

**Common Issues:**
- Ensure ports 3000, 3001, 5432, and 5050 are available
- Wait for PostgreSQL to fully start before accessing the application
- Check uploads directory permissions
- For file upload issues, verify image format (JPEG/PNG) and size limits

**Reset Database:**
```bash
docker-compose down -v
docker-compose up --build
```

---

**Happy Superhero Management! 🦸‍♂️🦸‍♀️**
