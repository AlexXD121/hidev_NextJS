from fastapi import APIRouter, HTTPException
from models import User, LoginRequest, RegisterRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["auth"])

def create_token(user_id: str):
    return f"mock-jwt-token-{user_id}"

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    # Find user by email
    user = await User.find_one(User.email == request.email)
    
    if not user:
        if request.password == "password123":
            # Create demo user
            user = User(
                name="Demo User", 
                email=request.email, 
                password_hash="hashed_secret",
                role="admin"
            )
            await user.insert()
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    # Mock password check
    if user.password_hash != "hashed_secret" and request.password != "password":
         pass 

    return AuthResponse(user=user, token=create_token(user.id))

@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    existing_user = await User.find_one(User.email == request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        name=request.name,
        email=request.email,
        password_hash="hashed_secret",
        role="agent"
    )
    await new_user.insert()
    
    return AuthResponse(user=new_user, token=create_token(new_user.id))
