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
git clone <your-repository-url>
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
