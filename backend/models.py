from pydantic import BaseModel
from typing import List, Dict, Optional

# This file contains the models used for the API requests and responses.

# Define model for Player
class PlayerModel(BaseModel):
    name: str
    avatar: str
    balance: int
    position: int
    properties: List[str]
    houses: Dict[str, int]
    inJail: bool
    getOutOfJailCards: int
    turnsInJail: int
    bankrupt: bool
    skipTurnCount: int

# Define model for Property
class PropertyModel(BaseModel):
    name: str
    index: int
    price: int
    rent: int
    rentOneHouse: int
    rentTwoHouses: int
    rentThreeHouses: int
    OneHouseCost: int
    houses: int
    owner: Optional[str]  # Can be None
    mortgaged: bool
    color: str

# Define model for Rolling Desicion Request
class ExpectimaxRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]

# Define model for Buying Decision Request
class UCB1Request(ExpectimaxRequest):
    property_to_consider: PropertyModel


# Define model for Pay Mortgage Decision Request
class TDLearningRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]
    rent: int

# Define model for Jail Decision Request
class MCTSRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]
    jail_options: List[str]

# Define model for Building Decision Request
class BuildHouseRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    thisProperty: PropertyModel
    properties: List[PropertyModel]