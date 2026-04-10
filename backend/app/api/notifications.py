from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import Dict
from pydantic import BaseModel

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Map user_id to their open WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()

        # When user connects, save phone line to dict
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected. Total online: {len(self.active_connections)}")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected")
    
    async def send_personal_notification(self, message: str, user_id: str):
        # Check if the user is currently online
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(message)

# Instantiate so it lives in servers memory
manager = ConnectionManager()

@router.websocket("/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    # Server "accepts the connection"
    await manager.connect(websocket, user_id)

    try:
        # Keep line open indefinitely
        while True:
            # Wait for client to say something
            data = await websocket.receive_text()

    except WebSocketDisconnect:
        # User closes tab
        print("Client hung up the phone")


class LikeEvent(BaseModel):
    target_user_id: str
    article_title: str

@router.post("/trigger-like")
async def trigger_like_notification(event: LikeEvent):
    # Save Like in db

    # Alert user IF online
    notification_message = f"Someone just liked your article: {event.article_title}!"

    await manager.send_personal_notification(
        message=notification_message,
        user_id=event.target_user_id
    )

    return {"status": "Like saved and notification sent (if online)"}