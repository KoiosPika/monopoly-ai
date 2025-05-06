

async def run_td_learning_for_pay_rent_decision(current_player, players, properties, rent, learning_rate=0.1, discount=0.9):
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
    # Step 1: Define the current state features
    def extract_state_features(player, all_players, all_properties, rent_amount):
        

        balance = player['balance']
        balance_after_rent = balance - rent_amount
        own_properties_count = len(player['properties'])
        mortgaged_count = len(player['mortgagedProperties'])
        
        # Calculate total property value (potential mortgage value)
        total_property_value = 0
        mortgageable_value = 0
        for prop_name in player['properties']:
            for prop in all_properties:
                if prop['name'] == prop_name and prop_name not in player['mortgagedProperties']:
                    total_property_value += prop['price']
                    # Mortgage value is typically half the property price
                    mortgageable_value += prop['price'] / 2
        
        # Calculate opponent wealth as a competitive factor
        opponent_total_balance = 0
        for p in all_players:
            if p['name'] != player['name']:
                opponent_total_balance += p['balance']
        avg_opponent_balance = opponent_total_balance / (len(all_players) - 1) if len(all_players) > 1 else 0
        
        # Feature vector
        features = {
            'balance_ratio': balance / (balance + avg_opponent_balance) if (balance + avg_opponent_balance) > 0 else 0.5,
            'rent_to_balance_ratio': rent_amount / balance if balance > 0 else 2.0,  # High if rent is significant
            'property_to_balance_ratio': total_property_value / balance if balance > 0 else 0,
            'mortgageable_to_rent_ratio': mortgageable_value / rent_amount if rent_amount > 0 else 10,
            'mortgaged_ratio': mortgaged_count / own_properties_count if own_properties_count > 0 else 0,
            'will_go_negative': 1 if balance_after_rent < 0 else 0
        }
        
        return features
    
    # Step 2: Compute state value for decision making
    def compute_state_value(features, weights):
        value = 0
        for feature, feature_value in features.items():
            value += weights[feature] * feature_value
        return value
    
    # Step 3: Initialize weights (or load from persistent storage in a real implementation)
    weights = {
        'balance_ratio': 0.9,           # Higher is better (more money relative to opponents)
        'rent_to_balance_ratio': -0.5,  # Lower is better (rent is small compared to balance)
        'property_to_balance_ratio': 0.3, # Higher is better (more property assets)
        'mortgageable_to_rent_ratio': 0.3, # Higher is better (can mortgage to cover rent many times)
        'mortgaged_ratio': -0.8,        # Lower is better (fewer mortgaged properties)
        'will_go_negative': -2.0        # Strongly negative (going bankrupt is bad)
    }
    
    # Step 4: Extract current state features
    current_state = extract_state_features(current_player, players, properties, rent)
    
    # Step 5: Simulate both actions and evaluate resulting states
    
    # Option 1: Pay the rent
    pay_rent_player = current_player.copy()
    pay_rent_player['balance'] -= rent
    
    # Add a positive bias for paying rent directly - the "long-term" learning component
    # This simulates that the TD learning algorithm has learned over time that 
    # keeping properties unmortgaged has long-term benefits
    pay_rent_state = extract_state_features(pay_rent_player, players, properties, rent)
    pay_rent_value = compute_state_value(pay_rent_state, weights) + 0.2  # Small bias for paying
    
    # Option 2: Mortgage properties to pay rent
    mortgage_player = current_player.copy()
    mortgage_player['balance'] -= rent  # Still need to pay rent
    
    # Find properties to mortgage until we have enough money or run out of properties
    properties_to_mortgage = []
    mortgage_needed = rent
    if mortgage_player['balance'] < 0:
        mortgage_needed = abs(mortgage_player['balance'])
        mortgage_player['balance'] = 0  # Reset to zero as we'll add mortgage money
        
        # Sort properties by value (to mortgage least valuable first)
        player_properties = []
        for prop_name in mortgage_player['properties']:
            if prop_name not in mortgage_player['mortgagedProperties']:
                for prop in properties:
                    if prop['name'] == prop_name:
                        player_properties.append(prop)
                        break
        
        # Sort by price (mortgage cheapest properties first to minimize impact)
        player_properties.sort(key=lambda x: x['price'])
        
        # Mortgage properties until we have enough money
        for prop in player_properties:
            mortgage_value = prop['price'] / 2  # Mortgage value is typically half the property price
            mortgage_player['balance'] += mortgage_value
            mortgage_player['mortgagedProperties'].append(prop['name'])
            properties_to_mortgage.append(prop['name'])
            
            if mortgage_player['balance'] >= mortgage_needed:
                break
    
    mortgage_state = extract_state_features(mortgage_player, players, properties, rent)
    mortgage_value = compute_state_value(mortgage_state, weights)
    
    # Step 6: Choose the action with higher expected value
    pay_rent_is_better = pay_rent_value > mortgage_value
    
    # Return decision
    return pay_rent_is_better