# Island Scholars Platform - Local Setup Guide

## Prerequisites

Before setting up the Island Scholars Platform locally, ensure you have the following installed:

### Required Software

1. **Java Development Kit (JDK) 17 or later**
   - Download from [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
   - Verify installation: `java -version`

2. **Node.js 18+ and npm**
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node -v` and `npm -v`

3. **PostgreSQL 13+**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Remember your admin password during installation

4. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

5. **IDE/Code Editor (Optional but Recommended)**
   - IntelliJ IDEA (recommended for Spring Boot)
   - VS Code with Java Extension Pack

---

## Database Setup

### Step 1: Create PostgreSQL Database and User

1. **Open PostgreSQL command line (psql) as admin user:**
   ```bash
   psql -U postgres
   ```

2. **Create the user FIRST (this is critical):**
   ```sql
   CREATE USER island_scholars_user WITH PASSWORD 'password';
   ```

3. **Create the database:**
   ```sql
   CREATE DATABASE island_scholars_db;
   ```

4. **Grant privileges to the user:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE island_scholars_db TO island_scholars_user;
   ```

5. **Connect to the database and grant schema privileges:**
   ```sql
   \c island_scholars_db
   GRANT ALL ON SCHEMA public TO island_scholars_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO island_scholars_user;
   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO island_scholars_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO island_scholars_user;
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO island_scholars_user;
   ```

6. **Exit psql:**
   ```sql
   \q
   ```

### Step 2: Test Database Connection

Test the connection with the new user:
```bash
psql -h localhost -U island_scholars_user -d island_scholars_db
```
Enter password: `password`

If you can connect successfully, the database setup is complete!

---

## Backend Setup (Spring Boot)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Update Database Configuration (if needed)

The `application.properties` file should already be configured correctly:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/island_scholars_db
spring.datasource.username=island_scholars_user
spring.datasource.password=password
```

### Step 3: Run the Spring Boot Application

**Option A: Using Maven Wrapper (Recommended)**
```bash
./mvnw spring-boot:run
```

**Option B: Using your IDE**
- Open the `backend` folder in IntelliJ IDEA or VS Code
- Run the `IslandScholarsApplication.java` main class

### Step 4: Verify Backend is Running

- Backend will be available at: `http://localhost:8080`
- Check the console for any errors
- The application will automatically create all database tables on first run

---

## Frontend Setup (React)

### Step 1: Navigate to Frontend Directory
```bash
cd ..  # Go back to root directory if you're in backend
# The frontend files are in the root directory
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Verify Frontend is Running

- Frontend will be available at: `http://localhost:5173`
- The browser should automatically open to the homepage

---

## Verification Steps

### 1. Test Database Connection
- Backend console should show successful database connection
- No database-related errors in the logs

### 2. Test API Endpoints
Visit these URLs in your browser to verify the backend is working:
- `http://localhost:8080/api/universities` - Should return a list of universities
- `http://localhost:8080/api/organizations` - Should return a list of organizations
- `http://localhost:8080/api/internships` - Should return a list of internships

### 3. Test Frontend-Backend Integration
1. Open `http://localhost:5173` in your browser
2. Navigate to the "Internships" page
3. Navigate to the "Organizations" page
4. Try creating a new account (Sign Up)
5. Try logging in with admin credentials:
   - Email: `admin@islandscholars.com`
   - Password: `admin123`

### 4. Test Core Functionality
1. **Student Registration:**
   - Create a student account
   - Verify universities appear in the dropdown
   - Complete registration and verify auto-login

2. **Organization Registration:**
   - Create an organization account
   - Complete registration and verify auto-login
   - Try creating an internship

3. **Direct Applications:**
   - As a student, try applying directly to an organization
   - Verify the application appears in the organization dashboard

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Error
**Error:** `role "island_scholars_user" does not exist`
**Solution:** Make sure you created the user BEFORE creating the database. Follow the database setup steps in exact order.

#### 2. Port Already in Use
**Error:** `Port 8080 is already in use`
**Solution:** 
- Kill the process using port 8080: `lsof -ti:8080 | xargs kill` (Mac/Linux)
- Or change the port in `application.properties`: `server.port=8081`

#### 3. Frontend Not Loading
**Error:** `ECONNREFUSED` or API calls failing
**Solution:**
- Ensure backend is running on `http://localhost:8080`
- Check that CORS is properly configured in the backend
- Verify the API base URL in frontend code

#### 4. Universities Not Showing in Signup
**Solution:**
- Verify the backend is running and accessible
- Check that sample data was inserted (universities should be created automatically)
- Check browser console for any JavaScript errors

#### 5. Direct Applications Not Working
**Solution:**
- Verify both student and organization accounts exist
- Check that the organization has a valid ID
- Look for any console errors in the browser

### Database Reset (if needed)

If you need to reset the database:
```sql
-- Connect as admin user
psql -U postgres

-- Drop and recreate
DROP DATABASE island_scholars_db;
DROP USER island_scholars_user;

-- Then follow the database setup steps again
```

### Logs and Debugging

**Backend Logs:**
- Check the Spring Boot console output
- Look for any SQL errors or connection issues

**Frontend Logs:**
- Open browser Developer Tools (F12)
- Check the Console tab for JavaScript errors
- Check the Network tab for failed API calls

---

## Development Workflow

### Making Changes

1. **Backend Changes:**
   - Modify Java files in `backend/src/main/java/`
   - Spring Boot will auto-reload in development mode
   - Check console for compilation errors

2. **Frontend Changes:**
   - Modify React files in `src/`
   - Vite will auto-reload the browser
   - Check browser console for errors

### Testing New Features

1. **Test Registration Flow:**
   - Try registering as different user types
   - Verify auto-login works
   - Check that user data is saved correctly

2. **Test Application Flow:**
   - Create internships as an organization
   - Apply to internships as a student
   - Verify applications appear in organization dashboard

3. **Test University Features:**
   - Register as a university
   - Verify students appear after being accepted
   - Test supervisor assignment

---

## Production Deployment Notes

When ready for production:

1. **Update Database Configuration:**
   - Use environment variables for database credentials
   - Use a production PostgreSQL instance

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Build Backend:**
   ```bash
   ./mvnw clean package -DskipTests
   ```

4. **Environment Variables:**
   ```bash
   export DATABASE_URL=your_production_db_url
   export DATABASE_USERNAME=your_production_username
   export DATABASE_PASSWORD=your_production_password
   ```

---

## Support

If you encounter any issues not covered in this guide:

1. Check the browser console for JavaScript errors
2. Check the Spring Boot console for backend errors
3. Verify all prerequisites are installed correctly
4. Ensure the database setup was completed in the correct order

The system should now be fully functional with all features working correctly!