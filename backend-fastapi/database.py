import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv(encoding="utf-8")

# Fallback to SQLite if no PostgreSQL URL is provided
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./siti_database.db")

# Connection arguments (UTF-8 encoding and thread check)
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {"client_encoding": "utf8"}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
