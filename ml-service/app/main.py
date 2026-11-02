from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="Tour Recommender ML Service")

# Demo ratings matrix; replace with DB-driven matrix in production.
ratings_df = pd.DataFrame(
    [
        ("u1", "Goa", 5),
        ("u1", "Manali", 4),
        ("u1", "Jaipur", 3),
        ("u2", "Goa", 4),
        ("u2", "Manali", 5),
        ("u2", "Munnar", 4),
        ("u3", "Jaipur", 5),
        ("u3", "Munnar", 4),
        ("u3", "Goa", 3),
    ],
    columns=["user_id", "destination", "rating"],
)


class RecommendInput(BaseModel):
    user_id: str


class TripPlannerInput(BaseModel):
    budget: int
    days: int
    tripType: str
    city: str


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/recommend")
def recommend(inp: RecommendInput):
    matrix = ratings_df.pivot_table(index="user_id", columns="destination", values="rating").fillna(0)
    if inp.user_id not in matrix.index:
        fallback = ratings_df.groupby("destination")["rating"].mean().sort_values(ascending=False).head(5)
        return {
            "strategy": "popular-fallback",
            "recommendations": [{"name": k, "score": float(v)} for k, v in fallback.items()],
        }

    user_sim = cosine_similarity(matrix)
    sim_df = pd.DataFrame(user_sim, index=matrix.index, columns=matrix.index)
    neighbors = sim_df[inp.user_id].sort_values(ascending=False).iloc[1:3].index
    neighbor_ratings = matrix.loc[neighbors].mean().sort_values(ascending=False).head(6)
    seen = set(ratings_df[ratings_df["user_id"] == inp.user_id]["destination"].tolist())
    recs = [
        {"name": dest, "score": float(score)}
        for dest, score in neighbor_ratings.items()
        if dest not in seen
    ][:5]
    return {"strategy": "user-user-collaborative-filtering", "recommendations": recs}


@app.post("/trip-plan")
def trip_plan(inp: TripPlannerInput):
    per_day = int(inp.budget / max(inp.days, 1))
    itinerary = []
    for day in range(1, inp.days + 1):
        itinerary.append(
            {
                "day": day,
                "title": f"{inp.tripType} Day {day}",
                "notes": f"Start from {inp.city}, explore local highlights and curated food spots.",
            }
        )
    return {
        "estimated_cost": inp.budget,
        "per_day_budget": per_day,
        "itinerary": itinerary,
    }
