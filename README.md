# Task Management System - Frontend (React + Vite + Tailwind CSS)

## Project Overview
A responsive frontend application for the Task Management System built with:
- React.js
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (API communication)

## Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Backend API server (see backend setup)

## Setup Instructions

### 1. Installation
```bash
npm install
```

### 2. Configuration
Create/update the `src/config.js` file with your backend API URL:
```javascript
export const  BASE_URL ='http://your-backend-url:8001', // Replace with your backend

```

### 3. Development
```bash
npm start 
npm run dev
```
Runs the app in development mode on `http://localhost:5173`

### 4. Production Build
```bash
npm run build
```
Creates optimized production build in the `build` folder

## Key Features
- JWT authentication flow (login/logout)
- User management (for admins)
- Task creation/assignment
- Task status management


## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Backend Integration
The frontend is designed to work with the Task Management System backend API (documented separately). Ensure your backend is running and properly configured before starting the frontend.