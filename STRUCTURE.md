# 📂 Project Structure & Architecture

This document outlines the organization of the **WhatsApp Business Dashboard**, explaining the role of each key directory and file.

## 🏗️ High-Level Overview

The project is a **Monorepo** containing two distinct applications:

1.  **`/client`**: The Frontend application (Next.js 14).
2.  **`/server`**: The Backend API service (FastAPI).

```bash
root/
├── client/                 # Frontend Application
├── server/                 # Backend Application
├── DEPLOY.md               # Deployment Guide
├── README.md               # Main Documentation
└── STRUCTURE.md            # You are here
```

---

## 🖥️ Client (Frontend)

Located in `client/`, this is a **Next.js 14** application using the **App Router**.

### Key Directories

| Path | Description |
| :--- | :--- |
| **`src/app/`** | **Routes & Pages**. Uses file-system routing (e.g., `(dashboard)/page.tsx` is the home page). |
| **`src/components/`** | **UI Components**. Ordered by feature (e.g., `chat/`, `contacts/`) and generic usage (`ui/` for Shadcn). |
| **`src/lib/`** | **Utilities**. Contains `api/` (Axios client), `utils.ts` (Tailwind helper), and other helpers. |
| **`src/store/`** | **State Management**. Global Zustand stores like `useChatStore.ts` and `useAuthStore.ts`. |
| **`public/`** | **Static Assets**. Images, icons, and the `manifest.json` for PWA support. |

### Key Files
*   `middleware.ts`: Handles route protection (redirecting unauthenticated users).
*   `tailwind.config.ts`: Configuration for the design system (colors, fonts).
*   `next.config.ts`: Next.js build configuration.

---

## ⚙️ Server (Backend)

Located in `server/`, this is a **FastAPI** application serving the REST API and WebSockets.

### Key Directories

| Path | Description |
| :--- | :--- |
| **`routers/`** | **API Endpoints**. Split by domain (e.g., `auth.py`, `chat.py`, `contacts.py`). |
| **`tests/`** | *(If present)* Unit tests for the backend logic. |

### Key Files
*   **`main.py`**: **Entry Point**. Configures the App, CORS, and includes all routers.
*   **`database.py`**: **DB Layer**. Handles MongoDB connection and Beanie initialization.
*   **`models.py`**: **Schemas**. Pydantic models and Beanie documents defining data structure.
*   **`verify_*.py`**: **Verification Scripts**. Custom tools to test system integrity (`verify_db_backend.py`, etc.).
*   **`requirements.txt`**: List of Python dependencies.

---

## 🛡️ Security & Configuration

*   **`.gitignore`**: Ensures strict exclusion of secrets (`.env`, `venv/`, `node_modules/`).
*   **`.env`**: Stores sensitive credentials (API Keys, DB URIs). **Never committed.**

## 🔄 Data Flow

1.  **User Action**: Clicks "Login" on Frontend.
2.  **Client**: `src/lib/api/axios-client.ts` sends POST to Backend.
3.  **Server**: `routers/auth.py` validates credentials -> `main.py` handles request.
4.  **Database**: `database.py` connects to MongoDB to verify user.
5.  **Response**: Server returns JWT -> Client stores in `useAuthStore`.

This structure ensures separation of concerns, scalability, and maintainability.
