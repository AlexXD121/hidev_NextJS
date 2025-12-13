# 🟢 WhatsApp Marketing Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square) ![Status](https://img.shields.io/badge/status-production--ready-success.svg?style=flat-square)

A professional, production-ready SaaS dashboard designed to streamline WhatsApp marketing campaigns. Manage contacts, design templates, send broadcasts, and engage with customers in real-time.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=WhatsApp+Dashboard+Preview)

---

## ✨ Key Features

- **🔐 Robust Authentication**: Secure user access with JWT tokens and Bcrypt hashing.
- **👥 Contact Management**: Easily add, tag, and filter your customer base. Support for bulk operations.
- **💬 Real-Time Live Chat**: A WhatsApp-Web style interface for 1:1 customer support.
- **📢 Campaign Wizard**: Step-by-step flow to create, schedule, and launch marketing broadcasts.
- **📊 Detailed Analytics**: Track delivery rates, read receipts, and campaign performance at a glance.
- **📝 Template Builder**: Create and manage message templates with dynamic placeholders and approval statuses.
- **🎨 Modern UX/UI**: Built with **Next.js 14**, **Tailwind CSS**, and **Shadcn UI** for a sleek, responsive experience (Dark Mode included).

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State**: [Zustand](https://docs.pmnd.rs/zustand)
- **Validation**: Zod & React Hook Form
- **Icons**: Lucide React

### Server (Backend)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **ODM**: [Beanie](https://beanie-odm.dev/) (Async)
- **Validation**: Pydantic v2
- **Auth**: PyJWT & Passlib

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.11 or higher
- **MongoDB**: Access to a MongoDB Atlas cluster or local instance.

### 1. Backend Setup
Navigate to the server directory and set up the Python environment.

```bash
cd server
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### Environment Variables for Backend
Create a `.env` file in the `server/` directory:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGO_URI` | Connection string for MongoDB | `mongodb+srv://user:pass@cluster...` |
| `JWT_SECRET` | Secret key for signing tokens | `super_secret_key_123` |

**Run the Server:**
```bash
python -m uvicorn main:app --reload
# Server starts at: http://localhost:8000
# API Docs available at: http://localhost:8000/docs
```

### 2. Frontend Setup
Navigate to the client directory and install dependencies.

```bash
cd client
npm install
```

**Run the Client:**
```bash
npm run dev
# App starts at: http://localhost:3000
```

---

## 📂 Project Structure

```bash
├── client/                 # Next.js Application
│   ├── src/
│   │   ├── app/            # Pages & Routes
│   │   ├── components/     # UI Building Blocks
│   │   ├── lib/            # Utilities & API Logic
│   │   └── store/          # Global State (Zustand)
│
└── server/                 # FastAPI Service
    ├── routers/            # API Route Handlers
    ├── models.py           # Database Schemas
    ├── database.py         # DB Connection Logic
    └── main.py             # Application Entry Point
```

## 🛡️ Verification & Testing
To ensure the system is running correctly, you can run the included verification scripts:

```bash
# Verify system components
python server/verify_system.py
```

## 📄 License
This project is licensed under the [MIT License](LICENSE).
