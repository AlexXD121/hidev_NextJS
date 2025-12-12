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
