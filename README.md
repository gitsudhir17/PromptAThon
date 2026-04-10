# PromptAThon
EatNFit V4 is a modern full-stack health and nutrition platform tailored for the Indian demographic. It combines a Claymorphic UI, 3D interactive elements, and a custom Indian Protein Engine to deliver a personalized fitness experience.

🚀 Features
🧠 Core Highlights
🔐 JWT-based Authentication (Secure login/signup)
🧬 Indian Protein Recommendation Engine
📊 Health Tracking (Calories, Protein, Weight)
🎯 Goal-based Modes (Bulk | Shred | Vitality)
🎨 Claymorphic UI Design System
🧊 3D Interactive Elements (React Three Fiber)
⚡ Real-time Health Calculators (BMI, TDEE, Protein Ratio)

🏗️ Tech Stack
Backend
Node.js
Express.js
Sequelize ORM
SQLite
JWT Authentication
Bcrypt Password Hashing
Frontend
React (Vite)
Framer Motion (Animations)
React Three Fiber (3D)
CSS (Claymorphism Design System)



EatNFit-V4/
│
├── server.js
├── src/
│   ├── backend/
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   ├── HealthLog.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthGate.jsx
│   │   ├── clay/
│   │   │   └── ClayCard.jsx
│   │   ├── dashboard/
│   │   │   └── TriPathDashboard.jsx
│   │   ├── engine/
│   │   │   └── ProteinEngine.jsx
│   │   ├── calculators/
│   │       └── HealthCalculators.jsx
│   │
│   ├── App.jsx
│   ├── index.css



⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/eatnfit-v4.git
cd eatnfit-v4
2️⃣ Install Dependencies
Backend
npm install
Frontend
cd src
npm install
3️⃣ Run the Project
Start Backend
node server.js
Start Frontend
npm run dev
🔐 Authentication Flow
User registers with:
Name, Email, Mobile
Password (hashed using bcrypt)
On login:
JWT token is generated
Stored in localStorage
Protected routes verified via middleware
📊 Health Modules
🧮 Calculators
BMI Calculator
TDEE Calculator
Protein Intake Calculator
🥗 Protein Engine
Personalized protein recommendations
Indian food alternatives (Paneer, Dal, Soya, Eggs, Chicken)
