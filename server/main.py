from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, contacts, campaigns, chat
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await init_db()
    print("Startup: Connected to Database")
    yield
    # Shutdown
    print("Shutdown: Database connection closed")

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(contacts.router, prefix="/api")
app.include_router(campaigns.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "WhatsApp Dashboard API is running"}
