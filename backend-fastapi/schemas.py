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

# Cashbox Validation
class CashboxValidationBase(BaseModel):
    vendorName: Optional[str] = None
    total_expected: int
    total_physical: int
    difference: int
    status: str

class CashboxValidationCreate(CashboxValidationBase):
    pass

class CashboxValidationResponse(CashboxValidationBase):
    id: str
    time: datetime

    model_config = ConfigDict(from_attributes=True)
