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
        title: "Advance to P13",
        description: "If you pass Go, collect $200",
        functionality: (player: any, setPlayer: any, players: any) => {
            const newPos = 19;
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
        description: "Pay $25 per house",
        functionality: (player: any, setPlayer: any, players: any) => {
            let total = Object.keys(player.houses).length * 25;
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance - total,
            }));
        },
    },
    {
        title: "Advance to P14",
        description: "Move to P14",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 20,
            }));
        },
    },
    {
        title: "Advance to P10",
        description: "Move to P10",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                position: 14,
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
                position: 6,
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
        description: "Pay $15",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({
                ...prev,
                balance: prev.balance - 15,
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
            setPlayer((prev: any) => ({ ...prev, position: 6, inJail: true }));
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
        description: "$40 per house",
        functionality: (player: any, setPlayer: any, players: any) => {
            let total = Object.keys(player.houses).length * 40;
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance - total }));
        },
    },
    {
        title: "Receive for Services",
        description: "Collect $25",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 25 }));
        },
    },
    {
        title: "Income Tax Refund",
        description: "Collect $20",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 20 }));
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
        description: "You get $45",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 45 }));
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
        description: "Collect $10",
        functionality: (player: any, setPlayer: any, players: any) => {
            setPlayer((prev: any) => ({ ...prev, balance: prev.balance + 10 }));
        },
    },
];