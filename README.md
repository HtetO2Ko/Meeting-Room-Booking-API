# Meeting Room Booking System API

A role-based meeting room booking API built with Node.js, Express, TypeScript, and MySQL.  
This project demonstrates connection pooling, clean structural layer segregation (Controllers, Services, Repositories), structural parameter validations, and overlapping scheduling math.

---

## 🌐 Live Deployment Access
* **API Base URL:** `https://meeting-room-booking-api-production.up.railway.app`

---

## 🚀 Features

- Express.js REST API
- MySQL database integration
- TypeScript support
- Role-based authorization layers (Admin, Owner, User)
- Booking schedule overlap protection math
- Custom input payload and parameter validations (via express-validator)
- Environment variables with dotenv
- Connection pooling
- Modular folder structure
- CORS enabled
- Development with hot reload

---

## 📦 Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- mysql2
- express-validator
- dotenv
- tsx

---

## 📁 Project Structure

```bash
src/
│
├── config/
│
├── controllers/
│
├── interfaces/
│
├── middlewares/
│
├── repositories/
│
├── routes/
│
├── services/
│
├── utils/
│
└── server.ts
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/HtetO2Ko/Meeting-Room-Booking-API.git
```

Move into the project folder:

```bash
cd Meeting-Room-Booking-API
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=meeting_room_book
DB_PORT=3306
DB_SSL=false
PORT=5050
NODE_ENV=development
```

---

## 🗄️ MySQL Database Setup

Create database manually:

```sql
CREATE DATABASE meeting_room_book;
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5050
```
---

## 📡 Sample API

### Health Check

```http
GET /
```

Response:

```json
{
    "success": true,
    "message": "API is working...",
    "data": null,
    "error": null
}
```
