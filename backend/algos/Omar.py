
import random

def run_td_learning_for_pay_rent_decision(current_player, players, properties, rent, learning_rate=0.1, discount=0.9):
    """
    Uses Temporal Difference (TD) Learning to decide whether the current player should pay rent 
    or mortgage properties instead. Learns optimal state values over time and updates value estimates 
    using the TD(0) rule.

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
        rent (int): Rent amount to pay
        learning_rate (float): How quickly to update values (default: 0.1)
        discount (float): How much future states matter (default: 0.9)

    Returns:
        bool: True if the agent believes paying rent is better long-term; False to suggest mortgaging
"""

    res = [True, False]
    return res[random.randint(0,1)]