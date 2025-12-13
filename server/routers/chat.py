from fastapi import APIRouter, BackgroundTasks, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict
from pydantic import BaseModel
from models import Message, ChatSession, Contact, User
from dependencies import get_current_user
import asyncio
from datetime import datetime
import json

router = APIRouter(tags=["chat"])

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        # Allow multiple connections (e.g., multiple tabs)
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"🔌 Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"🔌 Client disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        """Send a message to all connected dashboard clients."""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error sending message: {e}")

manager = ConnectionManager()

# --- HTTP Endpoints ---

@router.get("/chats", response_model=List[ChatSession])
async def get_chats(current_user: User = Depends(get_current_user)):
    # 1. Get all contacts
    contacts = await Contact.find_all().to_list()
    sessions = []
    
    for contact in contacts:
        # 2. Get last message
        last_msg = await Message.find(Message.chat_id == str(contact.id)).sort(-Message.timestamp).first_or_none()
        
        unread = 0
        if last_msg and last_msg.sender_id == contact.id:
            unread = 1
            
        sessions.append(ChatSession(
            id=str(contact.id),
            contact_id=str(contact.id),
            contact=contact,
            last_message=last_msg,
            unread_count=unread,
            status="active"
        ))
        
    sessions.sort(key=lambda x: x.last_message.timestamp if x.last_message else datetime.min, reverse=True)
    return sessions

@router.get("/chats/{chat_id}/messages", response_model=List[Message])
async def get_messages(chat_id: str, current_user: User = Depends(get_current_user)):
    return await Message.find(Message.chat_id == chat_id).sort(+Message.timestamp).to_list()

# --- Background Tasks & Logic ---

async def simulate_reply(chat_id: str):
    """Wait 3s, save reply to DB, and Broadcast via WS"""
    await asyncio.sleep(3)
    
    # 1. Create the reply
    reply = Message(
        chat_id=chat_id,
        sender_id=chat_id, # Reply comes FROM the contact
        text="That sounds interesting! Tell me more.",
        status="delivered",
        type="text",
        contact_id=chat_id
    )
    
    # 2. Save to DB
    await reply.insert()
    print(f"Simulated reply sent to chat {chat_id}")

    # 3. Broadcast to WebSocket (Frontend updates instantly)
    # We must convert the Beanie model to a dict or JSON first
    # Pydantic v2 use model_dump(), be mindful of datetime serialization if needed
    # Fast approach: use json-compatible dict
    msg_dict = reply.model_dump()
    # Ensure ID and timestamps are strings/serializable if needed, but FastAPI jsonable_encoder handles it usually
    # For websockets we might need to be explicit if using send_json
    msg_dict["id"] = str(reply.id)
    msg_dict["timestamp"] = reply.timestamp.isoformat() if isinstance(reply.timestamp, datetime) else str(reply.timestamp)
    
    await manager.broadcast(msg_dict)

@router.post("/chats/{chat_id}/messages", response_model=Message)
async def send_message(chat_id: str, message: Message, background_tasks: BackgroundTasks):
    message.chat_id = chat_id
    message.contact_id = chat_id
    
    await message.insert()
    
    if message.sender_id == "me":
        # Trigger background reply
        background_tasks.add_task(simulate_reply, chat_id)
        
    return message

class SendMessageRequest(BaseModel):
    chat_id: str
    text: str

@router.post("/send")
async def send_message_alias(payload: SendMessageRequest, background_tasks: BackgroundTasks):
    """
    Alias endpoint for external or simple sending.
    """
    msg = Message(
        chat_id=payload.chat_id,
        sender_id="me",
        text=payload.text,
        status="sent",
        type="text",
        contact_id=payload.chat_id
    )
    
    await msg.insert()
    
    # Trigger background reply
    background_tasks.add_task(simulate_reply, payload.chat_id)
    
    return {"status": "Message Queued", "message_id": str(msg.id)}

# --- WebSocket Endpoint ---

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try:
        while True:
            # We can listed for incoming messages if we want bidirectional sending via WS too
            data = await websocket.receive_text()
            # echo or process? For now just keep connection alive.
            # Maybe handle "typing" events here later.
            print(f"WS Received from {client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
