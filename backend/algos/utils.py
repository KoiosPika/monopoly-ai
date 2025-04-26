
import random, math, copy

ucb_stats = {}

async def run_ucb1_for_buying_decision(current_player, players, properties, property_to_consider):
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

    property_name = property_to_consider["name"]

    # Calculate better initial reward based on property value
    base_rent = property_to_consider["rent"]
    color_group = property_to_consider["color"]
    total_same_color = len([p for p in properties if p["color"] == color_group])

    expected_value = base_rent * total_same_color  # crude expected profit
    skip_value = 20  # base reward for skipping (low)

    # Initialize stats only once per property
    if property_name not in ucb_stats:
        ucb_stats[property_name] = {
            "buy": {"n": 1, "reward": expected_value},
            "skip": {"n": 1, "reward": skip_value}
        }

    stats = ucb_stats[property_name]
    total_tries = stats["buy"]["n"] + stats["skip"]["n"]

    def ucb_score(action):
        n = stats[action]["n"]
        avg_reward = stats[action]["reward"] / n
        exploration_term = math.sqrt(2 * math.log(total_tries) / n)
        return avg_reward + exploration_term

    buy_score = ucb_score("buy")
    skip_score = ucb_score("skip")

    should_buy = buy_score > skip_score

    # (Optional) Update counts (simulate learning after each call)
    action = "buy" if should_buy else "skip"
    stats[action]["n"] += 1

    return should_buy

async def run_heurisitc_search_choose_property_to_mortgage(current_player, players, properties):
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

    owned_props = current_player["properties"]
    mortgaged = set(current_player["mortgagedProperties"])
    houses = current_player.get("houses", {})

    def is_monopoly(prop_color):
        color_props = [p for p in properties if p["color"] == prop_color]
        owned_in_color = [p for p in color_props if p["owner"] == current_player["name"]]
        return len(color_props) == len(owned_in_color)

    def compute_heuristic(property_obj):
        # Skip already mortgaged
        if property_obj["name"] in mortgaged:
            return float("inf")

        # Add heavy penalty if it has houses (avoid mortgaging improved sets)
        house_penalty = 50 * houses.get(property_obj["name"], 0)

        # Add penalty if part of a monopoly
        monopoly_penalty = 100 if is_monopoly(property_obj["color"]) else 0

        # Use base rent as a proxy for value
        return property_obj["rent"] + house_penalty + monopoly_penalty

    # Filter properties owned by player and not mortgaged
    candidates = [p for p in properties if p["name"] in owned_props and p["name"] not in mortgaged]

    if not candidates:
        return None

    # Apply heuristic and return the property with the lowest score
    best_prop = min(candidates, key=compute_heuristic)
    return best_prop



async def run_expectimax_for_roll_decision(current_player, players, properties, depth=5):
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

    def get_possible_rolls():
        # Dice rolls from 2 to 12 with associated probabilities for 2d6
        roll_probs = {
            2: 1/36, 3: 2/36, 4: 3/36, 5: 4/36, 6: 5/36,
            7: 6/36, 8: 5/36, 9: 4/36, 10: 3/36, 11: 2/36, 12: 1/36
        }
        return roll_probs.items()

    def move_player(position, roll):
        return (position + roll) % 16  # assuming 16-tile board

    def get_tile_value(player, tile_index, all_players, properties):
        for prop in properties:
            if prop["index"] == tile_index:
                if prop["owner"] and prop["owner"] != player["name"] and not prop["mortgaged"]:
                    rent = prop["rent"]
                    if prop["houses"] == 1:
                        rent = prop["rentOneHouse"]
                    elif prop["houses"] == 2:
                        rent = prop["rentTwoHouses"]
                    elif prop["houses"] == 3:
                        rent = prop["rentThreeHouses"]
                    return -rent
        return 0  # Safe tile or own/mortgaged property

    def expectimax(state, depth, is_maximizing):
        player = state["player"]
        players = state["players"]
        properties = state["properties"]

        if depth == 0 or player["bankrupt"]:
            return player["balance"]

        if is_maximizing:
            max_value = float("-inf")
            for roll, prob in get_possible_rolls():
                new_state = simulate_roll(state, roll)
                value = expectimax(new_state, depth - 1, False)
                max_value = max(max_value, value)
            return max_value
        else:
            expected_value = 0
            for roll, prob in get_possible_rolls():
                new_state = simulate_roll(state, roll)
                value = expectimax(new_state, depth - 1, True)
                expected_value += prob * value
            return expected_value

    def simulate_roll(state, roll):
        # Deep copy to avoid mutating the original state
        state = copy.deepcopy(state)
        player = state["player"]
        players = state["players"]
        properties = state["properties"]

        if player["inJail"]:
            return state  # Skip turn if in jail (simplification)

        new_position = move_player(player["position"], roll)
        tile_value = get_tile_value(player, new_position, players, properties)

        player["position"] = new_position
        player["balance"] += tile_value
        if player["balance"] < 0:
            player["bankrupt"] = True

        return state

    # Initialize root state
    state = {
        "player": copy.deepcopy(current_player),
        "players": copy.deepcopy(players),
        "properties": copy.deepcopy(properties),
    }

    print("Running Expectimax...")
    expected_score = expectimax(state, depth, True)
    print("Expectimax completed. Expected score:", expected_score)
    return expected_score


async def run_expectimax_for_house_building(current_player,players, properties, target_property, depth=5):
    no_build_state = {
        "player": copy.deepcopy(current_player),
        "players": copy.deepcopy(players),
        "properties": copy.deepcopy(properties),
    }

    # (2) Build World
    build_state = {
        "player": copy.deepcopy(current_player),
        "players": copy.deepcopy(players),
        "properties": copy.deepcopy(properties),
    }
    
    # Apply building change
    for p in build_state["properties"]:
        if p["name"] == target_property["name"]:
            p["houses"] += 1
            break

    build_state["player"]["balance"] -= target_property["OneHouseCost"]

    # --- Define Expectimax search
    def get_possible_rolls():
        roll_probs = {
            2: 1/36, 3: 2/36, 4: 3/36, 5: 4/36, 6: 5/36,
            7: 6/36, 8: 5/36, 9: 4/36, 10: 3/36, 11: 2/36, 12: 1/36
        }
        return roll_probs.items()

    def move_player(position, roll):
        return (position + roll) % 16
    
    def get_tile_value(player, tile_index, all_players, properties):
        for prop in properties:
            if prop["index"] == tile_index:
                if prop["owner"] and prop["owner"] != player["name"] and not prop["mortgaged"]:
                    rent = prop["rent"]
                    if prop["houses"] == 1:
                        rent = prop["rentOneHouse"]
                    elif prop["houses"] == 2:
                        rent = prop["rentTwoHouses"]
                    elif prop["houses"] == 3:
                        rent = prop["rentThreeHouses"]
                    return -rent
        return 0
    
    def expectimax(state, depth, is_maximizing):
        player = state["player"]
        players = state["players"]
        properties = state["properties"]

        if depth == 0 or player["bankrupt"]:
            return player["balance"]

        if is_maximizing:
            max_value = float("-inf")
            for roll, prob in get_possible_rolls():
                new_state = simulate_roll(state, roll)
                value = expectimax(new_state, depth - 1, False)
                max_value = max(max_value, value)
            return max_value
        else:
            expected_value = 0
            for roll, prob in get_possible_rolls():
                new_state = simulate_roll(state, roll)
                value = expectimax(new_state, depth - 1, True)
                expected_value += prob * value
            return expected_value
        
    def simulate_roll(state, roll):
        state = copy.deepcopy(state)
        player = state["player"]
        properties = state["properties"]

        if player["inJail"]:
            return state

        new_position = move_player(player["position"], roll)
        tile_value = get_tile_value(player, new_position, state["players"], properties)

        player["position"] = new_position
        player["balance"] += tile_value
        if player["balance"] < 0:
            player["bankrupt"] = True

        return state
    
    score_no_build = expectimax(no_build_state, depth, True)
    score_build = expectimax(build_state, depth, True)

    # --- Decision
    return score_build > score_no_build