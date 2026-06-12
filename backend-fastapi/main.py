from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import inventario, dashboard_ventas, cierre_caja

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SITI Backend API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventario.router)
app.include_router(dashboard_ventas.router)
app.include_router(cierre_caja.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SITI API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
