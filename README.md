# Vector

A full‑stack web app with a React (Vite) frontend and a Spring Boot (Maven) backend.  
This repository contains both client and server code, along with shared documentation and scripts.

---

## ✨ Features

- JWT‑based authentication
- User settings (theme + language toggles)
- Global search with quick actions
- Modular “Atlas” features (courses, deadlines, wellbeing)
- REST API backend with MySQL
- Frontend API layer + hooks for data access

> If any feature in this list doesn’t match your current code, update the section accordingly.

---

## 🧰 Tech Stack

**Frontend**
- React + Vite
- React Router
- i18n (multilingual UI)

**Backend**
- Spring Boot (Maven)
- Spring Security + JWT
- JPA / JDBC
- MySQL

---

## ✅ Requirements

- **Node.js** (LTS recommended)
- **Java 17+**
- **Maven**
- **MySQL**

---

## 📦 Project Structure

```
Vector/
├── backend/           # Spring Boot backend
├── src/               # React frontend
├── public/            # Frontend public assets
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend

Create a `.env` in the project root or inside `src` (depending on your Vite config):

```
VITE_API_URL=http://localhost:8080
```

### Backend

Configure the database and JWT secret in:

```
backend/src/main/resources/application.properties
```

Typical settings:

```
spring.datasource.url=jdbc:mysql://localhost:3306/vector_db
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
jwt.secret=YOUR_BASE64_SECRET
```

---

## ▶️ Running the Project

### 1) Start MySQL

```sql
CREATE DATABASE vector_db;
```

### 2) Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 3) Start Frontend

```bash
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 API Endpoints (Backend)

> Adjust if your actual controllers differ.

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

**Atlas**
- `GET /api/atlas/courses`
- `POST /api/atlas/courses`
- `PUT /api/atlas/courses/{id}`
- `DELETE /api/atlas/courses/{id}`

- `GET /api/atlas/deadlines`
- `POST /api/atlas/deadlines`
- `PATCH /api/atlas/deadlines/{id}/toggle`
- `DELETE /api/atlas/deadlines/{id}`

- `GET /api/atlas/wellbeing`
- `POST /api/atlas/wellbeing`

---

## 🧪 Tests

### Frontend
```bash
npm test
```

### Backend
```bash
cd backend
mvn test
```

---

## 🛠️ Build

### Frontend
```bash
npm run build
```

### Backend
```bash
cd backend
mvn package
```

---

## 📌 Notes

- Ensure MySQL is running before starting the backend.
- If you change the API base URL, update `VITE_API_URL`.
- For production, use a strong Base64 JWT secret.

---

## 📄 License

Add your license here (e.g., MIT).

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a PR
