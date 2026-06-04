from fastapi import APIRouter, HTTPException
from app.models.remote import KeyRequest, TextRequest, SwipeRequest
from app.services.adb_service import adb_service

router = APIRouter(prefix="/remote", tags=["remote"])

@router.get("/status")
async def get_status():
    connected = adb_service.is_connected()
    return {"connected": connected}

@router.post("/connect")
async def connect_device():
    success = adb_service.connect()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to connect to device")
    return {"status": "connected"}

@router.post("/key")
async def send_key(request: KeyRequest):
    try:
        adb_service.send_key(request.keycode)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text")
async def send_text(request: TextRequest):
    try:
        adb_service.send_text(request.text)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/swipe")
async def send_swipe(request: SwipeRequest):
    try:
        adb_service.send_swipe(request.x1, request.y1, request.x2, request.y2, request.duration)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
