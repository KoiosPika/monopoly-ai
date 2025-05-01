import random, copy, math

"""
    Uses Monte Carlo Tree Search (MCTS) to decide what the current player should do to get out of jail.

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
                - getOutOfJailCard  s (int): Number of jail-free cards the player holds
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

        iterations (int): Number of simulations to run for MCTS. Defaults to 100.

    Returns:
        int: A decision integer:
            1 = Try to roll a double
            2 = Pay $50 fine
            3 = Use "Get Out of Jail Free" card
"""
class MCTSNode:
    def __init__(self, state, decision=None, parent=None):
        self.state = state  # current_player dict
        self.decision = decision  # 1, 2, or 3
        self.parent = parent
        self.children = []
        self.visits = 0
        self.total_reward = 0

    # Returns true if all decisions have been tried from the node
    def is_fully_expanded(self, available_decisions):
        existing = {child.decision for child in self.children}
        return all(d in existing for d in available_decisions)
    
    # Selects child with the best upper confidence bound value
    def best_child(self, constant_param = 1.4):
        
        def ucb(child):
            if child.visits == 0:
                return float('inf')
            return (child.total_reward / child.visits) + constant_param * math.sqrt(math.log(self.visits) / child.visits)
        
        return max(self.children, key = ucb)


def evaluate_state(player, players, properties):
    score = player["balance"]
    
    for prop in properties:
        if prop["owner"] == player["name"]:
            score += prop["price"] * 0.2
            
    return score


def handle_tile(player, players, properties):
    position = player["position"]
    tile_landed = next((p for p in properties if p["index"] == position), None)
    
    if not tile_landed: # all non properties
        return

    if tile_landed["owner"] is None:
        if player["balance"] >= tile_landed["price"]:
            player["balance"] -= tile_landed["price"]
            tile_landed["owner"] = player["name"]
            
    elif tile_landed["owner"] != player["name"]:
        if tile_landed["houses"] == 0:
            rent = tile_landed["rent"]
            
        elif tile_landed["houses"] == 1:
            rent = tile_landed["rentOneHouse"]
            
        elif tile_landed["houses"] == 2:
            rent = tile_landed["rentTwoHouses"]
            
        else:
            rent = tile_landed["rentThreeHouses"]
            
        player["balance"] -= rent


def simulate_jail_decision(decision, current_player, players, properties):
    sim_player = copy.deepcopy(current_player)
    sim_players = copy.deepcopy(players)
    sim_props = copy.deepcopy(properties)

    if decision == 1:
        if random.random() <= 0.17:
            sim_player["inJail"] = False
            sim_player["turnsInJail"] = 0
        else:
            sim_player["turnsInJail"] += 1
            
    elif decision == 2:
        sim_player["balance"] -= 50
        sim_player["inJail"] = False
        sim_player["turnsInJail"] = 0
        
    elif decision == 3:
        sim_player["getOutOfJailCards"] -= 1
        sim_player["inJail"] = False
        sim_player["turnsInJail"] = 0

    # Simulate up to 2 more turns
    for _ in range(10):
        if sim_player["inJail"]:
            
            if sim_player["turnsInJail"] == 3:
                sim_player["balance"] -= 50
                sim_player["inJail"] = False
                sim_player["turnsInJail"] = 0
                
            elif random.random() <= 0.17:
                sim_player["inJail"] = False
                sim_player["turnsInJail"] = 0
                
            else:
                sim_player["turnsInJail"] += 1
                continue

        roll = random.randint(2, 12)
        sim_player["position"] = (sim_player["position"] + roll) % 16
        
        handle_tile(sim_player, sim_players, sim_props)

    return evaluate_state(sim_player, sim_players, sim_props)


async def run_mcts_for_jail_decision(current_player, players, properties,jail_options, iterations = 100):
    
    option_to_code = {
        "rollDouble": 1,
        "payFine": 2,
        "useCard": 3
    }
    
    decisions = [option_to_code[o] for o in jail_options if o in option_to_code]
    root = MCTSNode(state = current_player)

    for _ in range(iterations):
        node = root

        # Selection
        while node.children and node.is_fully_expanded(decisions):
            node = node.best_child()

        # Expansion
        unexplored = [d for d in decisions if d not in [c.decision for c in node.children]]
        if unexplored:
            decision = random.choice(unexplored)
            new_state = copy.deepcopy(current_player)
            child_node = MCTSNode(new_state, decision = decision, parent = node)
            node.children.append(child_node)
            node = child_node

        # Simulation
        reward = simulate_jail_decision(node.decision, current_player, players, properties)

        # Backpropagation
        while node:
            node.visits += 1
            node.total_reward += reward
            node = node.parent

    # Choose the best decision
    best = max(root.children, key=lambda n: n.total_reward / n.visits if n.visits > 0 else float('-inf'))
    return best.decision
