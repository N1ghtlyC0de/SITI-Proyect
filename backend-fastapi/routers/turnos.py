from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/turnos",
    tags=["turnos"]
)

def map_shift_model_to_response(s: models.Shift) -> schemas.ShiftResponse:
    franjas_list = []
    if s.franjas:
        try:
            franjas_list = [int(x) for x in s.franjas.split(",") if x.strip()]
        except Exception:
            pass
    return schemas.ShiftResponse(
        id=s.id,
        time=s.time,
        status=s.status,
        vendorName=s.vendorName,
        total_expected=s.total_expected,
        total_physical=s.total_physical,
        difference=s.difference,
        openedAt=s.openedAt,
        closedAt=s.closedAt,
        note=s.note,
        date=s.date,
        empleado_id=s.empleado_id,
        horas_trabajadas=s.horas_trabajadas,
        franjas=franjas_list
    )

@router.get("", response_model=List[schemas.ShiftResponse])
def get_shifts(db: Session = Depends(get_db)):
    shifts = db.query(models.Shift).order_by(models.Shift.time.desc()).all()
    return [map_shift_model_to_response(s) for s in shifts]

@router.get("/por-fecha", response_model=List[schemas.ShiftResponse])
def get_shifts_by_date(fecha: str, db: Session = Depends(get_db)):
    # Match any shifts starting with the date string (e.g. YYYY-MM-DD)
    shifts = db.query(models.Shift).filter(
        models.Shift.empleado_id != None,
        models.Shift.date.like(f"{fecha}%")
    ).all()
    return [map_shift_model_to_response(s) for s in shifts]


@router.post("", response_model=schemas.ShiftResponse)
def open_shift(shift: schemas.ShiftCreate, db: Session = Depends(get_db)):
    franjas_str = ",".join(map(str, shift.franjas)) if shift.franjas else None
    
    db_shift = models.Shift(
        status=shift.status,
        vendorName=shift.vendorName,
        total_expected=shift.total_expected,
        total_physical=shift.total_physical,
        difference=shift.difference,
        note=shift.note,
        date=shift.date,
        empleado_id=shift.empleado_id,
        horas_trabajadas=shift.horas_trabajadas,
        franjas=franjas_str,
        openedAt=datetime.utcnow()
    )
    db.add(db_shift)
    db.commit()
    db.refresh(db_shift)
    return map_shift_model_to_response(db_shift)

@router.patch("/{shift_id}/cerrar", response_model=schemas.ShiftResponse)
def close_shift(shift_id: str, shift_data: schemas.ShiftCreate, db: Session = Depends(get_db)):
    # In development mode, if the frontend calls with "current", we can close the most recent open shift
    if shift_id == "current" or not shift_id:
        db_shift = db.query(models.Shift).filter(models.Shift.status == "open").order_by(models.Shift.time.desc()).first()
        # If no open shift exists, take the last shift
        if not db_shift:
            db_shift = db.query(models.Shift).order_by(models.Shift.time.desc()).first()
    else:
        db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
        
    if not db_shift:
        # If no shift is found, let's create a closed one instead of raising error, for dev robustness
        franjas_str = ",".join(map(str, shift_data.franjas)) if shift_data.franjas else None
        db_shift = models.Shift(
            status="closed" if shift_data.status == "open" else shift_data.status,
            vendorName=shift_data.vendorName,
            total_expected=shift_data.total_expected,
            total_physical=shift_data.total_physical,
            difference=shift_data.difference,
            note=shift_data.note,
            date=shift_data.date,
            empleado_id=shift_data.empleado_id,
            horas_trabajadas=shift_data.horas_trabajadas,
            franjas=franjas_str,
            openedAt=datetime.utcnow(),
            closedAt=datetime.utcnow()
        )
        db.add(db_shift)
        db.commit()
        db.refresh(db_shift)
        return map_shift_model_to_response(db_shift)

    # Update shift values
    db_shift.status = "closed" if shift_data.status == "open" else shift_data.status
    if shift_data.total_expected is not None:
        db_shift.total_expected = shift_data.total_expected
    if shift_data.total_physical is not None:
        db_shift.total_physical = shift_data.total_physical
    if shift_data.difference is not None:
        db_shift.difference = shift_data.difference
    if shift_data.note is not None:
        db_shift.note = shift_data.note
    if shift_data.date is not None:
        db_shift.date = shift_data.date
    if shift_data.empleado_id is not None:
        db_shift.empleado_id = shift_data.empleado_id
    if shift_data.horas_trabajadas is not None:
        db_shift.horas_trabajadas = shift_data.horas_trabajadas
    if shift_data.franjas is not None:
        db_shift.franjas = ",".join(map(str, shift_data.franjas))
        
    db_shift.closedAt = datetime.utcnow()
    db.commit()
    db.refresh(db_shift)
    return map_shift_model_to_response(db_shift)

@router.put("/{shift_id}", response_model=schemas.ShiftResponse)
def update_shift(shift_id: str, shift_data: schemas.ShiftCreate, db: Session = Depends(get_db)):
    db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if not db_shift:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
        
    db_shift.status = shift_data.status
    if shift_data.vendorName is not None:
        db_shift.vendorName = shift_data.vendorName
    if shift_data.total_expected is not None:
        db_shift.total_expected = shift_data.total_expected
    if shift_data.total_physical is not None:
        db_shift.total_physical = shift_data.total_physical
    if shift_data.difference is not None:
        db_shift.difference = shift_data.difference
    if shift_data.note is not None:
        db_shift.note = shift_data.note
    if shift_data.date is not None:
        db_shift.date = shift_data.date
    if shift_data.empleado_id is not None:
        db_shift.empleado_id = shift_data.empleado_id
    if shift_data.horas_trabajadas is not None:
        db_shift.horas_trabajadas = shift_data.horas_trabajadas
    if shift_data.franjas is not None:
        db_shift.franjas = ",".join(map(str, shift_data.franjas))
        
    db.commit()
    db.refresh(db_shift)
    return map_shift_model_to_response(db_shift)

@router.delete("/{shift_id}")
def delete_shift(shift_id: str, db: Session = Depends(get_db)):
    db_shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if not db_shift:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    db.delete(db_shift)
    db.commit()
    return {"ok": True}

