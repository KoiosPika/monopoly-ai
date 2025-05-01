from pydantic import BaseModel
from typing import List, Dict, Optional


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


class ExpectimaxRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]


class UCB1Request(ExpectimaxRequest):
    property_to_consider: PropertyModel


class MortgageRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]


class TDLearningRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]
    rent: int


class MCTSRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    properties: List[PropertyModel]
    jail_options: List[str]

class BuildHouseRequest(BaseModel):
    current_player: PlayerModel
    players: List[PlayerModel]
    thisProperty: PropertyModel
    properties: List[PropertyModel]