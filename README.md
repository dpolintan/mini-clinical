# Mini-Clinical Patient Management System

A full-stack web application for managing patients and their appointments, built with FastAPI, GraphQL, React, and TypeScript.

## 🏗️ Architecture

- **Backend**: FastAPI + Strawberry GraphQL + SQLAlchemy + SQLite
- **Frontend**: React + TypeScript + Apollo Client + Material-UI
- **Database**: SQLite (with automatic schema creation)

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.8+** (Python 3.14 may show warnings but works)
- **Node.js 16+** and **npm**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/dpolintan/mini-clinical.git
cd mini-clinical
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install "fastapi[standard]" strawberry-graphql sqlalchemy pandas python-dateutil

# Start the backend server
python -m fastapi dev server.py
```

The backend will be available at:
- **API**: http://127.0.0.1:8000
- **GraphQL Playground**: http://127.0.0.1:8000/graphql
- **API Documentation**: http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at: http://localhost:3000

## 📁 Project Structure

```
mini-clinical/
├── backend/
│   ├── server.py              # FastAPI application entry point
│   ├── schema.py              # GraphQL schema and resolvers
│   ├── models.py              # SQLAlchemy database models
│   ├── ingest.py              # CSV data processing utilities
│   ├── patients_and_appointments.txt  # Sample data file
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Main application component
│   │   ├── components/       # React components
│   │   │   ├── Main.tsx      # Router configuration
│   │   │   ├── Patients.tsx  # Patient list view
│   │   │   └── Appointments.tsx  # Patient detail/appointments view
│   │   └── api/
│   │       └── PatientsApi.tsx  # GraphQL queries
│   ├── package.json          # Node.js dependencies
│   └── tsconfig.json         # TypeScript configuration
├── queries.sql               # Database schema (reference)
└── README.md                 # This file
```

## 🗄️ Database

The application uses SQLite with automatic schema creation. On first run, the backend will:

1. Create a `patients.db` file in the backend directory
2. Set up tables for patients and appointments
3. Create necessary indexes

### Sample Data

To load sample data, you can use the mutation available in the GraphQL playground:

```graphql
mutation {
  uploadCsv
}
```

This will process the data from `patients_and_appointments.txt`.

## 🔧 API Endpoints

### GraphQL Queries

**Get all patients:**
```graphql
query {
  patients {
    id
    firstName
    lastName
    dob
    email
    phone
  }
}
```

**Get patient with appointments:**
```graphql
query GetPatient($id: Int!) {
  patient(id: $id) {
    id
    firstName
    lastName
    dob
    email
    phone
    appointments {
      id
      appointmentDate
      appointmentType
    }
  }
}
```

### REST Endpoints

- **GraphQL Endpoint**: `POST /graphql`
- **API Documentation**: `GET /docs`
- **Health Check**: `GET /` (redirects to docs)


## 📝 Environment Variables

Create a `.env` file in the backend directory for configuration:

```env
DATABASE_URL=sqlite:///./patients.db
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DEBUG=true
```
## Future Work 