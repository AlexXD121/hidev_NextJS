from fastapi import APIRouter, HTTPException
from typing import List
from models import Contact

router = APIRouter(prefix="/contacts", tags=["contacts"])

@router.get("/", response_model=List[Contact])
async def get_contacts():
    return await Contact.find_all().to_list()

@router.post("/", response_model=Contact)
async def create_contact(contact: Contact):
    await contact.insert()
    return contact

@router.delete("/{contact_id}")
async def delete_contact(contact_id: str):
    contact = await Contact.get(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    await contact.delete()
    return {"ok": True}

@router.get("/tags", response_model=List[str])
async def get_tags():
    # Aggregation to find all unique tags
    # Since Beanie doesn't strictly support distinct() in all versions easily, 
    # we can fetch all or use a raw pipeline. 
    # For a prototype, fetching all and filtering in python is okay if data is small, 
    # but aggregation is better.
    
    # Simple list set approach for prototype:
    contacts = await Contact.find_all().to_list()
    all_tags = set()
    for c in contacts:
        for tag in c.tags:
            all_tags.add(tag)
    return list(all_tags)
