import random
from algos.Josh import run_mcts_for_jail_decision
from algos.Omar import run_td_learning_for_pay_rent_decision
from algos.utils import run_ucb1_for_buying_decision, run_expectimax_for_roll_decision
from algos.utils import run_heurisitc_search_choose_property_to_mortgage

def generate_dummy_player(name="Player 1"):
    return {
        "name": name,
        "avatar": "avatar_1.png",
        "balance": random.randint(100, 2000),
        "position": random.randint(0, 23),
        "properties": [],
        "houses": {},
        "inJail": random.choice([True, False]),
        "getOutOfJailCards": random.randint(0, 1),
        "turnsInJail": random.randint(0, 2),
        "mortgagedProperties": [],
        "bankrupt": False,
        "tradeOffers": []
    }

def generate_dummy_properties():
    colors = ['#FF69B4', '#FFA500', '#2acb1a', '#2365d9', '#a84ecf']
    return [
        {
            "name": f"P{i+1}",
            "index": i,
            "price": random.randint(100, 300),
            "rent": random.randint(10, 80),
            "rentOneHouse": random.randint(30, 100),
            "rentTwoHouses": random.randint(60, 150),
            "rentThreeHouses": random.randint(90, 200),
            "OneHouseCost": random.randint(50, 150),
            "houses": 0,
            "owner": None,
            "mortgaged": False,
            "color": random.choice(colors)
        }
        for i in range(24)
    ]

async def main():
    print("Which algorithm would you like to test?")
    print("1. MCTS (jail decision)")
    print("2. Expectimax (roll risk)")
    print("3. TD-Learning (should pay rent)")
    print("4. UCB1 (should buy property)")
    print("5. Heuristic (mortgage decision)")
    
    choice = input("Enter number (1–5): ")

    current_player = generate_dummy_player()
    players = [generate_dummy_player(f"Player {i+1}") for i in range(4)]
    properties = generate_dummy_properties()

    if choice == "1":
        print("Testing MCTS (jail decision)...")
        current_player["inJail"] = True
        decision = await run_mcts_for_jail_decision(current_player, players, properties)
        print("MCTS chose:", decision)

    elif choice == "2":
        print("Testing Expectimax (roll risk)...")
        value = await run_expectimax_for_roll_decision(current_player, players, properties)
        print("Expectimax score (higher = better roll):", value)

    elif choice == "3":
        print("Testing TD-Learning (should pay rent)...")
        rent = random.randint(30, 150)
        decision = await run_td_learning_for_pay_rent_decision(current_player, players, properties, rent)
        if decision:
            print(f"TD-Learning says 'PAY' for rent {rent}")
        else:
            print(f"TD-Learning says 'MORTGAGE' for rent {rent}")

    elif choice == "4":
        print("Testing UCB1 (should buy property)...")
        property_to_consider = random.choice(properties)
        decision = await run_ucb1_for_buying_decision(current_player, players, properties, property_to_consider)
        if decision:
            print(f"UCB1 says 'BUY' for {property_to_consider['name']}")
        else:
            print(f"UCB1 says 'SKIP' for {property_to_consider['name']}")

    elif choice == "5":
        print("Testing Heuristic (mortgage decision)...")
        for p in properties[:3]:
            p["owner"] = current_player["name"]
            current_player["properties"].append(p["name"])

        prop_to_mortgage = await run_heurisitc_search_choose_property_to_mortgage(current_player, players, properties)
        if prop_to_mortgage:
            print(f"Heuristic suggests mortgaging: {prop_to_mortgage['name']}")
        else:
            print("No suitable property to mortgage.")

    else:
        print("Invalid choice.")


if __name__ == "__main__":
    main()