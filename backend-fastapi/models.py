from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    stock = Column(Integer, default=0)
    status = Column(String, default="good") # "good", "warning", "critical"
    image = Column(String, nullable=True)
    price = Column(Integer, default=0) # Storing financial values as Integer
    emoji = Column(String, nullable=True)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(String, primary_key=True, default=generate_uuid)
    total = Column(Integer, nullable=False) # raw integer for financial value
    time = Column(DateTime, default=datetime.utcnow)
    itemCount = Column(Integer, default=0)
    paymentMethod = Column(String, nullable=False)
    status = Column(String, default="ok") # "ok" or "cancelled"
    vendorName = Column(String, nullable=True)
    amountReceived = Column(Integer, nullable=True)
    change = Column(Integer, nullable=True)

    products = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    sale_id = Column(String, ForeignKey("sales.id"), nullable=False)
    product_id = Column(String, nullable=False) # We don't enforce strict FK to product_id if products get deleted, or we can.
    name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Integer, nullable=False)
    emoji = Column(String, nullable=True)

    sale = relationship("Sale", back_populates="products")

class CashboxValidation(Base):
    __tablename__ = "cashbox_validations"

    id = Column(String, primary_key=True, default=generate_uuid)
    time = Column(DateTime, default=datetime.utcnow)
    vendorName = Column(String, nullable=True)
    total_expected = Column(Integer, nullable=False)
    total_physical = Column(Integer, nullable=False)
    difference = Column(Integer, nullable=False)
    status = Column(String, nullable=False) # "match", "short", "over"
