import json
import random
import re
from functools import lru_cache
from pathlib import Path

DATA_PATH = Path(__file__).parent / "data" / "flora_knowledge.json"


@lru_cache
def load_knowledge() -> dict:
    with DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def keyword_score(message: str, keywords: list[str]) -> int:
    return sum(
        len(keyword.split())
        for keyword in keywords
        if keyword in message
    )


def generate_reply(message: str) -> dict:
    knowledge = load_knowledge()
    normalized = normalize(message)

    crisis_keywords = knowledge["crisis"]["keywords"]

    if any(keyword in normalized for keyword in crisis_keywords):
        return {
            "reply": knowledge["crisis"]["response"],
            "category": "crisis",
            "urgent": True,
        }

    categories = [
        "motivation",
        "stress",
        "anxiety",
        "sadness",
        "focus",
        "exam",
        "greeting",
    ]

    scored_categories = [
        (
            category,
            keyword_score(
                normalized,
                knowledge[category]["keywords"],
            ),
        )
        for category in categories
    ]

    category, score = max(scored_categories, key=lambda item: item[1])

    if score == 0:
        category = "fallback"

    return {
        "reply": random.choice(knowledge[category]["responses"]),
        "category": category,
        "urgent": False,
    }


def random_quote(kind: str) -> str:
    knowledge = load_knowledge()
    key = (
        "completion_quotes"
        if kind == "completion"
        else "banner_quotes"
    )
    return random.choice(knowledge[key])
