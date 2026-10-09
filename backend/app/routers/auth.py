from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app import models

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Standard admin credentials
    if req.username == "admin" and req.password == "admin123":
        return {
            "access_token": "demo-jwt-token-25cs062",
            "token_type": "bearer",
            "user": {
                "username": "admin",
                "full_name": "Store Operations Manager",
                "role": "admin"
            }
        }
    
    # Check DB user fallback
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if user and user.password_hash == req.password:
        return {
            "access_token": f"token-{user.id}",
            "token_type": "bearer",
            "user": {
                "username": user.username,
                "full_name": user.full_name or user.username,
                "role": user.role
            }
        }

    raise HTTPException(status_code=401, detail="Invalid username or password")

@router.get("/me")
def get_me():
    return {
        "username": "admin",
        "full_name": "Store Operations Manager",
        "role": "admin"
    }
