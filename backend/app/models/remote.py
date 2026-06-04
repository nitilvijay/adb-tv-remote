from pydantic import BaseModel, Field

class KeyRequest(BaseModel):
    keycode: int = Field(..., description="Android keyevent code")

class TextRequest(BaseModel):
    text: str = Field(..., description="Text to input on TV")

class SwipeRequest(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int
    duration: int = Field(300, ge=0)
