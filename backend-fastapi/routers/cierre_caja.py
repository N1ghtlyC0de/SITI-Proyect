from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/v1/cierre-caja",
    tags=["cierre-caja"]
)

@router.get("/validations", response_model=List[schemas.CashboxValidationResponse])
def get_validations(db: Session = Depends(get_db)):
    return db.query(models.CashboxValidation).order_by(models.CashboxValidation.time.desc()).all()

@router.post("/validate", response_model=schemas.CashboxValidationResponse)
def create_validation(validation: schemas.CashboxValidationCreate, db: Session = Depends(get_db)):
    db_validation = models.CashboxValidation(**validation.model_dump())
    db.add(db_validation)
    db.commit()
    db.refresh(db_validation)
    return db_validation
