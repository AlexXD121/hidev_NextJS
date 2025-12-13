from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from models import Template, User
from dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/templates", tags=["templates"])

class TemplateCreate(BaseModel):
    name: str
    content: str
    language: str = "en"
    category: str = "marketing"

@router.get("/", response_model=List[Template])
async def get_templates(current_user: User = Depends(get_current_user)):
    templates = await Template.find_all().to_list()
    if not templates:
        # Seed mocking data
        mock_templates = [
            Template(name="Welcome", content="Hello {{name}}, welcome to our service!", category="marketing"),
            Template(name="Discount", content="Get 50% off with code SAVE50", category="marketing"),
            Template(name="Reminder", content="Hi, just a reminder about your appointment.", category="utility")
        ]
        for t in mock_templates:
            await t.insert()
        templates = mock_templates
    return templates

@router.post("/", response_model=Template, status_code=status.HTTP_201_CREATED)
async def create_template(template: TemplateCreate, current_user: User = Depends(get_current_user)):
    new_template = Template(
        name=template.name,
        content=template.content,
        language=template.language,
        category=template.category,
        status="approved" # Auto-approve for now
    )
    await new_template.insert()
    return new_template

@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: str, current_user: User = Depends(get_current_user)):
    template = await Template.get(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    await template.delete()
