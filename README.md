# DriveTube

<div align="center">
  <img src="frontend/assets/img/drivetube-logo.png" alt="DriveTube" width="220"/>

  <p>A secure and friendly interface for viewing videos and courses stored on Google Drive.</p>

  <p>
    <a href="https://nodejs.org/en/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js Version" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript Version" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.0+-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js Version" /></a>
    <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL Version" /></a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#roadmap">Roadmap</a> •
    <a href="#about">About</a>
  </p>
</div>

## ✨ Features

*   **🔐 Secure Authentication** - Login integration with Google OAuth.
*   **📁 Intelligent Organization** - Video listing organized by folders.
*   **🎥 Integrated Player** - Video playback directly within the interface.
*   **📱 Responsive Design** - Interface adapted for all devices.
*   **🌓 Adaptive Theme** - Support for light and dark modes.
*   **💾 Local Cache** - Fast loading of previously viewed content.
*   **👥 Multi-user Support** - Support for multiple users with data isolation.
*   **💰 Plans & Subscriptions** - Subscription system with different access levels.
*   **📋 Waitlist System** - Queue management for new users.
*   **💰 Crypto Payments** - USDT payment processing via TANOS.
*   **🛡️ Blockchain Security** - Atomic swaps using TANOS technology.

## 🛠️ Tech Stack

### Backend
*   **[Node.js](https://nodejs.org/)** - Runtime environment.
*   **[Fastify](https://www.fastify.io/)** - Web framework.
*   **[MySQL](https://www.mysql.com/)** - Database.
*   **[Prisma](https://www.prisma.io/)** - Database ORM.
*   **[JWT](https://jwt.io/)** - Authentication.
*   **[TypeScript](https://www.typescriptlang.org/)** - Programming language.
*   **[Zod](https://zod.dev/)** - Data validation.
*   **[TANOS](https://github.com/GustavoStingelin/tanos)** - Bitcoin/Nostr atomic swaps.

### Frontend
*   **[Next.js](https://nextjs.org/)** - React framework.
*   **[React](https://reactjs.org/)** - UI library.
*   **[Tailwind CSS](https://tailwindcss.com/)** - CSS framework.
*   **[TypeScript](https://www.typescriptlang.org/)** - Programming language.
*   **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js.
*   **[Axios](https://axios-http.com/)** - HTTP client.
*   **[Zustand](https://zustand-demo.pmnd.rs/)** - State management.

## 📋 Prerequisites

*   Node.js 18+
*   MySQL

## 🚀 Installation

> **Note:** Ensure you have a running MySQL instance and the necessary environment variables configured before starting.

1.  **Clone the repository:**
    bash
    git clone https://github.com/your-username/drivetube.git
    cd drivetube
    

2.  **Install dependencies:**
    bash
    npm install
    

3.  **Environment Setup:**
    *   Create a `.env` file in the root directory.
    *   Copy the contents from `.env.example` and fill in your specific values (Database URL, Google OAuth credentials, JWT secrets, etc.).

4.  **Database Setup:**
    bash
    npx prisma migrate dev
    

5.  **Development Server:**
    bash
    npm run dev
    

## 🗺️ Roadmap

*   [x] Google Drive integration
*   [x] Basic video streaming
*   [x] Crypto payment gateway (TANOS)
*   [ ] Enhanced analytics for content creators
*   [ ] Mobile app (React Native)
*   [ ] Multi-language support

## 📂 Project Structure

plaintext
drivetube/
├── backend/          # Node.js/Fastify API
├── frontend/         # Next.js application
├── docs/             # Documentation
└── prisma/           # Database schema


## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3.  Commit your Changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the Branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Your Name - [@yourhandle](https://twitter.com/yourhandle) - email@example.com

Project Link: [https://github.com/your-username/drivetube](https://github.com/your-username/drivetube)
