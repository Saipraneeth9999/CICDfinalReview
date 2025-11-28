# Quick Start Guide - Budget Planner

## You don't have Maven installed, so here are your options:

### Option 1: Docker Compose (Easiest - Recommended)

This builds and runs everything (backend, frontend, database, Redis) in containers:

```bash
# From the project root directory
docker-compose up --build
```

**Note**: The first build will take 5-10 minutes as it downloads dependencies and builds everything.

Once running, access the application at: **http://localhost**

To stop: Press `Ctrl+C` and run `docker-compose down`

---

### Option 2: Install Maven and Run Locally

If you want to run the backend locally for development:

1. **Install Maven**:
   - Download from: https://maven.apache.org/download.cgi
   - Or use Chocolatey: `choco install maven`
   - Or use Scoop: `scoop install maven`

2. **Install Java 17**:
   - Download from: https://adoptium.net/
   - Or use Chocolatey: `choco install temurin17`

3. **Install PostgreSQL**:
   - Download from: https://www.postgresql.org/download/windows/
   - Create database: `budgetplanner`

4. **Install Redis** (optional):
   - Download from: https://github.com/microsoftarchive/redis/releases

5. **Run the backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

6. **Run the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

---

### Option 3: Use Maven Wrapper (If available)

If the project has Maven wrapper files (mvnw.cmd), you can use:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

---

## Current Status

✅ Frontend dependencies installed
✅ Docker is available
❌ Maven not installed
❌ Backend not running

## Recommended Next Steps

**For quick testing**: Use Docker Compose (Option 1)

```bash
# Stop the frontend dev server (Ctrl+C in that terminal)
# Then run from project root:
docker-compose up --build
```

This will start everything and you can access the app at http://localhost
