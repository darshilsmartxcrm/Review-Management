# ⭐ Review Growth Hub / SmartXCRM - Backend API

> **High-Performance Node.js, Express & MongoDB (Mongoose) Backend**  
> Complete with **JWT Authentication Middleware**, **Role-Based Access Control**, and **Automatic 24-Hour Review Lock TTL**.  
> Designed to seamlessly support all features of the **Review Growth Hub** frontend without breaking existing flow or logic.

---

## 🛠️ Tech Stack & Highlights

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing
- **Security:** JWT Auth Middleware with Bearer Token verification, CORS protection
- **Logging:** Morgan HTTP logger
- **Review Deduplication:** Automatic MongoDB TTL (Time-To-Live) indexing on 24-hour review locks

---

## 📁 Directory Structure

```
backend/
├── .env                  # Environment configurations (Port, DB URI, JWT Secret)
├── .env.example          # Sample environment variables
├── package.json          # Dependencies and scripts
├── server.js             # HTTP server entrypoint
├── test-backend.js       # Integration test suite (20/20 test assertions)
└── src/
    ├── app.js            # Express app configuration, CORS & route mounting
    ├── config/
    │   └── db.js         # MongoDB connection with auto-reconnect & error handling
    ├── controllers/
    │   ├── authController.js    # Register, login, get current user, change password
    │   ├── clientController.js  # CRUD, filtering by category/status/search, bulk import
    │   ├── leadController.js    # Inbound client inquiries from "Apply Now"
    │   ├── reviewController.js  # 24-Hour anti-repetition review lock system
    │   └── settingController.js # Agency master WhatsApp contact & preferences
    ├── middleware/
    │   ├── auth.js              # authenticate, requireRole, optionalAuth
    │   └── errorHandler.js      # Centralized error handler (validation, duplicate keys)
    ├── models/
    │   ├── User.js              # Admin credentials with bcrypt hashing
    │   ├── Client.js            # Business funnels, categories, keywords, validity
    │   ├── Lead.js              # Inquiries and prospective clients
    │   ├── Setting.js           # Agency settings singleton
    │   └── UsedReview.js        # 24-Hour review lock with MongoDB TTL index
    ├── routes/
    │   ├── authRoutes.js        # /api/auth/*
    │   ├── clientRoutes.js      # /api/clients/*
    │   ├── leadRoutes.js        # /api/leads/*
    │   ├── reviewRoutes.js      # /api/reviews/*
    │   └── settingRoutes.js     # /api/settings/*
    ├── scripts/
    │   └── seed.js              # Database initialization & frontend data sync
    └── utils/
        └── jwt.js               # JWT signing and verification helper
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/review_management
JWT_SECRET=super_secret_jwt_key_smartxcrm_2026_review_hub
JWT_EXPIRES_IN=30d
CLIENT_ORIGIN=http://localhost:3000
```

### 3. Seed Database (Admin & Sample Clients)
Automatically seeds the admin account and copies existing frontend sample clients and settings:
```bash
npm run seed
```
- **Default Admin Username:** `admin`
- **Default Admin Password:** `admin@123`

### 4. Run Server
```bash
# Production mode
npm start

# Development mode (auto-restart with nodemon)
npm run dev
```

### 5. Run Verification Tests
```bash
node test-backend.js
```

---

## 📡 API Endpoints Reference

### 🔐 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user/admin | Public |
| `POST` | `/api/auth/login` | Log in and receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Bearer JWT** |
| `PUT` | `/api/auth/change-password` | Update current user's password | **Bearer JWT** |

#### Login Request Sample:
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin@123"
}
```

#### Successful Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67be6477d...",
    "username": "admin",
    "name": "Master Admin",
    "role": "admin",
    "phone": "919876543210"
  }
}
```

---

### 🏢 2. Client Businesses (`/api/clients`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/clients` | List clients (supports `?category=`, `?status=`, `?search=`, `?id=`) | Public |
| `GET` | `/api/clients/:id` | Get single client by custom `id` or MongoDB `_id` | Public |
| `POST` | `/api/clients` | Create or update client (also supports bulk array sync) | **Bearer JWT** |
| `PUT` | `/api/clients/:id` | Update client details | **Bearer JWT** |
| `DELETE`| `/api/clients/:id` | Delete a client business | **Bearer JWT** |

---

### 📩 3. Inquiries & Leads (`/api/leads`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/leads` | Submit new lead inquiry (from "Apply Now" modal) | Public |
| `GET` | `/api/leads` | List all inquiries | **Bearer JWT** |
| `DELETE`| `/api/leads/:id` | Remove an inquiry | **Bearer JWT** |
| `PUT` | `/api/leads/:id/status`| Update status (`new`, `contacted`, `converted`) | **Bearer JWT** |

---

### ⚙️ 4. Agency Settings (`/api/settings`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/settings` | Get master agency WhatsApp contact & config | Public |
| `POST` / `PUT` | `/api/settings` | Update agency phone & settings | **Bearer JWT** |

---

### 🔒 5. 24-Hour Review Locks (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/reviews?clientId=client_1` | Get active 24h locked reviews for client | Public |
| `POST` | `/api/reviews` | Lock review text for 24h across all users | Public |

---

### 🩺 6. System Health Check
`GET /api/health`
```json
{
  "status": "ok",
  "uptime": 12.34,
  "timestamp": "2026-10-27T04:55:00.000Z",
  "database": {
    "status": "connected",
    "name": "review_management"
  },
  "service": "Review Growth Hub & SmartXCRM Backend API"
}
```
