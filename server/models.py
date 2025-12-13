from typing import Optional, List, Dict, Any
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from pydantic.alias_generators import to_camel
from datetime import datetime
from enum import Enum

# --- Enums ---

class UserRole(str, Enum):
    ADMIN = "admin"
    AGENT = "agent"
    MANAGER = "manager"

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    DOCUMENT = "document"
    TEMPLATE = "template"

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    COMPLETED = "completed"

class TemplateCategory(str, Enum):
    MARKETING = "marketing"
    UTILITY = "utility"

class TemplateStatus(str, Enum):
    APPROVED = "approved"
    PENDING = "pending"
    REJECTED = "rejected"

class TemplateLanguage(str, Enum):
    EN = "en"
    ES = "es"

# --- Shared Configuration ---

class BaseSchema(BaseModel):
    """
    Base configuration for Pydantic models (not Beanie Documents).
    Ensures CamelCase aliasing for JSON responses.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        # This ensures PydanticObjectId is serialized to string in JSON
        json_encoders={PydanticObjectId: str}
    )

# --- Beanie Documents (Database Models) ---

class User(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    email: EmailStr = Field(unique=True) # Indexed unique in Mongo
    password_hash: str
    role: UserRole = UserRole.AGENT
    avatar: Optional[str] = None # Matched to Frontend 'avatar'
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ... inside Campaign ...
class Contact(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    phone: str # valid index
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    tags: List[str] = []
    notes: Optional[str] = None
    last_active: datetime = Field(default_factory=datetime.utcnow)
    unread_count: int = 0
    
    class Settings:
        name = "contacts"
        indexes = [
            "phone",
            "name"
        ]

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        json_encoders={PydanticObjectId: str}
    )

class Template(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    category: TemplateCategory = TemplateCategory.MARKETING
    language: TemplateLanguage = TemplateLanguage.EN
    status: TemplateStatus = TemplateStatus.APPROVED
    content: str # Keep simple content for backward compat, or rely on components
    components: List[Dict[str, Any]] = [] # Flexible JSON structure

    class Settings:
        name = "templates"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        json_encoders={PydanticObjectId: str}
    )

class CampaignStats(BaseModel):
    sent: int = 0
    delivered: int = 0
    read: int = 0
    failed: int = 0

class Campaign(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    status: CampaignStatus = CampaignStatus.DRAFT
    scheduled_date: Optional[datetime] = None # Matched to Frontend 'scheduledDate'
    template_id: Optional[PydanticObjectId] = None 
    audience_ids: List[str] = [] 
    
    stats: CampaignStats = Field(default_factory=CampaignStats)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ... inside Message ...
class Message(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    chat_id: str 
    sender_id: str 
    text: str # Matched to Frontend 'text'
    type: MessageType = MessageType.TEXT
    media_url: Optional[str] = None
    status: MessageStatus = MessageStatus.SENT
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    contact_id: Optional[str] = None # Linking back to contact if needed

    class Settings:
        name = "messages"
        indexes = [
            "chat_id",
            "timestamp"
        ]

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        json_encoders={PydanticObjectId: str}
    )

class SheetImport(Document):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    name: str
    sheet_url: str
    sheet_id: str
    imported_at: datetime = Field(default_factory=datetime.utcnow)
    row_count: int = 0
    mapped_columns: Dict[str, str] = {} # e.g. {"phone": "Column A"}

    class Settings:
        name = "sheet_imports"

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        json_encoders={PydanticObjectId: str}
    )


# --- API Request/Response Models ---

# Note: These inherit from BaseSchema so they get camelCase aliasing.

class ChatSession(BaseSchema):
    id: str
    contact_id: str
    contact: Contact
    last_message: Optional[Message] = None
    unread_count: int = 0
    status: str = "active"

class LoginRequest(BaseSchema):
    email: EmailStr
    password: str

class AuthResponse(BaseSchema):
    user: User
    token: str

class RegisterRequest(BaseSchema):
    name: str
    email: EmailStr
    password: str

