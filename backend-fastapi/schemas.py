from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# Products
class ProductBase(BaseModel):
    name: str
    category: str
    stock: int
    status: str
    image: Optional[str] = None
    price: int
    emoji: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    status: Optional[str] = None
    image: Optional[str] = None
    price: Optional[int] = None
    emoji: Optional[str] = None

class ProductResponse(ProductBase):
    id: str

    model_config = ConfigDict(from_attributes=True)

# Sales
class SaleItemBase(BaseModel):
    product_id: str
    name: str
    quantity: int
    price: int
    emoji: Optional[str] = None

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemResponse(SaleItemBase):
    id: str
    sale_id: str

    model_config = ConfigDict(from_attributes=True)

class SaleBase(BaseModel):
    total: int
    itemCount: int
    paymentMethod: str
    status: str = "ok"
    vendorName: Optional[str] = None
    amountReceived: Optional[int] = None
    change: Optional[int] = None
    transferApp: Optional[str] = None

class SaleCreate(SaleBase):
    products: List[SaleItemCreate]

class SaleResponse(SaleBase):
    id: str
    time: datetime
    products: List[SaleItemResponse]

    model_config = ConfigDict(from_attributes=True)

# Vendor Schemas
class AvatarColorSchema(BaseModel):
    bg: str
    text: str

class VendorBase(BaseModel):
    name: str
    emoji: str
    role: str
    avatarColor: AvatarColorSchema

class VendorCreate(VendorBase):
    pass

class VendorUpdate(BaseModel):
    name: Optional[str] = None
    emoji: Optional[str] = None
    role: Optional[str] = None
    avatarColor: Optional[AvatarColorSchema] = None

class VendorResponse(BaseModel):
    id: str
    name: str
    emoji: str
    role: str
    avatarColor: AvatarColorSchema

    model_config = ConfigDict(from_attributes=True)

# Shift Schemas
class ShiftBase(BaseModel):
    status: str
    vendorName: Optional[str] = None
    total_expected: Optional[int] = None
    total_physical: Optional[int] = None
    difference: Optional[int] = None
    openedAt: Optional[datetime] = None
    closedAt: Optional[datetime] = None
    note: Optional[str] = None
    date: Optional[str] = None
    empleado_id: Optional[int] = None
    horas_trabajadas: Optional[int] = None
    franjas: Optional[List[int]] = None

class ShiftCreate(BaseModel):
    status: str
    vendorName: Optional[str] = None
    total_expected: Optional[int] = None
    total_physical: Optional[int] = None
    difference: Optional[int] = None
    note: Optional[str] = None
    date: Optional[str] = None
    empleado_id: Optional[int] = None
    horas_trabajadas: Optional[int] = None
    franjas: Optional[List[int]] = None

class ShiftResponse(BaseModel):
    id: str
    time: datetime
    status: str
    vendorName: Optional[str] = None
    total_expected: Optional[int] = None
    total_physical: Optional[int] = None
    difference: Optional[int] = None
    openedAt: Optional[datetime] = None
    closedAt: Optional[datetime] = None
    note: Optional[str] = None
    date: Optional[str] = None
    empleado_id: Optional[int] = None
    horas_trabajadas: Optional[int] = None
    franjas: Optional[List[int]] = None

    model_config = ConfigDict(from_attributes=True)

# Configuration Schemas
class DailyGoalBase(BaseModel):
    goal: int

class DailyGoalResponse(DailyGoalBase):
    pass

    model_config = ConfigDict(from_attributes=True)

# Auth Schemas
class LoginRequest(BaseModel):
    id: str

class LoginResponse(BaseModel):
    success: bool
    vendor: Optional[VendorResponse] = None

# Publicaciones
class PublicacionCreate(BaseModel):
    title: str
    body: str
    userId: Optional[int] = 1

class PublicacionResponse(BaseModel):
    id: int
    title: str
    body: str
    userId: int = 1

    model_config = ConfigDict(from_attributes=True)

