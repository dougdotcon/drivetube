# 🤖 Bot de Transferência Telegram → Google Drive

Este módulo implementa a funcionalidade de transferência de vídeos do Telegram para o Google Drive através de um bot do Telegram.

## 📋 Pré-requisitos

1. Token do Bot do Telegram (obtenha em [@BotFather](https://t.me/botfather))
2. Credenciais do Google Cloud com acesso à API do Drive
3. Python 3.8+
4. Dependências listadas em `requirements.txt`

## 🚀 Configuração

1. **Configuração do Bot do Telegram**
   ```bash
   # Fale com @BotFather no Telegram
   # Use o comando /newbot
   # Siga as instruções e guarde o token
   ```

2. **Configuração do Google Drive**
   - Acesse o [Google Cloud Console](https://console.cloud.google.com)
   - Crie um novo projeto
   - Ative a API do Google Drive
   - Crie credenciais OAuth 2.0
   - Baixe o arquivo JSON de credenciais

3. **Configuração do Ambiente**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env
   
   # Edite o arquivo .env com suas configurações
   nano .env
   ```

4. **Instalação de Dependências**
   ```bash
   pip install -r requirements.txt
   ```

## 💻 Uso

1. **Iniciar o Bot**
   ```bash
   python bot.py
   ```

2. **Iniciar a API**
   ```bash
   python api.py
   ```

## 🔄 Fluxo de Funcionamento

1. Usuário inicia conversa com bot no Telegram
2. Bot autentica usuário e solicita autorização do Google Drive
3. Usuário envia vídeo para o bot
4. Bot baixa o vídeo e faz upload para o Drive
5. Bot envia confirmação com link do vídeo no Drive

## 🛠️ Endpoints da API

- `GET /api/telegram/status`
  - Retorna status da conexão com Telegram
  - Resposta: `{ "connected": bool, "botUsername": string }`

- `POST /api/transfer/start`
  - Inicia processo de transferência
  - Body: `{ "chat_id": string, "message_id": number }`
  - Resposta: `{ "message": string }`

- `GET /api/transfer/status`
  - Retorna status atual da transferência
  - Resposta: `{ "status": string, "progress": number, "message": string }`

## ⚠️ Limitações

- Tamanho máximo de arquivo: 2GB
- Formatos suportados: Todos os formatos de vídeo aceitos pelo Telegram
- Tempo máximo de processamento: 30 minutos por vídeo

## 🔒 Segurança

- Autenticação via OAuth 2.0
- Verificação de permissões do usuário
- Limpeza automática de arquivos temporários
- Rate limiting para evitar abuso

## 🐛 Troubleshooting

1. **Erro de Autenticação**
   - Verifique as credenciais no arquivo `.env`
   - Certifique-se que as APIs estão ativas no Google Cloud

2. **Erro de Upload**
   - Verifique permissões da pasta no Drive
   - Confirme se há espaço suficiente na conta

3. **Bot Não Responde**
   - Verifique se o token está correto
   - Confirme se o bot está em execução

## 📚 Referências

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Drive API](https://developers.google.com/drive/api/v3/reference)
- [python-telegram-bot](https://python-telegram-bot.org/)
- [Google API Python Client](https://github.com/googleapis/google-api-python-client) 