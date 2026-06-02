from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    new_customer = models.Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer


@router.get("/", response_model=list[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()


@router.get("/{id}", response_model=schemas.CustomerResponse)
def get_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.delete("/{id}")
def delete_customer(id: int, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}