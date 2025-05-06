# 🧠 Monopoly AI Game

An AI-powered Monopoly game designed to explore intelligent decision-making in uncertain environments. This project simulates Monopoly gameplay between a human player and a strategic AI agent, using a combination of algorithms to mimic complex reasoning under risk and randomness.

## 🌟 Objective

To build an AI agent capable of making strategic and adaptable decisions in the game of Monopoly — a game combining chance (dice rolls, cards) and decision-making (buying properties, managing resources, escaping jail). Our AI is designed to play competitively against human players using modern AI techniques.

## 📌 Problem Overview

Creating an AI for Monopoly is uniquely challenging due to the blend of strategy and luck. Unlike purely deterministic games, Monopoly requires the AI to adapt to unpredictable events while planning long-term. We aim to train an agent that reasons in real time, balancing immediate outcomes and future possibilities, outperforming rule-based systems.

## 🧠 AI Algorithms Used

Each type of decision the AI makes is supported by a different algorithm:
- **Monte Carlo Tree Search (MCTS)**: For jail decisions.
- **Temporal Difference Learning (TD-Learning)**: For managing finances (rent vs mortgage).
- **Upper Confidence Bound (UCB1)**: For deciding whether to purchase properties.
- **Expectimax**: For rolling dice and house-building strategies.

These algorithms work together to simulate strategic human-like behavior.

## ⚙️ Software Architecture

The system is split into:
- A **frontend** (Next.js with TypeScript) that renders the Monopoly board and manages interaction.
- A **backend** (FastAPI in Python) that houses the decision-making logic and algorithms.

The game communicates through API requests:  
`Frontend → API → AI Engine → Response`

## 📊 Evaluation Results

Over **20 simulated games (50 turns each)**:
- **AI Wins**: 13  
- **Player Wins**: 7  
- **Average Score (AI)**: 934.65  
- **Average Score (Player)**: 665.33  

AI performance was measured using a custom score formula that considered:
- Change in Balance
- Change in Properties Owned
- Change in Houses Owned

Weights:  
`w₁ = 0.5`, `w₂ = 180`, `w₃ = 220`

### Win Types:
- **Dominant Wins**: 7  
- **Clear Wins**: 3  
- **Narrow Wins**: 3  
- **Losses**: 7 (including 2 dominant)

## 🛠️ Future Enhancements

- Auction and property trading support  
- Full board with all mechanics  
- Reinforcement Learning for dynamic strategy  
- Persistent player profiles and stats tracking

---

## 🚀 How to Run the Project

### 🔄 Clone the Repository

```bash
git clone https://github.com/KoiosPika/monopoly-ai.git
cd monopoly-ai
```

---

### 🧠 Start the Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

---

### 🎮 Start the Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit: [http://localhost:3000](http://localhost:3000)

---
