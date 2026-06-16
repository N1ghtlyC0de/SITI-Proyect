from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/ventas",
    tags=["ventas"]
)

@router.get("", response_model=List[schemas.SaleResponse])
def get_sales(date: Optional[str] = None, vendedor: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Sale)
    if vendedor:
        query = query.filter(models.Sale.vendorName == vendedor)
        
        # Filter by active (open) shift for this vendor
        active_shift = db.query(models.Shift).filter(
            models.Shift.vendorName == vendedor,
            models.Shift.status == "open"
        ).order_by(models.Shift.openedAt.desc()).first()
        
        if active_shift:
            # Only return sales made after the shift was opened
            query = query.filter(models.Sale.time >= active_shift.openedAt)
        else:
            # If no active shift exists, return an empty list for this vendor
            return []
            
    if date:
        # func.date extracts the YYYY-MM-DD string part of the datetime column
        query = query.filter(func.date(models.Sale.time) == date)
    return query.order_by(models.Sale.time.desc()).all()

@router.get("/{sale_id}", response_model=schemas.SaleResponse)
def get_sale_detail(sale_id: str, db: Session = Depends(get_db)):
    sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale

@router.post("", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    db_sale = models.Sale(
        total=sale.total,
        itemCount=sale.itemCount,
        paymentMethod=sale.paymentMethod,
        status=sale.status,
        vendorName=sale.vendorName,
        amountReceived=sale.amountReceived,
        change=sale.change,
        transferApp=sale.transferApp
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)

    for item in sale.products:
        # Create sale item
        db_sale_item = models.SaleItem(
            sale_id=db_sale.id,
            product_id=item.product_id,
            name=item.name,
            quantity=item.quantity,
            price=item.price,
            emoji=item.emoji
        )
        db.add(db_sale_item)
        
        # Discount stock
        db_product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if db_product:
            db_product.stock = max(0, db_product.stock - item.quantity)
            if db_product.stock <= 5:
                db_product.status = "critical"
            elif db_product.stock <= 15:
                db_product.status = "warning"
            else:
                db_product.status = "good"
    
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.patch("/{sale_id}/cancelar", response_model=schemas.SaleResponse)
def cancel_sale(sale_id: str, db: Session = Depends(get_db)):
    db_sale = db.query(models.Sale).filter(models.Sale.id == sale_id).first()
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    if db_sale.status == "cancelled":
        return db_sale
        
    db_sale.status = "cancelled"
    
    # Return stock
    for item in db_sale.products:
        db_product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if db_product:
            db_product.stock = db_product.stock + item.quantity
            if db_product.stock <= 5:
                db_product.status = "critical"
            elif db_product.stock <= 15:
                db_product.status = "warning"
            else:
                db_product.status = "good"
                
    db.commit()
    db.refresh(db_sale)
    return db_sale
