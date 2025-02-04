# Next.js Media Uploader & Downloader

A full-stack media uploader and downloader built with **Next.js** (with TypeScript), **Cloudinary** for media storage, **Prisma** as the ORM, **NeonDB** as the PostgreSQL hosting solution, and **Clerk** for authentication. This project demonstrates how to upload videos/images, transform them on Cloudinary, and force downloads with Cloudinary's `fl_attachment` flag.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication:** Powered by [Clerk](https://clerk.dev/).
- **Media Uploads:** Upload videos and images to Cloudinary.
- **Cloudinary Transformations:** Generate dynamic URLs (e.g., force download with `fl_attachment`).
- **Database Management:** Store media metadata in a NeonDB PostgreSQL database using Prisma.
- **Responsive UI:** Built with Next.js and Tailwind CSS.
- **TypeScript:** Full type safety across the project.

## Technologies

- [Next.js](https://nextjs.org/) with **TypeScript**
- [Cloudinary](https://cloudinary.com/) for image and video management
- [Prisma](https://www.prisma.io/) ORM for database management
- [NeonDB](https://neon.tech/) (PostgreSQL hosting)
- [Clerk](https://clerk.dev/) for authentication
- [Axios](https://axios-http.com/) for HTTP requests
- [Tailwind CSS](https://tailwindcss.com/) for styling (optional)

## Getting Started

### Prerequisites

- **Node.js** (v14 or later)
- **Yarn** or **npm**
- A [Cloudinary account](https://cloudinary.com/)
- A [NeonDB](https://neon.tech/) or other PostgreSQL database
- A [Clerk account](https://clerk.dev/) for authentication

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/nextjs-media-uploader.git
   cd nextjs-media-uploader
