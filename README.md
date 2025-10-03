# DHYEY Production Platform

Full-stack storytelling platform with Vue.js frontend and Node.js backend.

## Project Structure

```
dhyey-prod-filmy/
├── frontend/          # Vue 3 + TypeScript + Vite
└── backend/           # Node.js + Express + MongoDB
```

## Quick Start

### Install All Dependencies
```bash
npm install
```

### Run Both Services
```bash
npm run dev
```

### Run Individual Services
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Features

- User authentication & authorization
- Story creation & management
- Content moderation
- File uploads with image processing
- RESTful API with security middleware