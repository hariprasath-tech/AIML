from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import logging
from backend.app.database import engine, Base, SessionLocal
from backend.app import models
from backend.app.routers import auth, analytics, stream, queue, inventory, settings, metrics

logger = logging.getLogger("main_app")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Powered Retail Intelligence Platform with Shopper Analytics, Inventory Visibility and Queue Management",
    description="Project No: 60 | Code: 25CS062 - Real-time ML Analytics Platform",
    version="1.0.0"
)

# Enable CORS for Vite dev server (http://localhost:5173 and http://127.0.0.1:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect analytics router to stream and settings
analytics.set_trackers_getter(
    lambda: stream.camera_trackers,
    lambda: settings.current_settings
)

settings.register_settings_listener(stream.update_global_settings)

# Include API Routers
app.include_router(auth.router)
app.include_router(analytics.router)
app.include_router(stream.router)
app.include_router(queue.router)
app.include_router(inventory.router)
app.include_router(settings.router)
app.include_router(metrics.router)

# WebSocket Connection Manager for live alert & state broadcasts
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Periodically broadcast live system state over websocket
            await asyncio.sleep(2)
            state = {
                "type": "heartbeat",
                "face_blur": settings.current_settings.get("face_blur_enabled", True),
                "timestamp": asyncio.get_event_loop().time()
            }
            await websocket.send_text(json.dumps(state))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "title": "AI-Powered Retail Intelligence Platform with Shopper Analytics, Inventory Visibility and Queue Management",
        "project_no": "60",
        "code": "25CS062"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
