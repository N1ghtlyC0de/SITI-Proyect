from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from .database import engine, Base, SessionLocal, get_db
from . import models
from .routers import auth, vendedores, inventario, dashboard_ventas, turnos, configuracion

# Create database tables
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    try:
        error_msg = str(e)
    except UnicodeDecodeError:
        error_msg = "Unicode decoding error (PostgreSQL connection failed with localized error in CP1252 encoding)"
    print(f"Warning: Database connection failed during table creation: {error_msg}")

def seed_db():
    db = SessionLocal()
    try:
        # Seed Vendors
        if db.query(models.Vendor).count() == 0:
            vendors = [
                models.Vendor(id="vendor-1", name="María López", emoji="👩", role="Vendedor", avatarColor_bg="#E8F5EE", avatarColor_text="#2F6B3E"),
                models.Vendor(id="vendor-2", name="Carlos Ruiz", emoji="👨", role="Vendedor", avatarColor_bg="#E3F2FD", avatarColor_text="#01579B"),
                models.Vendor(id="admin-1", name="Ana García", emoji="👩‍💼", role="Administrador", avatarColor_bg="#FFF3E0", avatarColor_text="#E65100")
            ]
            db.add_all(vendors)
            db.commit()
            
        # Seed Products
        if db.query(models.Product).count() == 0:
            products = [
                models.Product(id="1", name="Empanadas de carne", category="Comida", stock=45, status="good", image="https://images.unsplash.com/photo-1626200419307-e836ec413b52?auto=format&fit=crop&q=80&w=200&h=200", price=1500, emoji="🥟"),
                models.Product(id="2", name="Arepas de queso", category="Comida", stock=12, status="warning", image="https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&q=80&w=200&h=200", price=2500, emoji="🫓"),
                models.Product(id="3", name="Jugos naturales", category="Bebidas", stock=30, status="good", image="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=200&h=200", price=3000, emoji="🧃"),
                models.Product(id="4", name="Gaseosas", category="Bebidas", stock=5, status="critical", image="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200&h=200", price=2500, emoji="🥤"),
                models.Product(id="5", name="Chorizos", category="Comida", stock=25, status="good", image="https://images.unsplash.com/photo-1599818817290-77a7fceb5a6c?auto=format&fit=crop&q=80&w=200&h=200", price=4000, emoji="🌭")
            ]
            db.add_all(products)
            db.commit()
            
        # Seed Daily Goal
        if db.query(models.DailyGoal).count() == 0:
            goal = models.DailyGoal(goal=150000)
            db.add(goal)
            db.commit()
    except Exception as e:
        try:
            error_msg = str(e)
        except UnicodeDecodeError:
            error_msg = "Unicode decoding error (PostgreSQL connection failed with localized error in CP1252 encoding)"
        print(f"Error seeding database: {error_msg}")
    finally:
        db.close()

# Run database seed
seed_db()

app = FastAPI(title="SITI Backend API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all new routers strictly conforming to the official API Map
app.include_router(auth.router)
app.include_router(vendedores.router)
app.include_router(inventario.router)
app.include_router(dashboard_ventas.router) # /ventas prefix
app.include_router(turnos.router)
app.include_router(configuracion.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SITI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/health/db")
def health_db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Conectado exitosamente a PostgreSQL"}
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail={"status": "error", "message": str(e)}
        )
