# 🚀 WhatsApp Marketing Dashboard

A production-ready SaaS dashboard for managing WhatsApp marketing campaigns, contacts, and real-time chats. Built with a modern **Next.js 14** frontend and a robust **FastAPI** backend with **MongoDB**.

![Dashboard Preview](https://via.placeholder.com/800x400?text=WhatsApp+Dashboard+Preview)

## ✨ Features

- **🔐 Authentication**: Secure User Registration & Login (JWT, Bcrypt).
- **👥 Contact Management**: CRUD operations, tagging, avatars, and filtering.
- **💬 Live Chat**: Real-time mock chat interface with media support and templates.
- **📢 Campaign Wizard**: Create, schedule, and track marketing campaigns.
- **📊 Analytics**: Visual insights into campaign performance (Sent, Delivered, Read).
- **📝 Template Manager**: Manage WhatsApp templates with approval status.
- **🔌 Integration**: Google Sheets import mock and contacts sync.
- **🎨 Modern UI**: Built with Shadcn UI, dark mode ready, and responsive design.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (Radix Primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend (Server)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **ODM**: Beanie (Async)
- **Validation**: Pydantic
- **Security**: PyJWT, Passlib (Bcrypt)

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **MongoDB**: Atlas or local instance

### 1. Backend Setup (`/server`)

```bash
cd server
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `server/`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
```

Run the server:
```bash
uvicorn main:app --reload
# Server running at http://localhost:8000
```

### 2. Frontend Setup (`/client`)

```bash
cd client
npm install
```

Run the development server:
```bash
npm run dev
# App running at http://localhost:3000
```

## 📂 Project Structure

```
├── client/              # Next.js Frontend
│   ├── src/
│   │   ├── app/         # App Router Pages
│   │   ├── components/  # Reusable UI Components
│   │   ├── lib/         # API Adapters & Utils
│   │   └── store/       # Zustand State
│
└── server/              # FastAPI Backend
    ├── routers/         # API Endpoints (Auth, Chat, etc.)
    ├── models.py        # Beanie/Pydantic Models
    ├── database.py      # DB Configuration
    └── main.py          # App Entry
```

## 🛡️ Verification

You can verify the backend health and standard flows by running:

```bash
# In /server directory
python verify_system.py
```

## 📄 License

MIT License.
