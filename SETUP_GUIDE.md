# Island Scholars Platform - Complete Setup Guide

## System Overview

Island Scholars Platform is a comprehensive internship management system designed for Tanzanian university students. The platform connects students with organizations offering field internships, which are mandatory academic requirements.

### Technology Stack
- **Frontend**: React (JavaScript/JSX) with Tailwind CSS
- **Backend**: Spring Boot REST API (Java)
- **Database**: PostgreSQL
- **Authentication**: Session-based (no JWT)
- **Architecture**: MVC Pattern

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

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

5. **IDE/Code Editor**
   - IntelliJ IDEA (recommended for Spring Boot)
   - VS Code with Java Extension Pack

---

## Database Setup

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL as admin user
CREATE DATABASE island_scholars_db;
CREATE USER island_scholars_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE island_scholars_db TO island_scholars_user;
```

### 2. Database Schema

The Spring Boot application will automatically create tables using JPA/Hibernate. The main entities include:

- **Users** (students, organizations, universities, admins)
- **Universities** (partner institutions)
- **Organizations** (internship providers)
- **Students** (with university relationships)
- **Internships** (job postings)
- **Applications** (student applications)
- **Supervisors** (university staff)
- **Documents** (file uploads)
- **Notifications** (email/SMS/in-app)

---

## Backend Setup (Spring Boot)

### 1. Create Spring Boot Project Structure

```
island-scholars-backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── islandscholars/
│       │           ├── IslandScholarsApplication.java
│       │           ├── config/
│       │           ├── controller/
│       │           ├── dto/
│       │           ├── entity/
│       │           ├── repository/
│       │           └── service/
│       └── resources/
│           ├── application.properties
│           └── static/
├── pom.xml
└── README.md
```

### 2. Required Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.islandscholars</groupId>
    <artifactId>island-scholars-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>island-scholars-backend</name>
    <description>Island Scholars Platform Backend</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- File Upload -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.5</version>
        </dependency>
        
        <!-- Password Encryption -->
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-crypto</artifactId>
        </dependency>
        
        <!-- Development Tools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3. Application Configuration (application.properties)

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/island_scholars_db
spring.datasource.username=island_scholars_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Email Configuration (Gmail example)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000

# Application Properties
app.upload.dir=./uploads
app.base-url=http://localhost:8080
```

### 4. Main Application Class

```java
package com.islandscholars;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IslandScholarsApplication {
    public static void main(String[] args) {
        SpringApplication.run(IslandScholarsApplication.class, args);
    }
}
```

### 5. Key Entity Examples

#### User Entity
```java
package com.islandscholars.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors, getters, and setters
}

enum UserRole {
    STUDENT, ORGANIZATION, UNIVERSITY, ADMIN
}
```

### 6. Essential API Endpoints

#### Authentication Controller
```java
package com.islandscholars.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Implementation
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Implementation
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Implementation
    }
}
```

#### Internships Controller
```java
@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InternshipController {
    
    @GetMapping
    public ResponseEntity<List<InternshipDTO>> getAllInternships() {
        // Implementation
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InternshipDTO> getInternshipById(@PathVariable Long id) {
        // Implementation
    }
    
    @PostMapping
    public ResponseEntity<InternshipDTO> createInternship(@RequestBody CreateInternshipRequest request) {
        // Implementation
    }
}
```

---

## Frontend Setup (React)

The frontend is already provided in the project. To set it up:

### 1. Install Dependencies
```bash
cd island-scholars-frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Island Scholars Platform
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Complete API Endpoints List

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

### User Management
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user (admin only)

### University Endpoints
- `GET /api/universities` - Get all universities
- `GET /api/universities/{id}` - Get university details
- `POST /api/universities` - Create university (admin only)
- `PUT /api/universities/{id}` - Update university

### Organization Endpoints
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/{id}` - Get organization details
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/{id}` - Update organization

### Student Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student details
- `GET /api/students/university/{universityId}` - Get students by university
- `PUT /api/students/{id}` - Update student profile
- `PUT /api/students/{id}/assign-supervisor` - Assign supervisor

### Internship Endpoints
- `GET /api/internships` - Get all internships
- `GET /api/internships/{id}` - Get internship details
- `GET /api/internships/organization/{orgId}` - Get internships by organization
- `POST /api/internships` - Create internship
- `PUT /api/internships/{id}` - Update internship
- `DELETE /api/internships/{id}` - Delete internship

### Application Endpoints
- `GET /api/applications` - Get all applications
- `GET /api/applications/{id}` - Get application details
- `GET /api/applications/student/{studentId}` - Get applications by student
- `GET /api/applications/organization/{orgId}` - Get applications by organization
- `GET /api/applications/university/{uniId}` - Get applications by university
- `POST /api/applications` - Submit application
- `PUT /api/applications/{id}/accept` - Accept application
- `PUT /api/applications/{id}/reject` - Reject application

### Document Endpoints
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{id}` - Download document
- `GET /api/documents/user/{userId}` - Get user documents

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/send` - Send notification
- `PUT /api/notifications/{id}/read` - Mark as read

### Admin Endpoints
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/recent-activity` - Get recent system activity
- `GET /api/admin/reports` - Generate reports

---

## Running the Complete System

### 1. Start PostgreSQL Database
Ensure PostgreSQL is running and the database exists.

### 2. Start Backend Server
```bash
cd island-scholars-backend
./mvnw spring-boot:run
```
Or using your IDE's run configuration.

Backend will be available at `http://localhost:8080`

### 3. Start Frontend Development Server
```bash
cd island-scholars-frontend
npm run dev
```

Frontend will be available at `http://localhost:5173`

### 4. Verify System is Working
1. Visit `http://localhost:5173` in your browser
2. Try creating a new account
3. Browse internships
4. Test the complete user flow

---

## Authentication Implementation

The system uses session-based authentication (no JWT):

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/internships/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/organizations/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

---

## File Upload Configuration

### Upload Directory Setup
```java
@Configuration
public class FileUploadConfig {
    
    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;
    
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }
}
```

---

## Email Notification Setup

### Email Service Implementation
```java
@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendApplicationNotification(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
```

---

## Sample Data for Testing

### Test Universities
```sql
INSERT INTO universities (name, location, email, phone_number, created_at) VALUES
('University of Dar es Salaam', 'Dar es Salaam', 'info@udsm.ac.tz', '+255-22-2410500', NOW()),
('Sokoine University of Agriculture', 'Morogoro', 'info@sua.ac.tz', '+255-23-2640013', NOW()),
('State University of Zanzibar', 'Zanzibar', 'info@suza.ac.tz', '+255-24-2230750', NOW());
```

### Test Organizations
```sql
INSERT INTO organizations (name, industry, location, email, description, created_at) VALUES
('Vodacom Tanzania', 'Telecommunications', 'Dar es Salaam', 'careers@vodacom.co.tz', 'Leading telecommunications company', NOW()),
('CRDB Bank', 'Banking', 'Dar es Salaam', 'hr@crdbbank.com', 'Premier banking institution', NOW()),
('Tanzania Ports Authority', 'Logistics', 'Dar es Salaam', 'info@ports.go.tz', 'National ports authority', NOW());
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in application.properties
   - Ensure database exists

2. **Port Already in Use**
   - Change server port in application.properties
   - Kill process using the port: `lsof -ti:8080 | xargs kill`

3. **CORS Issues**
   - Verify CORS configuration in Spring Boot
   - Check allowed origins match frontend URL

4. **File Upload Issues**
   - Ensure upload directory exists and has write permissions
   - Check file size limits in configuration

### Logging Configuration
Add to application.properties for debugging:
```properties
logging.level.com.islandscholars=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

---

## Production Deployment

### Environment Variables for Production
```bash
export DATABASE_URL=jdbc:postgresql://prod-host:5432/island_scholars_db
export DATABASE_USERNAME=prod_user
export DATABASE_PASSWORD=secure_prod_password
export EMAIL_USERNAME=production@islandscholars.com
export EMAIL_PASSWORD=secure_email_password
export UPLOAD_DIR=/var/uploads
export BASE_URL=https://api.islandscholars.com
```

### Build for Production
```bash
# Backend
./mvnw clean package -DskipTests

# Frontend
npm run build
```

---

## Support and Maintenance

### Database Backup
```bash
pg_dump -h localhost -U island_scholars_user island_scholars_db > backup.sql
```

### Log Files Location
- Spring Boot logs: `logs/application.log`
- Upload directory: `./uploads/`

### Monitoring Endpoints
Spring Boot Actuator endpoints (add dependency):
- `/actuator/health` - Application health
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application info

---

This setup guide provides everything needed to run the Island Scholars Platform locally. The system is designed to be beginner-friendly while maintaining production-level functionality and security.