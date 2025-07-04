# Database Setup Instructions

## Step 1: Create the Database User First

Connect to PostgreSQL as the admin user and run these commands **in order**:

```sql
-- First, create the user
CREATE USER island_scholars_user WITH PASSWORD 'password';

-- Then create the database
CREATE DATABASE island_scholars_db;

-- Finally, grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE island_scholars_db TO island_scholars_user;

-- Also grant schema privileges (important for PostgreSQL)
\c island_scholars_db
GRANT ALL ON SCHEMA public TO island_scholars_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO island_scholars_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO island_scholars_user;
```

## Step 2: Verify the Setup

Test the connection:

```bash
psql -h localhost -U island_scholars_user -d island_scholars_db
```

Enter password: `password`

If you can connect successfully, the setup is complete!

## Step 3: Run the Spring Boot Application

```bash
cd backend
./mvnw spring-boot:run
```

The application will automatically create all the necessary tables when it starts.

## Troubleshooting

If you get permission errors, make sure to run these additional commands:

```sql
-- Connect as admin user to the database
\c island_scholars_db

-- Grant additional permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO island_scholars_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO island_scholars_user;
```

## Alternative: Use Default PostgreSQL User

If you prefer to use the default postgres user, update `application.properties`:

```properties
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
```