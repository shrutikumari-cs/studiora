import os

os.environ["DATABASE_URL"] = "sqlite:///./test_studiora.db"

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_chat():
    response = client.post(
        "/api/chat",
        json={"message": "I feel stressed about my exam"},
    )

    assert response.status_code == 200
    assert response.json()["category"] in {"stress", "exam"}


def test_planner():
    response = client.post(
        "/api/planner/distribute",
        json={
            "available_minutes": 100,
            "subjects": [
                {
                    "subject_id": 1,
                    "name": "Math",
                    "difficulty": 8,
                },
                {
                    "subject_id": 2,
                    "name": "History",
                    "difficulty": 2,
                },
            ],
        },
    )

    assert response.status_code == 200

    plan = response.json()["plan"]

    assert sum(item["allocated_minutes"] for item in plan) == 100
    assert plan[0]["allocated_minutes"] > plan[1]["allocated_minutes"]
