import random

def run_expectimax_for_roll_decision(current_player, players, properties, depth=2):
    """
    Uses Expectimax algorithm to evaluate the risk of rolling the dice based on the player's current position 
    and the state of the board. The algorithm simulates potential dice rolls and resulting outcomes up to a 
    specified depth, computing the expected value of the player's game state.

    This is useful before deciding to roll the dice — for example, to determine whether to mortgage properties 
    preemptively if the expected losses are high.

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

        depth (int): Number of turns to look ahead in the Expectimax tree. Defaults to 2.

    Returns:
        float: A numeric score representing the expected value of rolling the dice.
               Lower values indicate higher risk. Can be used to decide whether to
               roll, mortgage, or take other defensive actions.
"""

    # ALgorithm goes here

    return random.randint(1,500)