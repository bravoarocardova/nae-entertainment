# NAE Entertainment - Backend

![NAE Entertainment Banner](../assets/banner.png)

## ⚙️ Overview
The backend for NAE Entertainment is a robust **Express.js** service written in **TypeScript**. It manages music metadata, playback statistics, and integrates with the SQLite database.

## 🚀 Key Features
- **API service**: RESTful endpoints for frontend consumption.
- **Database**: Efficient data management using **SQLite 3**.
- **Dev Workflow**: High-speed development with `tsx` and hot-reloading.
- **Environment Driven**: Secure configuration via `.env`.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite 3
- **Dev Tooling**: tsx

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env` (Copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Start the server (Dev Mode):
   ```bash
   npm run dev
   ```

## 📡 API Endpoints
The backend typically runs on [http://localhost:4000](http://localhost:4000). Refer to the source code in `src/` for detailed endpoint documentation.

---
Part of the [NAE Entertainment](..) project.
