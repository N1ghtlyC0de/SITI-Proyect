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
    price = Column(Integer, default=0)
    emoji = Column(String, nullable=True)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(String, primary_key=True, default=generate_uuid)
    total = Column(Integer, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)
    itemCount = Column(Integer, default=0)
    paymentMethod = Column(String, nullable=False)
    status = Column(String, default="ok") # "ok" or "cancelled"
    vendorName = Column(String, nullable=True)
    amountReceived = Column(Integer, nullable=True)
    change = Column(Integer, nullable=True)
    transferApp = Column(String, nullable=True)

    products = relationship("SaleItem", back_populates="sale")

class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    sale_id = Column(String, ForeignKey("sales.id"), nullable=False)
    product_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Integer, nullable=False)
    emoji = Column(String, nullable=True)

    sale = relationship("Sale", back_populates="products")

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
    role = Column(String, nullable=False)
    avatarColor_bg = Column(String, nullable=False)
    avatarColor_text = Column(String, nullable=False)

class Shift(Base):
    __tablename__ = "shifts"

    id = Column(String, primary_key=True, default=generate_uuid)
    time = Column(DateTime, default=datetime.utcnow)
    vendorName = Column(String, nullable=True)
    total_expected = Column(Integer, nullable=True)
    total_physical = Column(Integer, nullable=True)
    difference = Column(Integer, nullable=True)
    status = Column(String, nullable=False) # "open", "closed", "match", "short", "over"
    openedAt = Column(DateTime, default=datetime.utcnow)
    closedAt = Column(DateTime, nullable=True)
    note = Column(String, nullable=True)
    date = Column(String, nullable=True)
    empleado_id = Column(Integer, nullable=True)
    horas_trabajadas = Column(Integer, nullable=True)
    franjas = Column(String, nullable=True) # Stored as comma-separated string, e.g. "1,2,3"

class DailyGoal(Base):
    __tablename__ = "daily_goals"

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(Integer, default=150000)

class Publicacion(Base):
    __tablename__ = "publicaciones"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)

