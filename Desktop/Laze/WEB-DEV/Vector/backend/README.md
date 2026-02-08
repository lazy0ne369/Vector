# Vector Backend API - Documentation

## Project Setup

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8.0+

### Directory Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/vector/
│   │   │   ├── VectorApplication.java      # Main entry point
│   │   │   ├── model/                       # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   └── atlas/
│   │   │   │       ├── Course.java
│   │   │   │       ├── Deadline.java
│   │   │   │       └── WellbeingCheckIn.java
│   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   └── atlas/
│   │   │   │       ├── CourseDTO.java
│   │   │   │       ├── DeadlineDTO.java
│   │   │   │       └── WellbeingCheckInDTO.java
│   │   │   ├── repository/                  # JPA Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── atlas/
│   │   │   │       ├── CourseRepository.java
│   │   │   │       ├── DeadlineRepository.java
│   │   │   │       └── WellbeingCheckInRepository.java
│   │   │   ├── service/                     # Business Logic
│   │   │   │   └── atlas/
│   │   │   │       ├── CourseService.java
│   │   │   │       ├── DeadlineService.java
│   │   │   │       └── WellbeingService.java
│   │   │   ├── controller/                  # REST API Endpoints
│   │   │   │   └── atlas/
│   │   │   │       ├── CourseController.java
│   │   │   │       ├── DeadlineController.java
│   │   │   │       └── WellbeingController.java
│   │   │   ├── config/                      # Configuration Classes
│   │   │   ├── security/                    # JWT & Security
│   │   │   └── exception/                   # Exception Handling
│   │   └── resources/
│   │       └── application.properties       # App config
│   └── test/                                # Unit tests
├── pom.xml                                  # Maven dependencies
├── .env.example                             # Environment template
└── README.md                                # This file

```

### Installation Steps

1. **Clone the repository**

   ```bash
   cd Vector/backend
   ```

2. **Setup MySQL Database**

   ```sql
   CREATE DATABASE vector_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **Configure Environment Variables**

   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your values
   DB_URL=jdbc:mysql://localhost:3306/vector_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key
   CORS_ORIGINS=http://localhost:5173,http://localhost:5175
   ```

4. **Install Dependencies**

   ```bash
   mvn clean install
   ```

5. **Run the Application**

   ```bash
   mvn spring-boot:run
   ```

   Or run as JAR:

   ```bash
   mvn clean package
   java -jar target/vector-backend-1.0.0.jar
   ```

The server will start on `http://localhost:8080`

---

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication

All endpoints (except auth) require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Atlas Module Endpoints

### Courses

#### Get All Courses

```
GET /atlas/courses
Response: List<CourseDTO>
```

#### Get Course by ID

```
GET /atlas/courses/{id}
Response: CourseDTO
```

#### Get Courses by Status

```
GET /atlas/courses/status/{status}
Status: IN_PROGRESS, COMPLETED, DROPPED
Response: List<CourseDTO>
```

#### Get Courses by Semester

```
GET /atlas/courses/semester/{semester}
Response: List<CourseDTO>
```

#### Search Courses

```
GET /atlas/courses/search?query=<search_term>
Response: List<CourseDTO>
```

#### Get All Semesters

```
GET /atlas/courses/semesters
Response: List<String>
```

#### Get Course Statistics

```
GET /atlas/courses/stats
Response: {
  "totalCredits": 15,
  "inProgress": 3,
  "completed": 2,
  "dropped": 0
}
```

#### Create Course

```
POST /atlas/courses
Body: {
  "name": "Introduction to CS",
  "courseCode": "CS101",
  "instructor": "Dr. Smith",
  "credits": 3,
  "semester": "Fall 2024",
  "color": "#4F9D9A",
  "status": "IN_PROGRESS"
}
Response: CourseDTO
```

#### Update Course

```
PUT /atlas/courses/{id}
Body: CourseDTO (partial updates allowed)
Response: CourseDTO
```

#### Delete Course

```
DELETE /atlas/courses/{id}
Response: 204 No Content
```

---

### Deadlines

#### Get All Deadlines

```
GET /atlas/deadlines
Response: List<DeadlineDTO>
```

#### Get Deadline by ID

```
GET /atlas/deadlines/{id}
Response: DeadlineDTO
```

#### Get Pending Deadlines

```
GET /atlas/deadlines/pending
Response: List<DeadlineDTO>
```

#### Get Upcoming Deadlines

```
GET /atlas/deadlines/upcoming
Response: List<DeadlineDTO>
```

#### Get Deadlines Due Within N Days

```
GET /atlas/deadlines/upcoming/{days}
Response: List<DeadlineDTO>
```

#### Get Overdue Deadlines

```
GET /atlas/deadlines/overdue
Response: List<DeadlineDTO>
```

#### Get Deadlines by Course

```
GET /atlas/deadlines/course/{courseId}
Response: List<DeadlineDTO>
```

#### Search Deadlines

```
GET /atlas/deadlines/search?query=<search_term>
Response: List<DeadlineDTO>
```

#### Get Deadline Statistics

```
GET /atlas/deadlines/stats
Response: {
  "upcoming": 5,
  "highPriority": 2,
  "urgent": 1,
  "overdue": 0
}
```

#### Create Deadline

```
POST /atlas/deadlines
Body: {
  "title": "Assignment 1",
  "description": "Submit final project",
  "courseId": 1,
  "dueDate": "2024-02-15",
  "dueTime": "23:59",
  "priority": "HIGH",
  "type": "ASSIGNMENT",
  "reminderEnabled": true,
  "reminderDaysBefore": 2
}
Response: DeadlineDTO
```

#### Update Deadline

```
PUT /atlas/deadlines/{id}
Body: DeadlineDTO (partial updates allowed)
Response: DeadlineDTO
```

#### Toggle Deadline Completion

```
PATCH /atlas/deadlines/{id}/toggle
Response: DeadlineDTO
```

#### Delete Deadline

```
DELETE /atlas/deadlines/{id}
Response: 204 No Content
```

---

### Wellbeing Check-ins

#### Get All Check-ins

```
GET /atlas/wellbeing
Response: List<WellbeingCheckInDTO>
```

#### Get Today's Check-in

```
GET /atlas/wellbeing/today
Response: WellbeingCheckInDTO or null
```

#### Get Check-ins in Date Range

```
GET /atlas/wellbeing/range?startDate=2024-01-01&endDate=2024-01-31
Response: List<WellbeingCheckInDTO>
```

#### Get Latest N Check-ins

```
GET /atlas/wellbeing/latest/{limit}
Response: List<WellbeingCheckInDTO>
```

#### Get Weekly Statistics

```
GET /atlas/wellbeing/stats/weekly
Response: {
  "onTrackDays": 4,
  "needsAttentionDays": 2,
  "overloadedDays": 1,
  "averageStressLevel": 2.8,
  "averageSleepHours": 7.2
}
```

#### Create or Update Check-in

```
POST /atlas/wellbeing
Body: {
  "checkDate": "2024-01-25",
  "stressLevel": 3,
  "sleepQuality": 4,
  "sleepHours": 7.5,
  "energyLevel": 4,
  "workloadLevel": 3,
  "moodLevel": 4,
  "notes": "Feeling good today"
}
Response: WellbeingCheckInDTO
```

#### Delete Check-in

```
DELETE /atlas/wellbeing/{id}
Response: 204 No Content
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture TEXT,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Courses Table

```sql
CREATE TABLE courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  course_code VARCHAR(50),
  instructor VARCHAR(255),
  credits INT,
  semester VARCHAR(100),
  color VARCHAR(50),
  status ENUM('IN_PROGRESS', 'COMPLETED', 'DROPPED') DEFAULT 'IN_PROGRESS',
  current_grade VARCHAR(5),
  target_grade VARCHAR(5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Deadlines Table

```sql
CREATE TABLE deadlines (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  course_id BIGINT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time VARCHAR(20),
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
  type ENUM('ASSIGNMENT', 'EXAM', 'PROJECT', 'QUIZ', 'LAB', 'PRESENTATION', 'OTHER') DEFAULT 'ASSIGNMENT',
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  reminder_enabled BOOLEAN DEFAULT TRUE,
  reminder_days_before INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
```

### Wellbeing Check-ins Table

```sql
CREATE TABLE wellbeing_checkins (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  check_date DATE NOT NULL UNIQUE,
  stress_level INT CHECK (stress_level BETWEEN 1 AND 5),
  sleep_quality INT CHECK (sleep_quality BETWEEN 1 AND 5),
  sleep_hours DOUBLE,
  energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
  workload_level INT CHECK (workload_level BETWEEN 1 AND 5),
  mood_level INT CHECK (mood_level BETWEEN 1 AND 5),
  overall_status ENUM('ON_TRACK', 'NEEDS_ATTENTION', 'OVERLOADED'),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_date (user_id, check_date)
);
```

---

## Security

### JWT Configuration

- Token type: Bearer
- Algorithm: HS512
- Expiration: 24 hours (configurable in `.env`)
- Secret key: Set in `.env` (minimum 256 bits recommended)

### CORS Configuration

- Allowed origins configurable via `CORS_ORIGINS` in `.env`
- Default: `http://localhost:5173`, `http://localhost:5175`

---

## Error Handling

### Standard Error Response

```json
{
  "status": 404,
  "message": "Course not found",
  "timestamp": "2024-01-25T10:30:00"
}
```

### Common HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `204 No Content` - Deletion successful
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid JWT
- `403 Forbidden` - User doesn't have access
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Development

### Running Tests

```bash
mvn test
```

### Building for Production

```bash
mvn clean package -DskipTests
```

### Hot Reload (Development)

Spring DevTools is configured. Changes to Java files will trigger automatic restart:

```bash
mvn spring-boot:run
```

---

## Next Steps

- [ ] Implement Authentication/Authorization endpoints
- [ ] Create Flow module (Finance) endpoints
- [ ] Create Kit module (Preparedness) endpoints
- [ ] Implement file upload functionality
- [ ] Add email notification service
- [ ] Setup logging and monitoring
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Setup CI/CD pipeline
