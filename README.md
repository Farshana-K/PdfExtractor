# PDF Extractor

A full-stack web application for uploading, viewing, extracting, and managing PDF documents.

Users can upload PDF files, select specific pages to extract into a new PDF, download the generated file, or save it to their personal PDF library.

## Features

* User registration with email OTP verification
* Login and secure authentication using JWT
* Forgot and reset password using OTP
* Upload PDF documents
* View uploaded PDFs
* Extract selected pages from PDFs
* Download generated PDFs
* Save extracted PDFs to the user's library
* Delete uploaded PDFs
* User-specific PDF management

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* Zod
* PDF-Lib
* GridFS
* Resend

## Architecture

The backend follows **Clean Architecture** principles with separate layers for:

* Domain
* Application
* Infrastructure
* Presentation
* Factory

This keeps business logic independent from frameworks and infrastructure implementations.

## Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Install dependencies

```bash
npm install
```

Install dependencies for the frontend as well if it is maintained in a separate folder.

### Environment Variables

Create a `.env` file and configure the required environment variables:

```env
PORT=
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
RESEND_API_KEY=
EMAIL_FROM=
```

### Run the application

Start the backend and frontend using their respective development commands.

```bash
npm run dev
```

## Project Purpose

This project was built to practice full-stack development, authentication, PDF processing, file storage, and Clean Architecture using TypeScript.

## Refactoring conventions

- Use descriptive dependency names with a leading underscore for private constructor-injected fields (for example, `_pdfRepo` and `_storageService`).
- Backend HTTP status codes are centralized in `backEnd/src/shared/HttpStatusCode.ts`.
- Shared success/error messages are centralized in `backEnd/src/shared/ResponseMessages.ts`.
- JSON controller responses include a `success` flag; errors use the common `{ success: false, message }` shape through the error middleware.
- `BaseRepository` contains shared Mongoose persistence operations and the concrete repositories extend it.
- Frontend HTTP transport is wrapped by `frontEnd/src/services/apiService.ts`; pages, components, and Redux use the service layer.
- Frontend endpoint paths are centralized in `frontEnd/src/constants/apiRoutes.ts`.

## Setup

1. Install dependencies with `npm install` inside both `backEnd` and `frontEnd`.
2. Copy `backEnd/.env.example` to `backEnd/.env` and configure the MongoDB URI, JWT secrets, Resend configuration, and client URL.
3. Copy `frontEnd/.env.example` to `frontEnd/.env` and set `VITE_API_URL` to the backend API base URL.
4. Run `npm run dev` in each project directory. Run `npm run build` to type-check/build.

Do not commit `.env` files or dependency folders.
