# FitBook

FitBook is a full-stack group training booking application.

Users can register, log in, view available group training sessions, book a session, view their own bookings, and cancel bookings.

Admins can view all bookings, confirm bookings, cancel bookings, and mark bookings as completed.

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- PostgreSQL
- JWT authentication
- bcrypt password hashing

## Project Structure

```txt
pavasario-projektas-js/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## Local PostgreSQL Setup

This project uses PostgreSQL through Docker Compose for local development.

### Requirements

Before starting the database, make sure Docker Desktop is installed and running.

### Start PostgreSQL

From the project root folder, run:

```bash
docker compose up -d
```

This starts a PostgreSQL container in the background.

### Check Running Containers

```bash
docker ps
```

You should see the Compose services running under the project for this repo. The database service is `db`.

### Database Credentials

The local PostgreSQL database is configured with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=fitbook
```

These values should match the backend `.env` file.

### Connect to PostgreSQL Manually

To open the PostgreSQL CLI inside the database service, run:

```bash
docker compose exec db psql -U postgres -d fitbook
```

Inside `psql`, you can confirm the connection with:

```sql
\conninfo
```

To exit `psql`, run:

```sql
\q
```

### Stop PostgreSQL

```bash
docker compose down
```

This stops the container but keeps the database data because it is stored in a Docker volume.

### Remove PostgreSQL Data

Use this only if you want to delete the local database volume completely:

```bash
docker compose down -v
```

## Backend Setup

From the backend folder, install dependencies:

```bash
cd backend
npm install
```

Create a local environment file from the example file:

```bash
cp .env.example .env
```

Make sure the database values in `.env` match the Docker Compose database credentials.

Start the backend server:

```bash
npm run dev
```

The backend should run on:

```txt
http://localhost:3000
```

### Health Check

To check if the backend and database connection are working, run:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "success",
  "message": "FitBook API is running",
  "database": "connected"
}
```

## Useful Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Show running containers
docker ps

# Open PostgreSQL CLI
docker compose exec db psql -U postgres -d fitbook
```
