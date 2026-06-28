# AutoCare

AutoCare is a full-stack MERN web application designed to simplify vehicle service appointment management. The system allows customers to book service appointments online, manage their bookings, and track service history, while administrators can manage customers, appointments, and service records through a dedicated dashboard.


## Live Application

https://autocare-mern-sigma.vercel.app/

## Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas |

## Features

### Customer Features

* User registration and login
* Secure JWT authentication
* Book vehicle service appointments
* View appointment history
* Manage personal profile
* Track service records
* Responsive user interface

### Admin Features

* Admin dashboard
* Manage customers
* Manage appointments
* Update appointment status
* View service records
* Monitor system statistics

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Context API
* CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

## Project Structure

```text
autocare/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env
```

## Installation

### Clone Repository

```bash
git clone: https://github.com/ErraSheikh/autocare-mern.git
cd autocare
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Database

MongoDB Atlas is used as the cloud database to store:

* Users
* Vehicles
* Appointments
* Service Records

## Authentication

The application uses JWT (JSON Web Tokens) for secure authentication and authorization. Passwords are encrypted using bcryptjs before being stored in the database.

## Future Enhancements

* Email notifications
* SMS appointment reminders
* Online payments
* Vehicle maintenance tracking
* Service center reviews and ratings

## Author
Erra Sheikh
BSCS
Developed as a MERN Stack University Project.
