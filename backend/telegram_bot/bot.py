import os
import logging
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
import pickle
import io
import json

# Configuração de logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente
load_dotenv()
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN')
GOOGLE_CREDENTIALS_PATH = os.getenv('GOOGLE_CREDENTIALS_PATH')

# Escopos necessários para o Google Drive
SCOPES = ['https://www.googleapis.com/auth/drive.file']

class TelegramDriveBot:
    def __init__(self):
        self.credentials = None
        self.service = None
        self.initialize_drive_service()

    def initialize_drive_service(self):
        """Inicializa o serviço do Google Drive."""
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                self.credentials = pickle.load(token)

        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                self.credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    GOOGLE_CREDENTIALS_PATH, SCOPES)
                self.credentials = flow.run_local_server(port=0)

            with open('token.pickle', 'wb') as token:
                pickle.dump(self.credentials, token)

        self.service = build('drive', 'v3', credentials=self.credentials)

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Comando /start."""
        await update.message.reply_text(
            'Olá! Eu sou o bot de transferência Telegram -> Google Drive.\n'
            'Use /help para ver os comandos disponíveis.'
        )

    async def help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Comando /help."""
        help_text = """
        Comandos disponíveis:
        /start - Inicia o bot
        /help - Mostra esta mensagem de ajuda
        /auth - Autoriza acesso ao Google Drive
        /transfer - Inicia transferência de vídeo para o Drive
        """
        await update.message.reply_text(help_text)

    async def handle_video(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Manipula vídeos recebidos."""
        video = update.message.video
        if not video:
            await update.message.reply_text("Por favor, envie um vídeo.")
            return

        await update.message.reply_text("Recebendo vídeo... Por favor, aguarde.")

        # Download do vídeo do Telegram
        file = await context.bot.get_file(video.file_id)
        video_path = f"temp_{video.file_id}.mp4"
        await file.download_to_drive(video_path)

        try:
            # Upload para o Google Drive
            file_metadata = {
                'name': video.file_name or 'video.mp4',
                'mimeType': 'video/mp4'
            }
            
            media = MediaFileUpload(video_path, mimetype='video/mp4', resumable=True)
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id'
            ).execute()

            await update.message.reply_text(
                f"Vídeo transferido com sucesso!\n"
                f"ID no Drive: {file.get('id')}"
            )

        except Exception as e:
            logger.error(f"Erro ao fazer upload: {str(e)}")
            await update.message.reply_text(
                "Desculpe, ocorreu um erro ao transferir o vídeo."
            )

        finally:
            # Limpa arquivo temporário
            if os.path.exists(video_path):
                os.remove(video_path)

    def run(self):
        """Inicia o bot."""
        application = Application.builder().token(TELEGRAM_TOKEN).build()

        # Adiciona handlers
        application.add_handler(CommandHandler("start", self.start))
        application.add_handler(CommandHandler("help", self.help))
        application.add_handler(MessageHandler(filters.VIDEO, self.handle_video))

        # Inicia o bot
        application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    bot = TelegramDriveBot()
    bot.run() 