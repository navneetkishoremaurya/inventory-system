from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import products, customers, orders

# Create all database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management System")

# This allows the React frontend to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "Inventory Management API is running!"}


@app.get("/dashboard")
def dashboard(db=None):
    from database import SessionLocal
    from sqlalchemy import func
    db = SessionLocal()
    total_products = db.query(models.Product).count()
    total_customers = db.query(models.Customer).count()
    total_orders = db.query(models.Order).count()
    low_stock = db.query(models.Product).filter(models.Product.quantity < 10).all()
    db.close()
    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": [
            {"id": p.id, "name": p.name, "quantity": p.quantity}
            for p in low_stock
        ]
    }