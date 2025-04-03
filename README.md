# Mulakintola

Sistema de gerenciamento de vídeos do Google Drive que permite acessar e gerenciar seus vídeos de forma eficiente, com suporte a pagamentos e assinaturas.

## Funcionalidades

- 🔐 **Login Integrado** - Autenticação simplificada com sua conta Google
- 📁 **Navegação em Pastas** - Acesse suas pastas do Drive facilmente
- 🎥 **Player Otimizado** - Reproduza vídeos com controles avançados
- 🌓 **Tema Adaptativo** - Suporte aos temas claro e escuro
- 💾 **Cache Local** - Carregamento rápido de conteúdo já visualizado
- 💳 **Pagamentos** - Suporte a pagamentos com cartão (Stripe) e criptomoedas
- 📱 **Bot Telegram** - Integração com bot do Telegram para notificações
- 🔄 **Sincronização** - Sincronização automática com o Google Drive

## Tecnologias

### Backend
- Node.js com TypeScript
- Express.js para API REST
- Prisma ORM para banco de dados
- PostgreSQL como banco de dados principal
- JWT para autenticação
- Google Drive API para gerenciamento de arquivos
- Stripe para pagamentos com cartão
- Integração com criptomoedas
- Bot do Telegram para notificações

### Frontend
- Next.js 14 com TypeScript
- TailwindCSS para estilização
- Next-Auth para autenticação
- Radix UI para componentes acessíveis
- React Hook Form para formulários
- Zod para validação
- Axios para requisições HTTP

## Instalação

### Pré-requisitos
- Node.js 18 ou superior
- PostgreSQL 12 ou superior
- Docker (opcional)

### Backend
1. Entre na pasta `backend`:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Configure o banco de dados:
```bash
npm run db:setup
```

5. Inicie o servidor:
```bash
npm run dev
```

### Frontend
1. Entre na pasta `frontend`:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Configuração

### Google Cloud
1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com)
2. Ative as seguintes APIs:
   - Google Drive API
   - Google OAuth 2.0
3. Configure as credenciais OAuth 2.0:
   - Adicione as URIs de redirecionamento autorizadas
   - Copie o Client ID e Client Secret para o arquivo `.env`

### Stripe
1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha as chaves de API (Pública e Secreta)
3. Configure os produtos e preços no dashboard
4. Adicione as chaves no arquivo `.env`

### Bot do Telegram
1. Crie um bot através do [@BotFather](https://t.me/botfather)
2. Obtenha o token do bot
3. Adicione o token no arquivo `.env`

## Estrutura do Projeto

```
├── backend/                # Servidor Node.js
│   ├── src/               # Código fonte do backend
│   ├── prisma/            # Schemas e migrações do banco
│   └── telegram_bot/      # Código do bot do Telegram
│
├── frontend/              # Aplicação Next.js
│   ├── app/              # Páginas e rotas
│   ├── components/       # Componentes React
│   ├── services/        # Serviços e integrações
│   └── config/          # Configurações
│
└── docs/                 # Documentação adicional
```

## Desenvolvimento

### Backend
- Servidor roda na porta 3001 por padrão
- Hot reload ativado em desenvolvimento
- Logs detalhados em desenvolvimento
- Validação de tipos com TypeScript
- Testes com Jest

### Frontend
- Servidor roda na porta 3000 por padrão
- Hot reload e Fast Refresh ativos
- Otimização automática de imagens
- Suporte a PWA
- Temas claro e escuro

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature:
```bash
git checkout -b feature/nova-feature
```
3. Faça commit das alterações:
```bash
git commit -m 'feat: adiciona nova feature'
```
4. Faça push para a branch:
```bash
git push origin feature/nova-feature
```
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 