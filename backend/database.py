from sqlalchemy import create_engine, Column, Integer, Float, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime
import os
from contextlib import contextmanager

# Database URL from environment variable or default to SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./fraud_detection.db"
)

# Ensure data directory exists for SQLite
if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir:
        os.makedirs(db_dir, exist_ok=True)

# Create engine with appropriate settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


class Transaction(Base):
    """Transaction model for storing fraud detection results."""
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    merchant_category = Column(String, nullable=False)
    merchant_risk = Column(Float, nullable=False)
    country = Column(String, nullable=False)
    is_foreign = Column(Boolean, nullable=False)
    hour = Column(Integer, nullable=False)
    device_trust = Column(Float, nullable=False)
    previous_fraud = Column(Boolean, nullable=False)
    transaction_velocity = Column(Integer, nullable=False)

    fraud_probability = Column(Float, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


@contextmanager
def get_db():
    """Context manager for database sessions."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# Create tables
Base.metadata.create_all(bind=engine)