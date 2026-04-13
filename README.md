# NAE Entertainment

![NAE Entertainment Banner](./assets/banner.png)

## 🌟 Overview
**NAE Entertainment** is a modern digital entertainment platform designed to provide a seamless experience for music and video enthusiasts. Built with a robust full-stack architecture, it features a high-performance React frontend and a scalable Node.js backend.

---

## 🚀 Features
- **Dynamic Music Player**: Integrated audio streaming with SQLite-backed metadata.
- **Video Integration**: YouTube API integration for seamless content delivery.
- **Multilingual Support**: Fully localized using `i18next`.
- **Responsive Design**: Mobile-first approach with modern UI/UX principles.
- **Dockerized Architecture**: Simplified deployment and scaling using Docker Compose.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Animations**: [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [SQLite 3](https://sqlite.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📂 Project Structure
```text
nae-entertainment/
├── be/               # Backend Service (Node.js/Express)
│   ├── src/          # Source code
│   └── music.db      # SQLite Database
├── fe/               # Frontend Application (React/Vite)
│   └── src/          # React components and assets
├── assets/           # Repository assets (banners, logos)
└── docker-compose.yml # Docker configuration for orchestration
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose

### Fast Track (Local Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bravoarocardova/nae-entertainment.git
   cd nae-entertainment
   ```

2. **Setup Environment Variables**:
   Copy the example environment files and update them with your keys.
   ```bash
   # Backend
   cp be/.env.example be/.env
   
   # Frontend
   cp fe/.env.example fe/.env.local
   ```

3. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:4000](http://localhost:4000)

### Manual Installation (Development)

**Backend**:
```bash
cd be
npm install
npm run dev
```

**Frontend**:
```bash
cd fe
npm install
npm run dev
```

---

## 📝 License
This project is licensed under the **ISC License**.

---

Developed with ❤️ by [Bravo Aro Cardova](https://github.com/bravoarocardova)
