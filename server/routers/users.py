from fastapi import APIRouter, Depends, HTTPException
from models import User
from dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

class UserUpdate(BaseModel):
    name: str = None
    email: str = None
    # avatar_url: str = None # Optional usually

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=User)
async def update_user_me(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.email:
        # Check uniqueness if email changes
        if user_update.email != current_user.email:
            existing = await User.find_one(User.email == user_update.email)
            if existing:
                raise HTTPException(status_code=400, detail="Email already taken")
            current_user.email = user_update.email
            
    await current_user.save()
    return current_user
