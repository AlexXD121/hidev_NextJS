from fastapi import APIRouter, HTTPException, Depends
from models import User, LoginRequest, RegisterRequest, AuthResponse
# from passlib.context import CryptContext # Removing problematic lib
import bcrypt
import jwt
import datetime
import os

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-123")
ALGORITHM = "HS256"

def verify_password(plain_password, hashed_password):
    # Handle legacy/demo passwords separately if needed, but for now strict check
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        print(f"Bcrypt verify error: {e}")
        return False

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=60*24) # 1 day
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    print(f"👉 Login: {request.email}")
    
    user = await User.find_one(User.email == request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Legacy fallbacks (optional)
    if user.password_hash == "hashed_secret":
        if request.password in ["password", "password123"]:
            # Migrate to bcrypt if we wanted, for now just allow
            pass
        else:
             raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    
    return AuthResponse(user=user, token=token)

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    print(f"👉 Register: {request.email}")
    
    existing_user = await User.find_one(User.email == request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(request.password)
    
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash=hashed_password,
        role="agent"
    )
    await new_user.insert()
    
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    
    return AuthResponse(user=new_user, token=token)
