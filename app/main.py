import os

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas
from .chatbot import generate_reply, random_quote
from .database import Base, engine, get_db
from .study_planner import distribute_minutes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Studiora API",
    version="1.0.0",
    description="Study planning, deadlines, timers, and Flora support.",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "healthy", "app": "Studiora"}


@app.get(
    "/api/subjects",
    response_model=list[schemas.SubjectResponse],
)
def list_subjects(db: Session = Depends(get_db)):
    return (
        db.query(models.Subject)
        .order_by(models.Subject.created_at.desc())
        .all()
    )


@app.post(
    "/api/subjects",
    response_model=schemas.SubjectResponse,
    status_code=201,
)
def create_subject(
    payload: schemas.SubjectCreate,
    db: Session = Depends(get_db),
):
    subject = models.Subject(**payload.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


@app.delete("/api/subjects/{subject_id}", status_code=204)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
):
    subject = db.get(models.Subject, subject_id)

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    db.delete(subject)
    db.commit()


@app.post(
    "/api/subjects/{subject_id}/complete",
    response_model=schemas.SubjectResponse,
)
def complete_session(
    subject_id: int,
    payload: schemas.CompleteSessionRequest,
    db: Session = Depends(get_db),
):
    subject = db.get(models.Subject, subject_id)

    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    subject.completed_minutes += payload.minutes
    db.commit()
    db.refresh(subject)
    return subject


@app.get(
    "/api/deadlines",
    response_model=list[schemas.DeadlineResponse],
)
def list_deadlines(db: Session = Depends(get_db)):
    return (
        db.query(models.Deadline)
        .order_by(models.Deadline.due_date.asc())
        .all()
    )


@app.post(
    "/api/deadlines",
    response_model=schemas.DeadlineResponse,
    status_code=201,
)
def create_deadline(
    payload: schemas.DeadlineCreate,
    db: Session = Depends(get_db),
):
    deadline = models.Deadline(**payload.model_dump())
    db.add(deadline)
    db.commit()
    db.refresh(deadline)
    return deadline


@app.delete("/api/deadlines/{deadline_id}", status_code=204)
def delete_deadline(
    deadline_id: int,
    db: Session = Depends(get_db),
):
    deadline = db.get(models.Deadline, deadline_id)

    if not deadline:
        raise HTTPException(status_code=404, detail="Deadline not found")

    db.delete(deadline)
    db.commit()


@app.post(
    "/api/planner/distribute",
    response_model=schemas.PlannerResponse,
)
def create_plan(payload: schemas.PlannerRequest):
    return distribute_minutes(payload)


@app.post(
    "/api/chat",
    response_model=schemas.ChatResponse,
)
def chat(payload: schemas.ChatRequest):
    return generate_reply(payload.message)


@app.get("/api/quotes/random", response_model=schemas.QuoteResponse)
def quote(
    kind: str = Query(
        default="banner",
        pattern="^(banner|completion)$",
    ),
):
    return {"quote": random_quote(kind)}
