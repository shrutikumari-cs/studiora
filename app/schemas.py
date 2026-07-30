from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Theme = Literal["pink", "blue", "white", "black", "green", "yellow"]


class SubjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    difficulty: int = Field(ge=1, le=10)
    planned_minutes: int = Field(ge=5, le=720)
    color: Theme = "blue"


class SubjectResponse(SubjectCreate):
    id: int
    completed_minutes: int

    model_config = ConfigDict(from_attributes=True)


class CompleteSessionRequest(BaseModel):
    minutes: int = Field(ge=1, le=720)


class DeadlineCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    subject: str = Field(min_length=1, max_length=120)
    due_date: date
    progress: float = Field(default=0, ge=0, le=100)


class DeadlineResponse(DeadlineCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class PlannerSubject(BaseModel):
    subject_id: int
    name: str
    difficulty: int = Field(ge=1, le=10)


class PlannerRequest(BaseModel):
    available_minutes: int = Field(ge=10, le=1440)
    subjects: list[PlannerSubject] = Field(min_length=1)


class PlannerItem(BaseModel):
    subject_id: int
    name: str
    difficulty: int
    allocated_minutes: int


class PlannerResponse(BaseModel):
    total_minutes: int
    plan: list[PlannerItem]
    message: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    category: str
    urgent: bool = False


class QuoteResponse(BaseModel):
    quote: str
