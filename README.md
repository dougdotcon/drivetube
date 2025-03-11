<div align="center">
  <img src="extension/frontend/assets/img/mulakintola-logo.png" alt="Mulakintola" width="220"/>

  <h1>Mulakintola</h1>
  
  <p>Interface amigável para visualização de vídeos e cursos armazenados no Google Drive, com suporte a Proton Drive e integração com Telegram</p>

  <p>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js Version" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Version" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.0+-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js Version" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL Version" /></a>
  </p>

  <p>
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#tecnologias">Tecnologias</a> •
    <a href="#instalação">Instalação</a> •
    <a href="#desenvolvimento">Desenvolvimento</a> •
    <a href="#sobre-o-projeto">Sobre</a>
  </p>
</div>

## ✨ Funcionalidades

### 🎥 Vídeos e Mídia
- **Player Universal** - Reprodução de vídeos do Google Drive, Proton Drive e sistema local
- **Visualização Local** - Acesso e reprodução de vídeos armazenados no computador
- **Streaming Otimizado** - Carregamento adaptativo para melhor performance
- **Controles Avançados** - Velocidade, qualidade, legendas e marcadores
- **Formatos Suportados** - MP4, MKV, AVI, WebM e outros formatos populares
- **Miniaturas** - Geração automática de thumbnails para vídeos
- **Histórico** - Registro de vídeos assistidos e progresso

### 📁 Gerenciamento de Arquivos
- **Organização Inteligente** - Listagem organizada por pastas e categorias
- **Multi-plataforma** - Integração com Google Drive e Proton Drive
- **Explorador Local** - Acesso a arquivos do sistema com interface moderna
- **Busca Avançada** - Pesquisa em todas as fontes de arquivos
- **Favoritos** - Marcação de itens para acesso rápido

### 🔐 Segurança e Acesso
- **Autenticação Segura** - Login via Google OAuth
- **Permissões** - Controle granular de acesso a arquivos
- **Criptografia** - Suporte a arquivos criptografados do Proton Drive
- **Logs** - Registro de atividades e acessos

### 💻 Interface e Usabilidade
- **Design Responsivo** - Adaptação para todos os dispositivos
- **Tema Adaptativo** - Modos claro e escuro
- **Toast Notifications** - Sistema de feedback visual
- **Atalhos** - Controles de teclado para navegação rápida

### 🔄 Integração e Extensibilidade
- **Bot Telegram** - Notificações e controle remoto (Beta)
- **Extensão Chrome** - Acesso rápido via navegador
- **API Documentada** - Endpoints para integração externa

### ⚡ Performance
- **Cache Local** - Armazenamento inteligente de conteúdo
- **Lazy Loading** - Carregamento sob demanda
- **Compressão** - Otimização de transferência de dados

## 🛠️ Tecnologias

### Backend
- [Node.js](https://nodejs.org/) - Ambiente de execução
- [Fastify](https://www.fastify.io/) - Framework web
- [MySQL](https://www.mysql.com/) - Banco de dados
- [JWT](https://jwt.io/) - Autenticação
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação

### Frontend
- [Next.js](https://nextjs.org/) - Framework React
- [React](https://reactjs.org/) - Biblioteca UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [TypeScript](https://www.typescriptlang.org/) - Linguagem de programação
- [Lucide Icons](https://lucide.dev/) - Biblioteca de ícones
- [Shadcn/ui](https://ui.shadcn.com/) - Componentes UI

### Integrações
- [Google Drive API](https://developers.google.com/drive) - Armazenamento principal
- [Proton Drive](https://proton.me/drive) - Armazenamento secundário
- [Telegram Bot API](https://core.telegram.org/bots/api) - Notificações e controle
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/) - Extensão do navegador

## 📋 Requisitos

- Node.js 18+
- MySQL 8+
- Conta Google com acesso ao Drive
- Credenciais do Google Cloud Platform
- Conta Proton Drive (opcional)
- Bot do Telegram (opcional)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/mulakintola.git
cd mulakintola
```

2. **Configure o Backend**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Configure o Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
```

4. **Configure as Credenciais**

Edite os arquivos `.env` com suas configurações:

```env
# Backend
DATABASE_URL="mysql://user:password@localhost:3306/mulakintola"
JWT_SECRET="seu_jwt_secret"

# Frontend
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
NEXTAUTH_SECRET="seu_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Proton Drive (opcional)
NEXT_PUBLIC_PROTON_DRIVE_API_URL="https://api.proton.me/drive/v1"
NEXT_PUBLIC_PROTON_DRIVE_CLIENT_ID="seu_client_id"
NEXT_PUBLIC_PROTON_DRIVE_CLIENT_SECRET="seu_client_secret"

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN="seu_bot_token"
```

## 💻 Desenvolvimento

1. **Inicie o Backend**
```bash
cd backend
npm run dev
```

2. **Inicie o Frontend**
```bash
cd frontend
npm run dev
```

3. **Construa a Extensão**
```bash
cd extension
npm run build
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
mulakintola/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📂 controllers/
│   │   ├── 📂 database/
│   │   ├── 📂 routes/
│   │   ├── 📂 types/
│   │   └── 📄 server.ts
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📂 frontend/
│   ├── 📂 app/
│   │   ├── 📂 components/
│   │   ├── 📂 types/
│   │   └── 📄 page.tsx
│   ├── 📂 public/
│   └── 📄 package.json
│
└── 📂 extension/
    ├── 📂 frontend/
    │   ├── 📂 app/
    │   └── 📂 components/
    ├── 📄 manifest.json
    └── 📄 package.json
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 💡 Sobre o Projeto

O Mulakintola nasceu da necessidade de uma interface intuitiva para consumo de conteúdo educacional armazenado no Google Drive. Com a evolução do projeto, expandimos para suportar múltiplas plataformas de armazenamento e integração com serviços de mensagem.

### 🎯 Objetivos

- Facilitar a navegação entre módulos e aulas
- Oferecer experiência similar a plataformas de cursos online
- Manter a organização e segurança dos arquivos
- Proporcionar reprodução de vídeos sem necessidade de download
- Integrar múltiplas plataformas de armazenamento
- Fornecer notificações e controle via Telegram

### 🔧 Configurações Adicionais

#### Google Cloud Platform
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a Google Drive API
4. Configure as credenciais OAuth 2.0
5. Adicione as credenciais ao arquivo `.env`

#### Proton Drive
1. Crie uma conta no [Proton Drive](https://proton.me/drive)
2. Obtenha suas credenciais de API
3. Configure no arquivo `.env`

#### Telegram Bot
1. Converse com [@BotFather](https://t.me/botfather) no Telegram
2. Crie um novo bot e obtenha o token
3. Configure no arquivo `.env`

### 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Google Drive API](https://developers.google.com/drive/api)
- [Documentação Proton Drive](https://proton.me/business/drive)
- [Documentação Telegram Bot API](https://core.telegram.org/bots/api)
- [Guia de Contribuição](CONTRIBUTING.md)

---

<div align="center">
  <p>Desenvolvido com 💛 por <a href="https://github.com/asimov-tech-solutions">ASIMOV TECH</a></p>
  
  <a href="https://github.com/dougdotcon/mulakintola/issues">Reportar Bug</a>
  •
  <a href="https://github.com/dougdotcon/mulakintola/issues">Solicitar Feature</a>
</div>
