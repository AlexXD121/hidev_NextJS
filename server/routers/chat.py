from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import List, Optional
from models import Message, Contact, ChatSession, BaseSchema
import time
import asyncio

router = APIRouter(tags=["chat"])

class SentimentRequest(BaseSchema):
    text: str

class SentimentResponse(BaseSchema):
    sentiment: str

@router.get("/chats", response_model=List[ChatSession])
async def get_chats():
    # 1. Get all contacts
    contacts = await Contact.find_all().to_list()
    chat_sessions = []
    
    for contact in contacts:
        # 2. Find last message - Beanie sort
        last_msg = await Message.find(Message.chat_id == contact.id).sort(-Message.timestamp).first_or_none()
        
        unread = 0
        if last_msg and last_msg.sender_id == contact.id:
            unread = 1 
            
        chat_sessions.append(ChatSession(
            id=contact.id,
            contact_id=contact.id,
            contact=contact,
            last_message=last_msg,
            unread_count=unread,
            status="active"
        ))
        
    chat_sessions.sort(key=lambda x: x.last_message.timestamp if x.last_message else "", reverse=True)
    return chat_sessions

@router.get("/chats/{chat_id}/messages", response_model=List[Message])
async def get_messages(chat_id: str):
    messages = await Message.find(Message.chat_id == chat_id).sort(+Message.timestamp).to_list()
    return messages

async def delayed_reply_task(chat_id: str):
    """Async background task for MongoDB"""
    await asyncio.sleep(3) # Non-blocking sleep
    reply = Message(
        chat_id=chat_id,
        sender_id=chat_id,
        text="Thanks for the info! (Async Reply)",
        status="delivered",
        type="text",
        contact_id=chat_id
    )
    await reply.insert()

@router.post("/chats/{chat_id}/messages", response_model=Message)
async def send_message(
    chat_id: str, 
    message: Message, 
    background_tasks: BackgroundTasks
):
    message.chat_id = chat_id
    message.contact_id = chat_id
    
    await message.insert()
    
    if message.sender_id == "me":
        # Add coroutine to background tasks
        background_tasks.add_task(delayed_reply_task, chat_id)

    return message

@router.post("/ai/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    text = request.text.lower()
    sentiment = "neutral"
    if any(word in text for word in ["great", "awesome", "good", "love", "thanks"]):
        sentiment = "positive"
    elif any(word in text for word in ["bad", "hate", "angry", "worst", "stop"]):
        sentiment = "negative"
        
    return SentimentResponse(sentiment=sentiment)
