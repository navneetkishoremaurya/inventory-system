from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Check customer exists
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = 0
    order_items = []

    # Check every product in the order
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}. Available: {product.quantity}")

        total += product.price * item.quantity
        order_items.append((product, item.quantity))

    # Create the order
    new_order = models.Order(customer_id=order.customer_id, total_amount=total)
    db.add(new_order)
    db.flush()

    # Create order items and reduce stock
    for product, quantity in order_items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=quantity,
            unit_price=product.price
        )
        db.add(order_item)
        product.quantity -= quantity

    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()


@router.get("/{id}", response_model=schemas.OrderResponse)
def get_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Give stock back when order is cancelled
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
    return {"message": "Order cancelled successfully"}