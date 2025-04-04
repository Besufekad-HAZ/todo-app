<h1 align="center">
 Overengineered Todo App
</h1>

<p align="center">
  <img src="https://i.pinimg.com/736x/b0/65/d8/b065d89b2b2d3194e4f2ab64568cbe69.jpg" alt="Todo App Logo" width="400" height="auto" />
</p>

## 📗 Table of Contents

- [About the Project](#about-project)
- [🛠 Built With](#built-with)
- [Key Features](#key-features)
- [🚀 Live Demo](#live-demo)
- [📸 Screenshots](#screenshots)
- [🧾 Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show Your Support](#show-your-support)
- [📝 License](#license)

---

## ❔ About the Project <a name="about-project"></a>

A full-stack Todo application built with modern web technologies featuring nested subtasks, collection management, and real-time updates. Designed with scalability and maintainability in mind using Clean Architecture principles.

---

## 🛠 Built With <a name="built-with"></a>

### Frontend

- React 19 + TypeScript
- Redux Toolkit + RTK Query
- Tailwind CSS
- React DnD for drag-and-drop
- React Router DOM for routing

### Backend

- Express.js + TypeScript
- PostgreSQL + Prisma ORM
- REST API with JWT Authentication
- CORS(Cross-Origin Resource Sharing)
- ws(WebSocket library for Node.js)

### Tooling

- Vite + Vitest
- Jest + Supertest
- ESLint + Prettier

---

## Key Features <a name="key-features"></a>

- 🗂️ Collection-based task organization
- 📝 Nested subtasks with completion propagation
- 🎨 Responsive UI with Tailwind CSS
- 🌓 Light/Dark theme toggle
- 🔄 Real-time updates with WebSockets
- 📅 Date-based task scheduling
- ✅ Drag-and-drop task reordering
- 🛡️ Type-safe API with Express+TypeScript
- 📊 Collection statistics and analytics

---

## 🚀 Live Demo <a name="live-demo"></a>

[Live Demo Coming Soon](#)

---

## 📸 Screenshots <a name="screenshots"></a>

<p align="center">
  <img src="https://github.com/user-attachments/assets/feccd307-b5d0-4312-a633-b2e5ef3349a3" alt="Screenshot 1" width="600" />

  <img src="https://github.com/user-attachments/assets/8f799bc7-40a7-4191-96c2-5d81f8fb5f8c" alt="Screenshot 2" width="600" />

  <img src="https://github.com/user-attachments/assets/e534e48e-c79d-4a2c-9c77-dca5b0fbc945" alt="Screenshot 3" width="600" />

</p>

---

## Getting Started <a name="getting-started"></a>

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- NPM 8+

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Besufekad-HAZ/todo-app.git
cd todo-app
```

2. Configure environment variables:

- Create a `.env` file in the root directory with the following content:

```bash
cd packages/backend/.env.example packages/backend/.env
```

### Installation

1. Install dependencies:

```bash
npm install
cd packages/frontend && npm install
cd ../backend && npm install
```

2.Database setup:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Usage

Start development servers:

```bash
# Backend
cd packages/backend && npm run dev

# Frontend (in separate terminal)
cd packages/frontend && npm run dev
```

### Testing

Run test suites:

```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test
```

---

## 🔭 Future Features <a name="future-features"></a>

- 🔐 User Authentication for personalized task management ( my first priority 😊)
- 🔔 Desktop notifications
- 📊 Advanced analytics dashboard
- 🔍 Full-text search
- 📱 Progressive Web App support

---

## 🤝 Contributing <a name="contributing"></a>

Contributions are welcome! Please see our [contribution guidelines](CONTRIBUTING.md) and open an issue first to discuss proposed changes.

---

## ❤️ Show Your Support <a name="show-your-support"></a>

If you find this project useful, please give it a ⭐️!

---

## 📝 License <a name="license"></a>

This project is [MIT licensed](./LICENSE).

<p align="right">(<a href="#readme-top">back to top</a>)</p>
```
