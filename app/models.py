from sqlalchemy import Column, Date, DateTime, Float, Integer, String, func

from .database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    difficulty = Column(Integer, nullable=False)
    planned_minutes = Column(Integer, nullable=False, default=30)
    completed_minutes = Column(Integer, nullable=False, default=0)
    color = Column(String(30), nullable=False, default="blue")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    subject = Column(String(120), nullable=False)
    due_date = Column(Date, nullable=False)
    progress = Column(Float, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
