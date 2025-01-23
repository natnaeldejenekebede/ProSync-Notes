# CollabNote - A NestJS, Next.js, Vite, and Supabase Fullstack Notetaking App

[![NestJS](https://img.shields.io/badge/NestJS-v11.0.0-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-v12.0.7-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v6.0.5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-v1.0.0-000000?style=for-the-badge&logo=supabase)](https://supabase.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Swagger](https://img.shields.io/badge/Swagger-v4.1.6-85EA2D?style=for-the-badge&logo=swagger)](https://swagger.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![ShadCN](https://img.shields.io/badge/ShadCN-UI%20Toolkit-blue?style=for-the-badge)](https://ui.shadcn.dev/)

CollabNote is a collaborative notes platform designed to help you take, share, and manage notes effectively. It features a user-friendly interface, powerful backend APIs, and seamless deployment for both frontend and backend.

## Table of Contents
- [🚀 Features](#-features)
- [🎯 Tech Stack](#-tech-stack)
- [🖼️ UI Overview](#️-ui-overview)
- [🛠️ Getting Started](#️-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Using Docker](#using-docker)
- [📖 API Documentation](#-api-documentation)
  - [API Endpoints](#api-endpoints)

## 🚀 Features

- **Authentication**: Secure user login, registration, and password management.
- **Notes Management**: Create, update, delete, and reorder notes.
- **Sharing**: Share notes with other users seamlessly.
- **User Profiles**: Manage and search user profiles.
- **Swagger Documentation**: Comprehensive API documentation.

---

## 🎯 Tech Stack

| Technology                                    | Description                         |
|-----------------------------------------------|-------------------------------------|
| [NestJS](https://nestjs.com/)                 | Backend framework for scalable APIs |
| [Next.js](https://nextjs.org/)                | React-based framework for SSR       |
| [React](https://reactjs.org/)                 | Frontend library for building UI    |
| [Vite](https://vitejs.dev/)                   | Frontend build tool                 |
| [Supabase](https://supabase.io/)              | Backend-as-a-service for auth & DB  |
| [PostgreSQL](https://www.postgresql.org/)     | Database for storing app data       |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development               |
| [Swagger](https://swagger.io/)                | API documentation and testing tool  |
| [ShadCN](https://ui.shadcn.dev/)              | UI components for a modern design   |

---

## 🖼️ UI Overview

### Login Page
*(Add a screenshot here)*

---

### Notes Dashboard
*(Add a screenshot here)*

---

### API Documentation
*(Add a screenshot of Swagger here)*

---

## 🛠️ Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18 or above
- **npm**: v9 or above
- **PostgreSQL**: v15 or above
- **Docker** (Optional)

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hoangsonww/CollabNote-Fullstack-App.git
   cd CollabNote-Fullstack-App
   ```

2. **Set Up Backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Set Up Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**:
- Create `.env` files in the `backend` and `frontend` directories.
- For **backend** (`backend/.env`):
  ```env
  DATABASE_URL=postgres://user:password@localhost:5432/collabnote
  JWT_SECRET=your_jwt_secret
  PORT=4000
  ```
- For **frontend** (`frontend/.env`):
  ```env
  VITE_API_URL=http://localhost:4000
  ```

---

### Running Locally

1. **Start the Backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the Frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Swagger**: [http://localhost:4000/api](http://localhost:4000/api)

---

### Using Docker

1. **Build and Run Docker Containers**:
   ```bash
   docker-compose up --build
   ```

2. **Access the Services**:
- Backend: [http://localhost:4000](http://localhost:4000)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 📖 API Documentation

All APIs are documented in Swagger. Access the documentation at [http://localhost:4000/api](http://localhost:4000/api).

### API Endpoints

| Method | Endpoint                   | Description                               |
|--------|----------------------------|-------------------------------------------|
| POST   | `/auth/register`           | Register a new user                       |
| POST   | `/auth/login`              | Login an existing user                    |
| POST   | `/auth/check-email-exists` | Check if an email exists                  |
| POST   | `/auth/reset-password`     | Reset a user's password                   |
| GET    | `/notes`                   | Retrieve user notes                       |
| POST   | `/notes`                   | Create a new note                         |
| PATCH  | `/notes/{id}`              | Update a note                             |
| DELETE | `/notes/{id}`              | Delete a note                             |
| POST   | `/notes/{id}/share`        | Share a note with another user            |
| POST   | `/notes/reorder`           | Reorder user notes                        |
| GET    | `/profile/me`              | Retrieve the authenticated user's profile |
| GET    | `/profile/userId/{id}`     | Retrieve a user profile by ID             |
| GET    | `/profile/search`          | Search for a user profile by username     |

---

## 🧪 Testing

Run tests to ensure the app functions as expected.

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## 🎉 Acknowledgments

- **Son Nguyen**: Creator and maintainer of CollabNote.
- **NestJS, Next.js, React, Vite**: The tech stack that powers this project.

---

Thank you for visiting CollabNote today! Happy notetaking! 📝🚀

[🔝 Back to Top](#collabnote---a-nestjs-nextjs-vite-and-supabase-fullstack-notetaking-app)
