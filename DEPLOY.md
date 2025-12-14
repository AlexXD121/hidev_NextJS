# 🚀 Deployment Guide: WhatsApp Marketing Dashboard

This guide covers deploying the **Backend to Render** and **Frontend to Vercel**.

---

## 🏗️ Part 1: Prerequisites (Database)
1.  **MongoDB Atlas**:
    *   Go to **Network Access**.
    *   Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere).
    *   *Reason:* Render's IPs are dynamic; this ensures the backend can always connect.
2.  **Get Connection String**:
    *   Database -> Connect -> Drivers -> Python.
    *   Copy the URI (e.g., `mongodb+srv://<user>:<password>@cluster...`).

---

## 🐍 Part 2: Backend Deployment (Render)
We will use the included `server/render.yaml` Blueprint.

1.  **Push Code**: Ensure your latest code (including `server/render.yaml`) is pushed to GitHub/GitLab.
2.  **Create Blueprint**:
    *   Go to [Render Dashboard](https://dashboard.render.com).
    *   Click **New +** -> **Blueprint**.
    *   Connect your repository.
3.  **Service Configuration**:
    *   Render will detect `render.yaml` in the root.
    *   Click **Apply**.
4.  **Environment Variables**:
    *   Go to the newly created Service -> **Environment**.
    *   Add the following (if not set in Blueprint wizard):
        *   `MONGO_URI`: Your MongoDB Atlas URI.
        *   `JWT_SECRET`: A long random string (e.g., generate with `openssl rand -hex 32`).
        *   `FRONTEND_URL`: `https://<your-vercel-project>.vercel.app` (You will update this *after* Part 3).
        *   `APP_ENV`: `production`.

✅ **Success Check:** Wait for the build to finish. The logs should say `Uvicorn running on http://0.0.0.0:10000`.

---

## ⚛️ Part 3: Frontend Deployment (Vercel)
1.  **Import Project**:
    *   Go to [Vercel Dashboard](https://vercel.com/new).
    *   Import your `whatsapp-dashboard` repository.
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
