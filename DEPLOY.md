# 🚀 Deployment Guide: WhatsApp Marketing Dashboard

This guide covers deploying the **Backend to Render** and **Frontend to Vercel**.

---

## 💸 Option 1: The Zero-Cost "Hackathon" Method (Recommended)
**Best for:** Submissions without a credit card.
**Cost:** $0.00 (No card required).

Since cloud providers often ask for credit cards to verify identity (even for free tiers), the safest way to submit is **running locally with a public link**.

### 1. Run the App Locally
You already have Docker set up!
```bash
docker-compose up -d
```
*   Frontend: `http://localhost:3000`
*   Backend: `http://localhost:8000`

### 2. Create Public Links (Optional)
If you need a URL to send to judges (e.g., `https://my-app.ngrok-free.app`), use **Ngrok** or **Localtunnel**:

1.  **Install Ngrok** (if not installed): `npm install -g ngrok`
2.  **Expose Backend**:
    ```bash
    ngrok http 8000
    # Copy the https://... URL (e.g., https://api-123.ngrok.io)
    ```
3.  **Update Frontend Config**:
    *   Stop Docker (`Ctrl+C`).
    *   Edit `docker-compose.yml`:
        ```yaml
        environment:
          - NEXT_PUBLIC_API_URL=https://<your-ngrok-backend-url>/api
        ```
    *   Restart: `docker-compose up -d --build`

---

## ☁️ Option 2: The "Hugging Face" Stack (Free Cloud)
**Best for:** Cloud hosting without a credit card.
**Cost:** $0.00.

### 1. Backend (Hugging Face Spaces)
1.  **Create Space**:
    *   Go to [huggingface.co/spaces](https://huggingface.co/spaces).
    *   Create New Space -> Name it `whatsapp-api`.
    *   **SDK**: Docker (Blank).
2.  **Deploy**:
    *   Hugging Face gives you a Git repo URL.
    *   Push your `server/` folder contents to the **root** of this new repo.
    *   (Or simpler: Connect your Github repo and set "Root Directory" to `server`).
3.  **Environment Variables**:
    *   Go to Settings -> "Variables and secrets".
    *   Add `MONGO_URI`, `JWT_SECRET`, etc.

### 2. Frontend (Vercel)
*Follow the standard Vercel instructions below, but point `NEXT_PUBLIC_API_URL` to your Hugging Face Space URL (e.g., `https://username-space-name.hf.space/api`).*

---

## 💳 Option 3: Standard Cloud (Render/Railway)
*Use this only if you want auto-deployments and have a payment card.*

## 🐍 Part 2: Backend Deployment (Render) - **Free Tier (Card Req)**
We will use Render's **Free Web Service** tier.

1.  **Push Code**: Ensure `render.yaml` is in your repo root.
2.  **Create Blueprint**:
    *   Go to [Render Dashboard](https://dashboard.render.com).
    *   Click **New +** -> **Blueprint**.
    *   Connect your repository.
3.  **Service Configuration**:
    *   It will detect `whatsapp-dashboard-api`.
    *   **CRITICAL**: When asked for the Plan, verify or select **"Free ($0/month)"**.
    *   Click **Apply**.
4.  **Environment Variables**:
    *   Go to the newly created Service -> **Environment**.
    *   Add the following (if not set in Blueprint wizard):
        *   `MONGO_URI`: Your MongoDB Atlas URI.
        *   `JWT_SECRET`: A long random string.
        *   `FRONTEND_URL`: `https://<your-vercel-project>.vercel.app` (You will update this *after* Part 3).
        *   `APP_ENV`: `production`.

✅ **Success Check:** Wait for the build to finish. The logs should say `Uvicorn running on http://0.0.0.0:10000`.

---

## ⚛️ Part 3: Frontend Deployment (Vercel) - **Free**
1.  **Import Project**:
    *   Go to [Vercel Dashboard](https://vercel.com/new).
    *   Import your `whatsapp-dashboard` repository.
    *   **Select Plan**: Choose **"Hobby" (Free Forever)**.
2.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Next.js (Default).
3.  **Environment Variables**:
    *   Expand "Environment Variables".
    *   Add `NEXT_PUBLIC_API_URL`.
    *   **Value:** Copy the URL from your active Render service (e.g., `https://whatsapp-dashboard-api.onrender.com`).
        *   *Important:* Do NOT include a trailing slash `/`.
4.  **Deploy**: Click **Deploy**.

---

## 🔄 Part 4: Final Wiring
1.  **Copy Vercel Domain**: Once Vercel deploys, copy the domain (e.g., `https://my-app.vercel.app`).
2.  **Update Backend**:
    *   Go back to **Render** -> Service -> Environment.
    *   Update `FRONTEND_URL` with your Vercel domain.
    *   Save Changes (Render will auto-deploy).
3.  **Final Verification**:
    *   Open your Vercel App.
    *   Register a new user.
    *   Check if you can login and create a contact.

---

## 🐳 Part 5: Docker Deployment (Self-Hosted)
For running the full stack locally or on a VPS (AWS/DigitalOcean) using Docker.

1.  **Prerequisites**: Ensure Docker & Docker Compose are installed.
2.  **Environment**: Ensure `.env` is created in `server/` as per the README.
3.  **Run**:
    ```bash
    docker-compose up -d --build
    ```
4.  **Access**:
    *   **Frontend**: `http://localhost:3000`
    *   **Backend**: `http://localhost:8000`

🎉 **Deployment Complete!**
