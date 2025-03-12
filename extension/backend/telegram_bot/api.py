from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
import json
import os
from bot import TelegramDriveBot

app = FastAPI()

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instância global do bot
bot = TelegramDriveBot()
transfer_status = {
    "status": "idle",
    "progress": 0,
    "message": ""
}

class TransferRequest(BaseModel):
    chat_id: str
    message_id: Optional[int] = None

@app.get("/api/telegram/status")
async def get_status():
    """Retorna status da conexão com Telegram."""
    try:
        return {
            "connected": bot.is_connected(),
            "botUsername": bot.get_bot_username()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transfer/start")
async def start_transfer(request: TransferRequest):
    """Inicia processo de transferência."""
    try:
        global transfer_status
        transfer_status = {
            "status": "downloading",
            "progress": 0,
            "message": "Iniciando download..."
        }

        # Inicia transferência em background
        asyncio.create_task(
            bot.transfer_video(
                request.chat_id,
                request.message_id,
                transfer_status
            )
        )

        return {"message": "Transferência iniciada"}
    except Exception as e:
        transfer_status = {
            "status": "error",
            "progress": 0,
            "message": str(e)
        }
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transfer/status")
async def get_transfer_status():
    """Retorna status atual da transferência."""
    return transfer_status

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3333) 