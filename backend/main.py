from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import uvicorn
from algos.Josh import run_mcts_for_jail_decision
from algos.Omar import run_td_learning_for_pay_rent_decision
from algos.utils import run_ucb1_for_buying_decision, run_heurisitc_search_choose_property_to_mortgage, run_expectimax_for_roll_decision
from models import ExpectimaxRequest, UCB1Request, MortgageRequest, TDLearningRequest, MCTSRequest

app = FastAPI()

# CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ai/mcts")
async def Monte_Carlo_Tree_Search(data: MCTSRequest):
    current_player = data.current_player.model_dump()
    players = [p.model_dump() for p in data.players]
    properties = [p.model_dump() for p in data.properties]
    res = await run_mcts_for_jail_decision(current_player, players, properties)
    return res

@app.post("/ai/expectimax-eval")
async def Expectimax_algorithm(data: ExpectimaxRequest):
    current_player = data.current_player.model_dump()
    players = [p.model_dump() for p in data.players]
    properties = [p.model_dump() for p in data.properties]
    res = await run_expectimax_for_roll_decision(current_player, players, properties)
    return res

@app.post("/ai/td-learning")
async def TD_learning_algorithm(data: TDLearningRequest):
    current_player = data.current_player.model_dump()
    players = [p.model_dump() for p in data.players]
    properties = [p.model_dump() for p in data.properties]
    rent = data.rent
    res = await run_td_learning_for_pay_rent_decision(current_player, players, properties, rent)
    return res

@app.post("/ai/ucb1")
async def TD_ucb1_algorithm(data: UCB1Request):
    current_player = data.current_player.model_dump()
    players = [p.model_dump() for p in data.players]
    properties = [p.model_dump() for p in data.properties]
    property_to_consider = data.property_to_consider.model_dump()
    res = await run_ucb1_for_buying_decision(current_player, players, properties, property_to_consider)
    return res

@app.post("/ai/heuristic-mortgage")
async def Heuristic_algorithm(data: MortgageRequest):
    current_player = data.current_player.model_dump()
    players = [p.model_dump() for p in data.players]
    properties = [p.model_dump() for p in data.properties]
    res = await run_heurisitc_search_choose_property_to_mortgage(current_player, players, properties)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)