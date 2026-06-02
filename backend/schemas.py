from pydantic import BaseModel, EmailStr
from typing import List, Optional


# ─── Product Schemas ───────────────────────────────────────

class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    quantity: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


# ─── Customer Schemas ──────────────────────────────────────

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str

    class Config:
        from_attributes = True


# ─── Order Schemas ─────────────────────────────────────────

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True