
// This file contains the definitions for Chance and Community Chest cards in a Monopoly game.

// Defining Chance cards with their titles, descriptions, and functionalities
export const chanceCards = [
    {
        title: "Advance to Go",
        description: "Collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 0,
                balance: prev.balance + 200,
            }));
        },
    },
    {
        title: "Advance to P7",
        description: "If you pass Go, collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            const newPos = 13;
            const passedGo = player.position > newPos;
            setPlayer((prev: any) => ({
                ...prev,
                position: newPos,
                balance: prev.balance + (passedGo ? 200 : 0),
            }));
        },
    },
    {
        title: "Make General Repairs",
        description: "Pay $50 per house",
        functionality: (player: any, setPlayer: any, players: any) => {
            let total = Object.keys(player.houses).length * 50;
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance - total,
            }));
        },
    },
    {
        title: "Advance to P8",
        description: "Move to P8",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 15,
            }));
        },
    },
    {
        title: "Advance to P5",
        description: "Move to P5",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 9,
            }));
        },
    },
    {
        title: "Get Out of Jail Free",
        description: "Keep until needed or sold",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                getOutOfJailCards: prev.getOutOfJailCards + 1,
            }));
        },
    },
    {
        title: "Go Directly to Jail",
        description: "Do not pass Go, do not collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 4,
                inJail: true,
            }));
        },
    },
    {
        title: "Your Loan Matures",
        description: "Collect $150",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance + 150,
            }));
        },
    },
    {
        title: "Bank Pays You Dividend",
        description: "Collect $50",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance + 50,
            }));
        },
    },
    {
        title: "Elected Chairman of the Board",
        description: "Pay each player $50",
        functionality: (player: any, setPlayer: any, players: any) => {
            const total = 50 * (players.length - 1);
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance - total,
            }));

            players.forEach((p: any) => {
                if (p.player.name !== player.name) {
                    p.setPlayer((prev: any) => ({
                        ...prev,
                        balance: prev.balance + 50,
                    }));
                }
            });
        },
    },
    {
        title: "Pay Poor Tax",
        description: "Pay $100",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance - 100,
            }));
        },
    },
    {
        title: "Go Back 3 Spaces",
        description: "Move back 3 spaces",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: prev.position - 3,
            }));
        },
    },
];

// Defining Community Chest cards with their titles, descriptions, and functionalities
export const communityChestCards = [
    {
        title: "Grand Opera Opening",
        description: "Collect $50 from every player",
        functionality: (player: any, setPlayer: any, players: any) => {
            const total = 50 * (players.length - 1);
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + total }));
            players.forEach((p: any) => {
                if (p.player.name !== player.name) {
                    p.setPlayer((prev: any) => ({ ...prev, balance: prev.balance - 50 }));
                }
            });
        },
    },
    {
        title: "Xmas Fund Matures",
        description: "Collect $100",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 100 }));
        },
    },
    {
        title: "Go to Jail",
        description: "Do not pass Go, do not collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, position: 4, inJail: true }));
        },
    },
    {
        title: "Get Out of Jail Free",
        description: "This card may be kept until needed or sold",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, getOutOfJailCards: prev.getOutOfJailCards + 1 }));
        },
    },
    {
        title: "Advance to Go",
        description: "Collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, position: 0, balance: prev.balance + 200 }));
        },
    },
    {
        title: "Assessed for Street Repairs",
        description: "$50 per house",
        functionality: (player: any, setPlayer: any, players: any) => {
            let total = Object.keys(player.houses).length * 50;
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance - total }));
        },
    },
    {
        title: "Receive for Services",
        description: "Collect $75",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 75 }));
        },
    },
    {
        title: "Income Tax Refund",
        description: "Collect $75",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 75 }));
        },
    },
    {
        title: "Pay Hospital",
        description: "Pay $100",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance - 100 }));
        },
    },
    {
        title: "Life Insurance Matures",
        description: "Collect $100",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 100 }));
        },
    },
    {
        title: "You Inherit",
        description: "Collect $100",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 100 }));
        },
    },
    {
        title: "Pay School Tax",
        description: "Pay $150",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance - 150 }));
        },
    },
    {
        title: "From Sale of Stock",
        description: "You get $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 200 }));
        },
    },
    {
        title: "Bank Error in Your Favor",
        description: "Collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 200 }));
        },
    },
    {
        title: "Doctor’s Fee",
        description: "Pay $50",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance - 50 }));
        },
    },
    {
        title: "Second Prize in Beauty Contest",
        description: "Collect $150",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 150 }));
        },
    },
];