
import random

def run_ucb1_for_buying_decision(current_player, players, properties, property_to_consider):
    """
    Uses UCB1 (Upper Confidence Bound) algorithm to decide whether to buy a property
    based on past experience (reward) and exploration.

    Parameters:
        current_player (dict): An object representing the current player's full game state.
            Fields:
                - name (str): Player's name (e.g., "Player 2")
                - avatar (str): Avatar image filename
                - balance (int): Current money the player has
                - position (int): Current board index (0–23)
                - properties (list): List of property names the player owns (e.g., ["P3", "P5"])
                - houses (dict): Dictionary mapping property names to number of houses (e.g., {"P3": 1})
                - inJail (bool): Whether the player is currently in jail
                - getOutOfJailCards (int): Number of jail-free cards the player holds
                - turnsInJail (int): Number of consecutive turns spent in jail
                - mortgagedProperties (list): List of mortgaged property names
                - bankrupt (bool): Whether the player is bankrupt

        players (list of dict): A list containing all 4 players' state objects, each with the same fields as above.

        properties (list of dict): A list of all properties on the board.
            Fields:
                - name (str): Property name (e.g., "P3")
                - index (int): Board index of the property
                - price (int): Purchase cost
                - rent (int): Base rent amount
                - rentOneHouse (int): Rent with 1 house
                - rentTwoHouses (int): Rent with 2 houses
                - rentThreeHouses (int): Rent with 3 houses
                - OneHouseCost (int): Cost to build 1 house
                - houses (int): Current number of houses on the property
                - owner (str or None): Name of the player who owns it (or None)
                - mortgaged (bool): Whether the property is mortgaged
                - color (str): Color group of the property (e.g., "#FF69B4")

        property_to_consider (dict): The property under consideration, with the same fields as above

    Returns:
        bool: True if AI should buy this property, False if it should skip
    """

    res = [True, False]
    return res[random.randint(0,1)]

def run_heurisitc_search_choose_property_to_mortgage(current_player, players, properties):
    """
    Uses heuristic search to choose the least important property to mortgage.

    Parameters:
        current_player (dict): An object representing the current player's full game state.
            Fields:
                - name (str): Player's name (e.g., "Player 2")
                - avatar (str): Avatar image filename
                - balance (int): Current money the player has
                - position (int): Current board index (0–23)
                - properties (list): List of property names the player owns (e.g., ["P3", "P5"])
                - houses (dict): Dictionary mapping property names to number of houses (e.g., {"P3": 1})
                - inJail (bool): Whether the player is currently in jail
                - getOutOfJailCards (int): Number of jail-free cards the player holds
                - turnsInJail (int): Number of consecutive turns spent in jail
                - mortgagedProperties (list): List of mortgaged property names
                - bankrupt (bool): Whether the player is bankrupt

        players (list of dict): A list containing all 4 players' state objects, each with the same fields as above.

        properties (list of dict): A list of all properties on the board.
            Fields:
                - name (str): Property name (e.g., "P3")
                - index (int): Board index of the property
                - price (int): Purchase cost
                - rent (int): Base rent amount
                - rentOneHouse (int): Rent with 1 house
                - rentTwoHouses (int): Rent with 2 houses
                - rentThreeHouses (int): Rent with 3 houses
                - OneHouseCost (int): Cost to build 1 house
                - houses (int): Current number of houses on the property
                - owner (str or None): Name of the player who owns it (or None)
                - mortgaged (bool): Whether the property is mortgaged
                - color (str): Color group of the property (e.g., "#FF69B4")

    Returns:
        dict or None: The property (dict) that should be mortgaged, or None if no candidates

    """

    return None