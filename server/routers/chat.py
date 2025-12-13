from fastapi import APIRouter, BackgroundTasks
from typing import List
from pydantic import BaseModel
from models import Message, ChatSession, Contact
import asyncio
from datetime import datetime

router = APIRouter(tags=["chat"])

@router.get("/chats", response_model=List[ChatSession])
async def get_chats():
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
async def get_messages(chat_id: str):
    return await Message.find(Message.chat_id == chat_id).sort(+Message.timestamp).to_list()

async def simulate_reply(chat_id: str):
    """Wait 3s and send a reply"""
    await asyncio.sleep(3)
    reply = Message(
        chat_id=chat_id,
        sender_id=chat_id, # Reply comes FROM the contact
        text="That sounds interesting! Tell me more.",
        status="delivered",
        type="text",
        contact_id=chat_id
    )
    await reply.insert()
    print(f"Simulated reply sent to chat {chat_id}")

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
    # Create a message object compatible with our system
    from models import Message
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
