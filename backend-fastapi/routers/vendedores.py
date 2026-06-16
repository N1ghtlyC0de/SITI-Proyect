from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/vendedores",
    tags=["vendedores"]
)

def map_vendor_model_to_response(v: models.Vendor) -> schemas.VendorResponse:
    return schemas.VendorResponse(
        id=v.id,
        name=v.name,
        emoji=v.emoji,
        role=v.role,
        avatarColor=schemas.AvatarColorSchema(bg=v.avatarColor_bg, text=v.avatarColor_text)
    )

@router.get("", response_model=List[schemas.VendorResponse])
def get_vendors(db: Session = Depends(get_db)):
    vendors = db.query(models.Vendor).all()
    return [map_vendor_model_to_response(v) for v in vendors]

@router.post("", response_model=schemas.VendorResponse)
def create_vendor(vendor: schemas.VendorCreate, db: Session = Depends(get_db)):
    db_vendor = models.Vendor(
        name=vendor.name,
        emoji=vendor.emoji,
        role=vendor.role,
        avatarColor_bg=vendor.avatarColor.bg,
        avatarColor_text=vendor.avatarColor.text
    )
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return map_vendor_model_to_response(db_vendor)

@router.put("/{vendor_id}", response_model=schemas.VendorResponse)
def update_vendor(vendor_id: str, vendor: schemas.VendorUpdate, db: Session = Depends(get_db)):
    db_vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    update_data = vendor.model_dump(exclude_unset=True)
    if "name" in update_data:
        db_vendor.name = update_data["name"]
    if "emoji" in update_data:
        db_vendor.emoji = update_data["emoji"]
    if "role" in update_data:
        db_vendor.role = update_data["role"]
    if "avatarColor" in update_data and update_data["avatarColor"] is not None:
        db_vendor.avatarColor_bg = update_data["avatarColor"]["bg"]
        db_vendor.avatarColor_text = update_data["avatarColor"]["text"]
        
    db.commit()
    db.refresh(db_vendor)
    return map_vendor_model_to_response(db_vendor)

@router.delete("/{vendor_id}")
def delete_vendor(vendor_id: str, db: Session = Depends(get_db)):
    db_vendor = db.query(models.Vendor).filter(models.Vendor.id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    db.delete(db_vendor)
    db.commit()
    return {"ok": True}
