from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/publicaciones",
    tags=["publicaciones"]
)

def map_db_to_response(pub: models.Publicacion) -> schemas.PublicacionResponse:
    return schemas.PublicacionResponse(
        id=pub.id,
        title=pub.titulo,
        body=pub.descripcion,
        userId=1
    )

@router.get("", response_model=List[schemas.PublicacionResponse])
def get_publicaciones(
    _limit: Optional[int] = Query(10, alias="_limit"),
    limit: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    try:
        # Resolve limit parameter (support both _limit and limit)
        actual_limit = limit if limit is not None else _limit
        
        pubs = db.query(models.Publicacion).order_by(models.Publicacion.id.desc()).limit(actual_limit).all()
        return [map_db_to_response(p) for p in pubs]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database query failed: {str(e)}"
        )

@router.post("", response_model=schemas.PublicacionResponse, status_code=status.HTTP_201_CREATED)
def create_publicacion(payload: schemas.PublicacionCreate, db: Session = Depends(get_db)):
    try:
        db_pub = models.Publicacion(
            titulo=payload.title,
            descripcion=payload.body
        )
        db.add(db_pub)
        db.commit()
        db.refresh(db_pub)
        return map_db_to_response(db_pub)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database insertion failed: {str(e)}"
        )

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_publicacion(post_id: int, db: Session = Depends(get_db)):
    try:
        db_pub = db.query(models.Publicacion).filter(models.Publicacion.id == post_id).first()
        if not db_pub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Publicacion no encontrada"
            )
        db.delete(db_pub)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database deletion failed: {str(e)}"
        )
