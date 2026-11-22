# SkillSwap Portal

A full-stack **MERN** peer-to-peer skill exchange and credit-based learning platform where users can offer skills they can teach, discover peers who teach skills they want to learn, send and manage swap requests, and transfer **Skill Credits** upon session completion.

## Key Features
- **Authentication & Profiles:** Secure JWT-based registration and login with password hashing (`bcryptjs`), profile editing (college, city/location, bio, skills offered, skills wanted), and a starting balance of **3 Skill Credits**.
- **Peer Discovery & Smart Matchmaking:** Search peers by skill or city/location, and view **Smart Matches** highlighting mutual skill exchanges.
- **Swap Request Lifecycle:** Send swap requests (`skillToLearn`, optional `skillOfferedInReturn`, `creditsUsed`, and schedule message) and manage them (`pending` → `accepted` / `rejected` → `completed`).
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
│   ├── routes/
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
npm start
```
*(Or `node server.js` depending on your script.)*

### 3. Frontend Setup
Open a second terminal in the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL shown in Vite (typically `http://localhost:5173`).