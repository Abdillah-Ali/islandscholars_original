# Island Scholars Platform - Backend

This is the Spring Boot backend for the Island Scholars Platform, an internship management system for Tanzanian university students.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **PostgreSQL**
- **Spring Data JPA**
- **Spring Security**
- **Maven**

## Prerequisites

- Java 17 or later
- PostgreSQL 13+
- Maven 3.6+

## Database Setup

1. Install PostgreSQL and create a database:
```sql
CREATE DATABASE island_scholars_db;
CREATE USER island_scholars_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE island_scholars_db TO island_scholars_user;
```

2. Update `src/main/resources/application.properties` with your database credentials.

## Running the Application

1. Clone the repository
2. Navigate to the backend directory
3. Update database configuration in `application.properties`
4. Run the application:

```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/{id}` - Get internship by ID
- `POST /api/internships` - Create new internship
- `PUT /api/internships/{id}` - Update internship
- `DELETE /api/internships/{id}` - Delete internship

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/student/{studentId}` - Get applications by student
- `POST /api/applications` - Submit application
- `PUT /api/applications/{id}/accept` - Accept application
- `PUT /api/applications/{id}/reject` - Reject application

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/{id}` - Get organization by ID
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/{id}` - Update organization

### Universities
- `GET /api/universities` - Get all universities
- `GET /api/universities/{id}` - Get university by ID
- `POST /api/universities` - Create university
- `PUT /api/universities/{id}` - Update university

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `PUT /api/students/{id}` - Update student profile

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/recent-activity` - Get recent activity
- `GET /api/admin/reports` - Generate reports

## Database Schema

The application uses the following main entities:

- **User** - Base user entity with authentication
- **Student** - Student profiles linked to universities
- **Organization** - Company/organization profiles
- **University** - University information
- **Internship** - Internship postings
- **Application** - Student applications to internships
- **Supervisor** - University supervisors
- **Document** - File uploads
- **Notification** - System notifications

## Security

The application uses Spring Security with:
- BCrypt password encoding
- Session-based authentication
- CORS configuration for frontend integration
- Role-based access control

## File Upload

Documents can be uploaded to the `./uploads` directory. The path is configurable via the `app.upload.dir` property.

## Development

To run in development mode with auto-reload:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## Testing

Run tests with:

```bash
./mvnw test
```

## Building for Production

```bash
./mvnw clean package -DskipTests
```

The JAR file will be created in the `target/` directory.