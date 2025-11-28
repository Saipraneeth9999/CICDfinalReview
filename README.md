# Budget Planner - Full-Stack Application

A comprehensive personal finance management system built with Spring Boot and React.

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Multi-Account Support**: Manage multiple accounts (checking, savings, credit, cash, wallet)
- **Transaction Management**: Track income, expenses, and transfers with categories
- **Budget Tracking**: Create monthly budgets with category-wise allocations
- **Analytics & Reports**: Visual charts showing spending trends and category breakdowns
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Redis (for caching)
- Flyway (database migrations)
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- Recharts (data visualization)
- Axios

### DevOps
- Docker & Docker Compose
- Nginx

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 15
- Redis 7
- Docker & Docker Compose (for containerized deployment)

## Quick Start with Docker

1. **Clone the repository**
   ```bash
   cd "Budget Planner"
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/swagger-ui.html

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure database**
   - Create a PostgreSQL database named `budgetplanner`
   - Update `src/main/resources/application.yml` with your database credentials

3. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on http://localhost:8080

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on http://localhost:5173

## Database Migrations

Database migrations are managed by Flyway and run automatically on application startup. Migration files are located in `backend/src/main/resources/db/migration/`.

## API Documentation

Once the backend is running, access the Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transactions
- `GET /api/transactions` - Get transactions (with filters)
- `POST /api/transactions` - Create transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL` - Database URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SPRING_DATA_REDIS_HOST` - Redis host
- `APP_JWT_SECRET` - JWT secret key

## Building for Production

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
Budget Planner/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/budgetplanner/
│   │   │   │   ├── config/         # Configuration classes
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── exception/      # Exception handlers
│   │   │   │   ├── model/          # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── security/       # Security & JWT
│   │   │   │   └── service/        # Business logic
│   │   │   └── resources/
│   │   │       ├── db/migration/   # Flyway migrations
│   │   │       └── application.yml
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/                    # API client
│   │   ├── components/             # React components
│   │   ├── pages/                  # Page components
│   │   ├── store/                  # State management
│   │   ├── types/                  # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

## Security Features

- Password hashing with BCrypt
- JWT access tokens (15 min expiry)
- Refresh tokens (30 day expiry)
- CORS configuration
- SQL injection prevention via JPA
- XSS protection via React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
