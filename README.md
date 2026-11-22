# SkillSwap Portal

A full-stack **MERN** peer-to-peer skill exchange and credit-based learning platform where users can offer skills they can teach, discover peers who teach skills they want to learn, send and manage swap requests, coordinate via peer contact and live session links, and transfer **Skill Credits** upon session completion.

## Key Features
- **Authentication & Profiles:** Secure JWT-based registration and login with password hashing (`bcryptjs`), profile editing (college, city/location, bio, skills offered, skills wanted), and a starting balance of **3 Skill Credits**.
- **Peer Discovery & Smart Matchmaking:** Search peers by skill or city/location, and view **Smart Matches** highlighting mutual skill exchanges.
- **Swap Request Lifecycle:** Send swap requests (`skillToLearn`, optional `skillOfferedInReturn`, `creditsUsed`, and schedule message) and manage them (`pending` → `accepted` / `rejected` → `completed`).
- **Privacy-First Peer Contact & Session Links:** Peer contact emails and meeting links remain hidden while a request is `pending` or `rejected`. Once `accepted`, both participants can view each other's contact email and save/join live session links (Google Meet, Zoom, Jitsi, etc.).
- **Skill Credits Settlement:** Automated credit transfer from requester to provider when a swap is marked completed, with live credit balance updates.

## Tech Stack
- **Frontend:** React (Vite), React Router DOM, Context API, Axios, Tailwind CSS v4, Lucide React
- **Backend:** Node.js, Express.js, REST APIs, JWT (`jsonwebtoken`), `bcryptjs`
- **Database:** MongoDB with Mongoose

## Project Structure
```text
skillswap-portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   │   ├── User.js
│   │   └── SwapRequest.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── swapRoutes.js
│   ├── server.js
│   └── .env          # Not tracked in Git
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
└── .gitignore
```

## Core API Endpoints
- `POST /api/auth/register` & `POST /api/auth/login` — User registration and JWT authentication
- `GET /api/users/peers` & `GET /api/users/matches` — Peer discovery and smart mutual skill matching
- `POST /api/swaps` — Create a new skill swap request
- `GET /api/swaps/my` — Fetch user swaps (sanitizes peer contact email and session link until accepted)
- `PATCH /api/swaps/:id/respond` — Accept or reject an incoming swap request
- `PATCH /api/swaps/:id/meeting-link` — Save or update the session meeting link for an accepted swap
- `PATCH /api/swaps/:id/complete` — Mark swap as completed and transfer Skill Credits

## Local Setup & Installation

### 1. Clone the Repository
```bash
git clone [https://github.com/Ayushii99/skillswap-portal.git](https://github.com/Ayushii99/skillswap-portal.git)
cd skillswap-portal
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/` with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL shown in Vite (typically `http://localhost:5173`).