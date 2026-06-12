from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/v1/dashboard-ventas",
    tags=["ventas"]
)

@router.get("/sales", response_model=List[schemas.SaleResponse])
def get_sales(db: Session = Depends(get_db)):
    return db.query(models.Sale).order_by(models.Sale.time.desc()).all()

@router.post("/sales", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    db_sale = models.Sale(
        total=sale.total,
        itemCount=sale.itemCount,
        paymentMethod=sale.paymentMethod,
        status=sale.status,
        vendorName=sale.vendorName,
        amountReceived=sale.amountReceived,
        change=sale.change
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    for product in sale.products:
        db_sale_item = models.SaleItem(
            sale_id=db_sale.id,
            product_id=product.product_id,
            name=product.name,
            quantity=product.quantity,
            price=product.price,
            emoji=product.emoji
        )
        db.add(db_sale_item)
    
    db.commit()
    db.refresh(db_sale)
    return db_sale
