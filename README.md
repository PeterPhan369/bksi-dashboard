# BKSI Dashboard

## Overview

BKSI Dashboard is a full-stack web application designed to visualize user feedback, usage metrics, and rating data in an intuitive and interactive interface. It integrates a React (Vite) frontend with a Node.js/Express backend and MongoDB database, offering real-time analytics and AI-powered insights.

## Features

- **Interactive Charts**: Visualize data with Nivo (bar, pie, geo) and Recharts (line, area).
- **FullCalendar Integration**: Display scheduled events and user engagements.
- **Responsive UI**: Built with Material-UI (MUI) for a consistent and accessible design.
- **User Authentication**: Secure login and token-based sessions using JWT and bcrypt.
- **CRUD Operations**: Create, read, update, and delete feedback, usage, and rating entries.

## Tech Stack

- **Frontend**: React, Vite, Material-UI, Redux Toolkit, Formik, Yup
- **Visualization**: @nivo, Recharts, @fullcalendar/react
- **Dev Tools**: dotenv, concurrently, nodemon

## Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **npm** v11 or higher
- A running **MongoDB** instance (Atlas or local)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PeterPhan369/bksi-dashboard.git
   cd bksi-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install           # Installs frontend deps
   ```

3. **Configure environment variables**:
   Create a `.env` file in the project root with the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Run the development servers**:
   ```bash
   # In the root directory
   npm run dev           # Starts frontend at http://localhost:3000

## Folder Structure

```
/bksi-dashboard
├── public/             # Static assets (favicon, manifest, logos)
├── src/                # React frontend source
│   ├── api/            # API client modules (axios)
│   ├── components/     # Reusable React components
│   ├── context/        # React context providers
│   ├── data/           # Static data or config
│   ├── scenes/         # Page-level components/routes
│   ├── App.jsx         # App root component
│   ├── index.jsx       # Frontend entry point
│   └── theme.jsx       # MUI theme configuration
├── .env                # Environment variables (not committed)
├── .gitignore          # Excludes node_modules, logs, env files
├── Dockerfile          # Containerization config
├── vite.config.ts      # Vite build/server config
└── package.json        # Project metadata and scripts
```

## API Endpoints

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| POST   | `/api/auth`         | Authenticate user, receive token |
| GET    | `/api/feedback`     | Retrieve all feedback entries    |
| POST   | `/api/feedback`     | Submit new feedback              |
| GET    | `/api/usage`        | Get usage metrics                |
| GET    | `/api/rating`       | Fetch rating statistics          |

> **Note**: Protected routes require `Authorization: Bearer <token>` header.


This script will clear existing data and insert sample feedback, usage, and ratings.

## Environment Variables

| Key                | Description                          |
| ------------------ | ------------------------------------ |
| `MONGODB_URI`      | MongoDB connection string (Atlas)    |
| `JWT_SECRET`       | Secret key for JWT token signing     |
| `PORT`             | Backend server port (default: 5000)  |
| `REACT_APP_API_URL`| Frontend API base URL                |

## Scripts

| Script         | Command              | Description                            |
| -------------- | -------------------- | -------------------------------------- |
| `npm run dev`  | `vite`               | Start frontend in dev mode             |
| `npm start`    | `vite`               | Alias for dev server                   |
| `npm run build`| `vite build`         | Build production-ready frontend        |
| `npm run serve`| `vite preview`       | Preview production build               |

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please open an issue or contact the maintainer.

