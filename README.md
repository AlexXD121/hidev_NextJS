# 🟢 WhatsApp Business Dashboard (Next.js 14 + FastAPI)

![Status](https://img.shields.io/badge/status-production--ready-success.svg?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)

A professional, high-performance SaaS dashboard designed for WhatsApp marketing and customer engagement. Built with a modern **Next.js 14** frontend and a robust **FastAPI** backend, this project demonstrates a full-stack implementation compliant with modern web standards.

---

## 🌟 Key Features

### 🏢 Dashboard & Analytics
- **Real-time Overview**: Stats cards for Contacts, Campaigns, and Messages.
- **Visual Charts**: Interactive charts powered by `recharts` to track engagement trends.
- **Recent Activity**: Activity feed tracking campaign launches and message events.

### 👥 Contact Management
- **CRUD Operations**: Complete Add, Edit, Delete workflows.
- **Advanced Filtering**: Search by name, phone, or tags.
- **Bulk Operations**: Select multiple contacts for bulk deletion or campaign targeting.
- **Responsive Tables**: Optimized data grids that adapt to mobile and desktop screens.

### 💬 Live Chat System
- **Real-Time Messaging**: WebSocket-powered chat interface (`server/routers/chat.py`).
- **Responsive Layout**: "Stack-and-slide" mobile navigation (WhatsApp Web style).
- **Message Status**: UI indicators for Sent, Delivered, and Read statuses.
- **Emoji Support**: Integrated emoji picker for rich communication.

### 📢 Campaign Management
- **Campaign Wizard**: Step-by-step creation flow for marketing broadcasts.
- **Scheduling**: Set launch times for future campaigns.
- **Google Sheets Integration**: Import contacts directly from Sheets (Mock/Prototype).

### ⚙️ Settings & User Profile
- **Profile Management**: Update user details and preferences.
- **Security**: JWT-based authentication with secure password hashing.
- **Theme Support**: Fully integrated Dark Mode matching WhatsApp's native palette.

---

## 🛠️ Tech Stack

### Client (Frontend)
| Technology | Usage |
| :--- | :--- |
| **Next.js 14** | App Router, Server Components, Server Actions |
| **TypeScript** | Strict type safety across the entire codebase |
| **Tailwind CSS** | Utility-first styling with responsive design |
| **Shadcn UI** | High-quality accessible components (Radix UI based) |
| **Zustand** | Lightweight global state management |
| **Zod + React Hook Form** | Robust form validation and handling |
| **Framer Motion** | Smooth animations and transitions |

### Server (Backend)
| Technology | Usage |
| :--- | :--- |
| **FastAPI** | High-performance async Python web framework |
| **MongoDB Atlas** | NoSQL database for flexible data modeling |
| **Beanie (Motor)** | Asynchronous ODM for MongoDB |
| **Pydantic v2** | Data validation and serialization |
| **PyJWT** | Secure token-based authentication |
| **WebSockets** | Real-time bi-directional communication |

---

## ⚖️ Judge's Guide (Hackathon Context)

**Why this project stands out:**

1.  **Full-Stack Realism**: Not just a UI shell. It has a complete FastAPI backend with MongoDB, JWT Auth, and WebSockets.
2.  **Complex State Management**: Uses `zustand` for global auth/chat state and `react-query` for server state sync.
3.  **Real-Time Architecture**: Chat isn't polling; it's a live WebSocket connection handling multi-room events.
4.  **Professional UI/UX**: Implements a "pixel-perfect" WhatsApp-style interface with responsive mobile adaptations.

**Key Files to Review:**
- **Frontend Architecture**: `client/src/app/(dashboard)/layout.tsx` (Dashboard Wrap), `client/src/store/useChatStore.ts` (WebSocket Logic).
- **Backend Logic**: `server/routers/chat.py` (WS Manager), `server/main.py` (App Factory).
- **Security**: `server/routers/auth.py` (JWT Implementation).

---

## 📖 User Manual

### 1. Dashboard Overview
- **Metrics**: See instantaneous counts of your Active Campaigns and Contacts.
- **Activity Feed**: Live log of system events.

### 2. Managing Contacts
1.  Navigate to the **Contacts** tab.
2.  **Add**: Click "Add Contact", fill in details.
3.  **Edit/Delete**: Use the actions menu (...) on any contact row.
4.  **Bulk Actions**: Select multiple contacts to delete them in one go.

### 3. Launching Campaigns
1.  Go to **Campaigns** -> **Create Campaign**.
2.  **Step 1**: Name your campaign.
3.  **Step 2**: Select message template (or write custom text).
4.  **Step 3**: Select audience (All contacts or specific tags).
5.  **Step 4**: Schedule or Send Now.

### 4. Interactive Chat
- Real-time messaging with any contact.
- Supports Emoji picker and message status indicators (Sent/Delivered).
- **Mobile Users**: Swipe or tap "Back" to return to the contact list.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.11+
- **MongoDB**: Atlas Cluster or Local Instance

### 1. Backend Setup (`/server`)

```bash
cd server

# Create virtual environment
python -m venv venv
# Activate: 
#   Windows: .\venv\Scripts\activate
#   Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# (See Environment Variables section below)
```

**Run the Server:**
```bash
python -m uvicorn main:app --reload
# API runs at: http://localhost:8000
# Swagger Docs: http://localhost:8000/docs
```

### 2. Frontend Setup (`/client`)

```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev
# App runs at: http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory:

```ini
APP_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/whatsapp_dashboard
JWT_SECRET=your_super_secret_key_change_this_in_prod
FRONTEND_URL=http://localhost:3000
```

---

## 📂 Project Structure

```
├── client/                 # Next.js Frontend
│   ├── src/app             # App Router Pages
│   ├── src/components      # Reusable UI Components
│   ├── src/lib             # API Clients & Utils
│   ├── src/store           # Zustand Stores
│   └── public/             # Static Assets (Icons, Images)
│
├── server/                 # FastAPI Backend
│   ├── routers/            # API Endpoints (Auth, Chat, etc.)
│   ├── models.py           # Database Schemas (Beanie)
│   ├── database.py         # DB Connection Logic
│   ├── verify_*.py         # System Verification Scripts
│   └── main.py             # App Entry Point
│
└── README.md               # Documentation
```

---

## ✅ Verification & Testing

This project includes a suite of verification scripts to ensure system integrity.

**Run All Backend Tests:**
```bash
python server/verify_db_backend.py
```
*Checks: DB Connection, User Auth, Contact CRUD, Error Handling.*

**Run Integration Test:**
```bash
python server/verify_integration.py
```
*Checks: Full frontend-to-backend data flow simulation.*

---

## 🎨 UI & Design System

The application strictly adheres to the **WhatsApp Business** visual identity:
- **Primary Teal**: `#008069` (Light) / `#00A884` (Dark)
- **Backgrounds**: Carefully matched grey/blue tones for reduced eye strain.
- **Responsiveness**: Mobile-first architecture using Tailwind's `md:` and `lg:` breakpoints.

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

