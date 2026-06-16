from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

def map_vendor_model_to_response(v: models.Vendor) -> schemas.VendorResponse:
    return schemas.VendorResponse(
        id=v.id,
        name=v.name,
        emoji=v.emoji,
        role=v.role,
        avatarColor=schemas.AvatarColorSchema(bg=v.avatarColor_bg, text=v.avatarColor_text)
    )

@router.post("/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    vendor = db.query(models.Vendor).filter(models.Vendor.id == request.id).first()
    if not vendor:
        # For development ease, if logging in with a new ID, we can return success with a fallback vendor
        # or raise an exception. Let's raise 404 but try to look up in default list if database is empty.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
    
    # Check if there is an active shift for this vendor. If not, open one.
    active_shift = db.query(models.Shift).filter(
        models.Shift.vendorName == vendor.name,
        models.Shift.status == "open"
    ).order_by(models.Shift.openedAt.desc()).first()
    
    if not active_shift:
        # Parse numeric employee ID if possible
        emp_id = 1
        try:
            numeric_part = "".join(filter(str.isdigit, vendor.id))
            if numeric_part:
                emp_id = int(numeric_part)
        except Exception:
            pass
            
        active_shift = models.Shift(
            status="open",
            vendorName=vendor.name,
            empleado_id=emp_id,
            openedAt=datetime.utcnow()
        )
        db.add(active_shift)
        db.commit()
        db.refresh(active_shift)
        
    return schemas.LoginResponse(
        success=True,
        vendor=map_vendor_model_to_response(vendor)
    )

@router.post("/logout", response_model=schemas.LoginResponse)
def logout():
    return schemas.LoginResponse(
        success=True,
        vendor=None
    )
