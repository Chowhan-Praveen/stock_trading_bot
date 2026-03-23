from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get("/strategies")
def get_strategies():
    return []

@router.post("/strategies/{id}/activate")
def activate_strategy(id: str):
    return {"message": "Active"}

@router.post("/strategies/{id}/deactivate")
def deactivate_strategy(id: str):
    return {"message": "Inactive"}
