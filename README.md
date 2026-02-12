# Simple CMS - Content Management System

A modern, drag-and-drop web application for creating and managing websites without coding.

---

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Node.js 18+** (for local development)
- **PostgreSQL** (handled by Docker)

---

## 📦 Installation & Running

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd cms-project
```

### 2. Set Up Environment Variables

Create a `.env` file in the `BE` folder:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/cms

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=5000
NODE_ENV=development

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get Cloudinary credentials:** https://cloudinary.com/ (free account)

### 3. Start the Application

```bash
docker compose up --build
```

This will start:
- **Database** (PostgreSQL) on port 5432
- **Backend** (Express API) on port 5000
- **Frontend** (React + Vite) on port 3000

### 4. Access the Application

Open your browser:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger Docs:** http://localhost:5000/api-docs

---

## 📁 Project Structure

```
cms-project/
├── BE/                      # Backend (Express.js)
│   ├── config/              # Database & Cloudinary config
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & validation
│   ├── migrations/          # Database migrations
│   └── index.js             # Entry point
│
├── FE/                      # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # API helpers
│   │   └── App.jsx          # Main app
│   └── package.json
│
└── docker-compose.yml       # Docker configuration
```

---

## 🛠️ Features

### For All Users:
- ✅ View public sites and pages
- ✅ Leave comments on published pages

### For Authors:
- ✅ Create and manage their own sites
- ✅ Drag & drop page builder (GrapesJS)
- ✅ Upload images (Cloudinary)
- ✅ Draft and publish pages

### For Admins:
- ✅ All author features
- ✅ Manage all users (view, delete)
- ✅ Delete any site
- ✅ Delete comments

---

## 🔧 Development

### Stop All Containers
```bash
docker compose down
```

### Rebuild Containers
```bash
docker compose up --build
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Sites
- `GET /api/sites/public` - Get all public sites
- `POST /api/sites` - Create site (auth required)
- `DELETE /api/sites/:id` - Delete site (auth required)

### Pages
- `GET /api/pages/site/:siteId` - Get pages by site
- `POST /api/pages` - Create page (auth required)
- `PUT /api/pages/:id` - Update page (auth required)
- `POST /api/pages/:id/publish` - Publish page (auth required)

### Media
- `POST /api/media` - Upload image (auth required)
- `GET /api/media/site/:siteId` - Get media by site

### Comments
- `POST /api/comments` - Add comment (public)
- `GET /api/comments/page/:pageId` - Get comments
- `DELETE /api/comments/:id` - Delete comment (admin only)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

Full API documentation: http://localhost:5000/api-docs

---

## 🔐 Security

- JWT authentication
- Bcrypt password hashing
- CORS protection
- Role-based authorization

---

## 📚 Technologies Used

### Backend:
- Node.js + Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt
- Cloudinary

### Frontend:
- React 18
- Vite
- React Router
- Tailwind CSS
- GrapesJS (drag & drop editor)

### DevOps:
- Docker
- Docker Compose

---

## 👥 Contributors

- Petar Mitrović (2022/0179)
- Mihailo Obradović (2022/0106)
- Gianluca Bartoli (2023/1074)