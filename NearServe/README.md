# NearServe 📍
> A full-stack local services marketplace where users can book verified local service providers.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, JWT Auth
- **Database:** MySQL

## Features
- User & Provider registration with role-based access
- Browse, search & filter services by category/location
- Service detail page with booking form
- Provider dashboard to manage listings & bookings
- User dashboard to track booking history
- Star rating & review system

---

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL installed and running
- Git

---

### Step 1 – Clone the repo
```bash
git clone https://github.com/ShivamV1212/NearServe.git
cd NearServe
```

### Step 2 – Setup the Database
1. Open MySQL Workbench or your MySQL terminal
2. Run the schema file:
```sql
source database/schema.sql
```

### Step 3 – Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```
Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=nearserve
JWT_SECRET=anysecretstring123
PORT=5000
```
Start the server:
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

### Step 4 – Setup the Frontend
Open a new terminal:
```bash
cd client
npm install
npm start
```
App runs at: `http://localhost:3000`

---

## Push to GitHub (after making changes)
```bash
git add .
git commit -m "your message"
git push origin main
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register user/provider |
| POST | /api/auth/login | No | Login |
| GET | /api/services | No | List all services |
| GET | /api/services/:id | No | Service detail |
| POST | /api/services | Provider | Add service |
| PUT | /api/services/:id | Provider | Update service |
| DELETE | /api/services/:id | Provider | Delete service |
| POST | /api/bookings | User | Book a service |
| GET | /api/bookings/my | User | My bookings |
| GET | /api/bookings/provider | Provider | Incoming bookings |
| PATCH | /api/bookings/:id/status | Provider | Update booking status |
| GET | /api/categories | No | All categories |
| POST | /api/reviews | User | Add review |

---

Made with ❤️ by Shivam Vishwakarma
