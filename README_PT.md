# DriveTube

<div align="center">
  <img src="frontend/assets/img/drivetube-logo.png" alt="DriveTube" width="220"/>

  <p>Interface amigável para visualização de vídeos e cursos armazenados no Google Drive.</p>

  <p>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Versão Node.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="Versão TypeScript" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.0+-000000?style=flat-square&logo=next.js&logoColor=white" alt="Versão Next.js" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="Versão MySQL" /></a>
  </p>

  <p>
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#tecnologias">Tecnologias</a> •
    <a href="#instalação">Instalação</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#sobre">Sobre</a>
  </p>
</div>

## ✨ Funcionalidades

*   **🔐 Autenticação Segura** - Login integrado com Google OAuth.
*   **📁 Organização Inteligente** - Listagem de vídeos organizados por pastas.
*   **🎥 Player Integrado** - Reprodução de vídeos diretamente na interface.
*   **📱 Design Responsivo** - Interface adaptável para todos os dispositivos.
*   **🌓 Tema Adaptativo** - Suporte a temas claro e escuro.
*   **💾 Cache Local** - Carregamento rápido de conteúdo já visualizado.
*   **👥 Multi-usuário** - Suporte para múltiplos usuários com isolamento de dados.
*   **💰 Planos e Assinaturas** - Sistema de planos com diferentes níveis de acesso.
*   **📋 Lista de Espera** - Sistema de lista de espera para novos usuários.
*   **💰 Pagamentos Crypto** - Processamento de pagamentos em USDT via TANOS.
*   **🛡️ Segurança Blockchain** - Trocas atômicas com tecnologia TANOS.

## 🛠️ Tecnologias

### Backend
*   **[Node.js](https://nodejs.org/)** - Ambiente de execução.
*   **[Fastify](https://www.fastify.io/)** - Framework web.
*   **[MySQL](https://www.mysql.com/)** - Banco de dados.
*   **[Prisma](https://www.prisma.io/)** - ORM para banco de dados.
*   **[JWT](https://jwt.io/)** - Autenticação.
*   **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação.
*   **[Zod](https://zod.dev/)** - Validação de dados.
*   **[TANOS](https://github.com/GustavoStingelin/tanos)** - Trocas atômicas Bitcoin/Nostr.

### Frontend
*   **[Next.js](https://nextjs.org/)** - Framework React.
*   **[React](https://reactjs.org/)** - Biblioteca UI.
*   **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS.
*   **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação.
*   **[NextAuth.js](https://next-auth.js.org/)** - Autenticação para Next.js.
*   **[Axios](https://axios-http.com/)** - Cliente HTTP.
*   **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado.

## 📋 Pré-requisitos

*   Node.js 18+
*   MySQL

## 🚀 Instalação

> **Nota:** Certifique-se de ter uma instância do MySQL em execução e as variáveis de ambiente necessárias configuradas antes de iniciar.

1.  **Clone o repositório:**
    bash
    git clone https://github.com/seu-usuario/drivetube.git
    cd drivetube
    

2.  **Instale as dependências:**
    bash
    npm install
    

3.  **Configuração do Ambiente:**
    *   Crie um arquivo `.env` no diretório raiz.
    *   Copie o conteúdo de `.env.example` e preencha com seus valores específicos (URL do banco de dados, credenciais do Google OAuth, segredos JWT, etc.).

4.  **Configuração do Banco de Dados:**
    bash
    npx prisma migrate dev
    

5.  **Servidor de Desenvolvimento:**
    bash
    npm run dev
    

## 🗺️ Roadmap

*   [x] Integração com Google Drive
*   [x] Streaming básico de vídeo
*   [x] Gateway de pagamento cripto (TANOS)
*   [ ] Análises aprimoradas para criadores de conteúdo
*   [ ] Aplicativo móvel (React Native)
*   [ ] Suporte a múltiplos idiomas

## 📂 Estrutura do Projeto

plaintext
drivetube/
├── backend/          # API Node.js/Fastify
├── frontend/         # Aplicação Next.js
├── docs/             # Documentação
└── prisma/           # Esquema do banco de dados


## 🤝 Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **grandemente apreciada**.

1.  Fork o Projeto
2.  Crie sua Branch de Funcionalidade (`git checkout -b feature/nova-feature`)
3.  Commit suas Alterações (`git commit -m 'Adiciona uma nova feature'`)
4.  Push para a Branch (`git push origin feature/nova-feature`)
5.  Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

## 📞 Contato

Seu Nome - [@seuhandle](https://twitter.com/seuhandle) - email@example.com

Link do Projeto: [https://github.com/seu-usuario/drivetube](https://github.com/seu-usuario/drivetube)
