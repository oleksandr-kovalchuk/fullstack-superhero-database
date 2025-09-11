# Superhero Database

A full-stack web application for managing a superhero database with CRUD operations, image uploads, and a modern responsive UI.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Node.js with Express, TypeScript, and Prisma ORM
- **Database**: PostgreSQL with pgAdmin for database management
- **Containerization**: Docker and Docker Compose for easy deployment

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- Git (for cloning the repository)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd superhero-database
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **pgAdmin**: http://localhost:5050
     - Email: `admin@superhero.com`
     - Password: `admin123`

### First-time Setup

**Important**: Before running the application, ensure you have a `.env` file in the `backend` directory. If you don't have one, create it with the environment variables shown in the Configuration section below.

The application will automatically:
- Create and configure the PostgreSQL database
- Run Prisma migrations to set up the database schema
- Build and start both frontend and backend services
- Set up pgAdmin for database management

## 📋 Available Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js React application |
| Backend API | 3001 | Express.js REST API |
| PostgreSQL | 5432 | Database server |
| pgAdmin | 5050 | Database administration interface |

## 🛠️ Development Setup

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file from the example
   cp .env.example .env
   # Edit .env with your database configuration
   ```
   
   **Important**: If `.env.example` doesn't exist, create a `.env` file manually with the following content:
   ```env
   DATABASE_URL="postgresql://superhero_user:superhero_password@localhost:5432/superhero_db"
   PORT=3001
   NODE_ENV=development
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Superheroes
- `GET /api/superheroes` - Get all superheroes (with pagination)
- `GET /api/superheroes/:id` - Get superhero by ID
- `POST /api/superheroes` - Create new superhero
- `PUT /api/superheroes/:id` - Update superhero
- `DELETE /api/superheroes/:id` - Delete superhero

### Images
- `POST /api/superheroes/:id/images` - Add images to superhero
- `DELETE /api/superheroes/:id/images/:imageId` - Remove image from superhero

### Query Parameters
- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10)

## 🗄️ Database Schema

### Superheroes Table
- `id` - Unique identifier (CUID)
- `nickname` - Superhero nickname (unique)
- `real_name` - Real name of the superhero
- `origin_description` - Origin story (text)
- `superpowers` - List of superpowers (text)
- `catch_phrase` - Famous catchphrase
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Superhero Images Table
- `id` - Unique identifier (CUID)
- `filename` - Generated filename
- `original_name` - Original filename
- `mimetype` - File MIME type
- `size` - File size in bytes
- `path` - File path
- `superhero_id` - Foreign key to superhero
- `created_at` - Creation timestamp

## 🎨 Features

- **CRUD Operations**: Create, read, update, and delete superheroes
- **Image Upload**: Support for multiple image uploads per superhero
- **Pagination**: Efficient data loading with pagination
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant UI updates after operations
- **Error Handling**: Comprehensive error handling and user feedback
- **Data Validation**: Server-side validation using Zod schemas
- **Type Safety**: Full TypeScript support across the stack

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
DATABASE_URL="postgresql://superhero_user:superhero_password@localhost:5432/superhero_db"

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Note**: For local development without Docker, use `localhost` in the DATABASE_URL. For Docker Compose setup, the database URL is automatically configured in the docker-compose.yml file.

#### Docker Compose
The application uses the following default configurations:
- Database: PostgreSQL 15
- Database credentials: `superhero_user` / `superhero_password`
- Database name: `superhero_db`
- pgAdmin credentials: `admin@superhero.com` / `admin123`

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
superhero-database/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── validation/      # Zod schemas
│   │   └── types/           # TypeScript types
│   ├── prisma/              # Database schema and migrations
│   └── uploads/             # Uploaded images
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript types
└── docker-compose.yml       # Docker services configuration
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 3001, 5432, and 5050 are available
2. **Database connection**: Wait for PostgreSQL to fully start before accessing the application
3. **Image uploads**: Check that the uploads directory has proper permissions
4. **Build failures**: Ensure Docker has sufficient memory allocated

### Reset Database
```bash
docker-compose down -v
docker-compose up --build
```

### View Service Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## 📝 Assumptions Made

### Technical Assumptions
1. **Database**: PostgreSQL is the preferred database choice for production-ready applications
2. **Image Storage**: Images are stored locally in the `uploads` directory (not cloud storage)
3. **File Upload**: Maximum 10 images per superhero with standard image formats (JPEG, PNG)
4. **Pagination**: Default page size of 10 items with configurable limits
5. **Validation**: Server-side validation using Zod schemas for data integrity
6. **Error Handling**: Graceful error handling with user-friendly error messages

### Business Logic Assumptions
1. **Unique Nicknames**: Superhero nicknames must be unique across the database
2. **Image Management**: Images are permanently associated with superheroes (cascade delete)
3. **Data Fields**: All superhero fields are required except for images
4. **Catch Phrases**: Limited to 200 characters for display purposes
5. **Superpowers**: Stored as text field allowing for multiple powers per superhero

### UI/UX Assumptions
1. **Responsive Design**: Application should work on desktop, tablet, and mobile devices
2. **Loading States**: Users should see loading indicators during async operations
3. **Confirmation Dialogs**: Destructive actions (delete) require user confirmation
4. **Form Validation**: Real-time validation feedback for better user experience
5. **Image Optimization**: Images should be optimized for web display

### Security Assumptions
1. **File Upload Security**: Basic file type validation for uploaded images
2. **Input Sanitization**: All user inputs are validated and sanitized
3. **CORS**: Backend configured to accept requests from frontend origin
4. **Environment Variables**: Sensitive data stored in environment variables

### Development Assumptions
1. **TypeScript**: Full type safety across frontend and backend
2. **Modern React**: Uses React 19 with modern patterns (hooks, functional components)
3. **State Management**: Zustand for client-side state management
4. **Styling**: Tailwind CSS for consistent, utility-first styling
5. **Code Organization**: Separation of concerns with clear folder structure

### Deployment Assumptions
1. **Containerization**: Docker Compose for easy local development and deployment
2. **Database Management**: pgAdmin included for database administration
3. **Health Checks**: Database health checks ensure proper startup order
4. **Volume Persistence**: Database and upload data persisted across container restarts
5. **Production Ready**: Application configured for both development and production environments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Superhero Management! 🦸‍♂️🦸‍♀️**
