from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/configuracion",
    tags=["configuracion"]
)

@router.get("/meta-diaria", response_model=schemas.DailyGoalResponse)
def get_meta_diaria(db: Session = Depends(get_db)):
    # Try to get existing goal
    goal_record = db.query(models.DailyGoal).first()
    if not goal_record:
        # Create a default goal if none exists
        goal_record = models.DailyGoal(goal=150000)
        db.add(goal_record)
        db.commit()
        db.refresh(goal_record)
    
    return schemas.DailyGoalResponse(goal=goal_record.goal)

@router.put("/meta-diaria", response_model=schemas.DailyGoalResponse)
def update_meta_diaria(goal_input: schemas.DailyGoalBase, db: Session = Depends(get_db)):
    goal_record = db.query(models.DailyGoal).first()
    if not goal_record:
        goal_record = models.DailyGoal(goal=goal_input.goal)
        db.add(goal_record)
    else:
        goal_record.goal = goal_input.goal
    
    db.commit()
    db.refresh(goal_record)
    return schemas.DailyGoalResponse(goal=goal_record.goal)
