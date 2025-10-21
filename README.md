# Mini-Clinical Patient Management System

A full-stack web application for managing patients and their appointments, built with FastAPI, GraphQL, React, and TypeScript.

## Previews
<img width="1394" height="819" alt="Screenshot 2025-10-20 at 8 45 14 PM" src="https://github.com/user-attachments/assets/edb9f69e-c56b-48b5-aee3-709c345270d7" />
<img width="1410" height="818" alt="Screenshot 2025-10-20 at 8 45 58 PM" src="https://github.com/user-attachments/assets/8c83d106-a4d1-4242-a8cd-2b375ddd36b0" />

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
pip install -r requirements.txt

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


## 🗄️ Database

The application uses SQLite with automatic schema creation. On first run, the backend will:

1. Create a `patients.db` file in the backend directory
2. Set up tables for patients and appointments
3. Create necessary indexes

### Sample Data

To load sample data, you can use the mutation available in the GraphQL playground (http://127.0.0.1:8000/graphql):

To auto-populate using data within the system: 
```graphql
mutation {
  populate_db
}
```

To upload using other file: 
```graphql
mutation {
  upload_file(filePath: "your-path-here")
}
```



This will process the data from `patients_and_appointments.txt`.

## Future Work 
- **Enable upload files using the frontend**
- **Futher data clean up**
- **Enable table sorting and search functionality**
- **Add table to view all appointments**
- **Further normalize tables**

## Data Modeling and Validation
- Clean data by removing white spaces
- Data having more than 10 rows will be removed
- All data regardless of how many fields are empty will still be kept
- Incorrect contact data will be removed - no guessing 
- All empty or incorrect fields will be empty

**First and Last Name**
- First letter of name capitalized using `.str.title()` 
- Leading/trailing whitespace removed with `.str.strip()`
- If empty, leave blank (not NaN)

**DOB and Appointment Date**
- Multiple date formats automatically parsed using `dateutil.parser`:
- Converts all dates to standardized Python `date` objects
- Invalid dates (unparseable) set to empty/null

**Email**
- Converted to lowercase for consistency
- Leading/trailing whitespace removed
- Fixes common data entry errors: `[at]` → `@`
- Validates against regex pattern: `^[\w\.\-']+@[\w\.-]+\.\w+$`
- Invalid emails (missing domain, malformed) set to empty

**Phone Number**
- Removes all non-numeric characters using regex `\D`
- Validates exactly 10 digits assuming US phone numbers
- Adds "+1" country code prefix to valid numbers
- Invalid lengths (6 digits, 11+ digits) set to empty

**Address**
- Preserves original formatting and punctuation
- Only removes leading/trailing whitespace
- Not heavily filtered to maintain address variety
