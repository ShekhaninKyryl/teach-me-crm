# Teach Me CRM

## Project Overview
`teach-me-crm` is a Customer Relationship Management (CRM) system designed to help users manage their teaching-related tasks efficiently.
It provides features for managing subjects, tutors, and settings, among other functionalities.

## Key Features
- Add and manage subjects.
- Customize settings for tutors and other entities.
- User-friendly interface with dialog-based forms.
- Integrations with Telegram (and others) for notifications and updates [WIP].
- Reporting and analytics features to track performance and progress [WIP].
- Assets management for handling resources and materials [WIP].
- Group lessons management for organizing and scheduling group sessions [WIP].

## Technologies Used
- **TypeScript**: For type-safe JavaScript development.
- **React**: For building the user interface.
- **SQL**: For database management.
- **npm**: For managing project dependencies.
- **NestJS**: For building the backend API.
- **Prisma**: For database ORM and migrations.

## Getting Started
1. Clone the repository.
2. Set up the database using Prisma migrations.
   - Navigate to the `backend` directory and run `npx prisma migrate dev` to apply migrations and set up the database.
   - Configure the database connection in the `.env` file located in the `backend` directory.
2. Start back-end 
   - Navigate to the `backend` directory and run `npm install` to install dependencies.
   - Run `npm run start` to start the development server.
3. Start front-end
   - Configure the API endpoint in the `.env` file located in the `frontend` directory to point to your backend server (e.g., `VITE_API_BASE_URL=http://localhost:3001`).
   - Navigate to the `frontend` directory and run `npm install` to install dependencies.
   - Run `npm run dev` to start the development server.
4. Access the application at `http://localhost:5173`.