from typing import Optional, List
from beanie import Document
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime
import uuid

# Base config for CamelCase aliasing
class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

# --- Beanie Documents (Database Models) ---

class User(Document):
    # Beanie uses _id by default, but we can add our own ID field or use the default.
    # To keep it simple and match frontend 'id' string expectations:
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id") 
    name: str
    email: str = Field(unique=True) # Beanie handles uniqueness via indexes if configured
    password_hash: str
    role: str = "agent"
    avatar: str = "https://github.com/shadcn.png"

    class Settings:
        name = "users"
    
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class Contact(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    phone: str
    email: Optional[str] = None
    avatar: Optional[str] = None
    tags: List[str] = []
    last_active: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    class Settings:
        name = "contacts"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class Campaign(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    status: str = "draft"
    sent_count: int = 0
    delivered_count: int = 0
    read_count: int = 0
    total_contacts: int = 0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    template_name: Optional[str] = None
    template_id: Optional[str] = None
    goal: Optional[str] = None
    scheduled_date: Optional[str] = None

    class Settings:
        name = "campaigns"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

class Message(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    chat_id: str
    sender_id: str
    text: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    status: str = "sent"
    type: str = "text"
    media_url: Optional[str] = None
    contact_id: Optional[str] = None

    class Settings:
        name = "messages"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

# --- API Request/Response Models (Pydantic only) ---

class ChatSession(BaseSchema):
    id: str
    contact_id: str
    contact: Contact
    last_message: Optional[Message] = None
    unread_count: int = 0
    status: str = "active"

class LoginRequest(BaseSchema):
    email: str
    password: str

class AuthResponse(BaseSchema):
    user: User
    token: str

class RegisterRequest(BaseSchema):
    name: str
    email: str
    password: str

class Template(Document):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    content: str
    language: str = "en"
    status: str = "approved" # approved, pending, rejected
    category: str = "marketing"

    class Settings:
        name = "templates"
    
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True
    )

