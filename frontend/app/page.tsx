'use client'

import Board from "@/components/shared/Board";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { chanceCards, communityChestCards } from "./cards";
import { Button } from "@/components/ui/button";
import next from "next";

const initialStats = {
  balance: 1500,
  position: 0,
  properties: [],
  houses: {},
  inJail: false,
  getOutOfJailCards: 0,
  turnsInJail: 0,
  bankrupt: false,
  skipTurnCount: 3
}

export default function Home() {

  const [player1, setPlayer1] = useState<any>({ ...initialStats, name: "Player", avatar: 'avatar_1.png' });
  const [player2, setPlayer2] = useState<any>({ ...initialStats, name: "AI", avatar: 'avatar_2.png' });
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [turn, setTurn] = useState(1);
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [properties, setProperties] = useState([
    { name: "P1", index: 1,  price: 100, rent: 50, rentOneHouse: 100, rentTwoHouses: 200, rentThreeHouses: 300, OneHouseCost: 100, houses: 0, owner: null, color: '#2acb1a', mortgaged: false },
    { name: "P2", index: 3,  price: 150, rent: 60, rentOneHouse: 120, rentTwoHouses: 240, rentThreeHouses: 360, OneHouseCost: 150, houses: 0, owner: null, color: '#2365d9', mortgaged: false },
    { name: "P3", index: 5,  price: 200, rent: 70, rentOneHouse: 140, rentTwoHouses: 280, rentThreeHouses: 420, OneHouseCost: 200, houses: 0, owner: null, color: '#FF69B4', mortgaged: false },
    { name: "P4", index: 7,  price: 250, rent: 80, rentOneHouse: 160, rentTwoHouses: 320, rentThreeHouses: 480, OneHouseCost: 250, houses: 0, owner: null, color: '#FFA500', mortgaged: false },
    { name: "P5", index: 9,  price: 160, rent: 55, rentOneHouse: 110, rentTwoHouses: 220, rentThreeHouses: 330, OneHouseCost: 160, houses: 0, owner: null, color: '#a84ecf', mortgaged: false },
    { name: "P6", index: 11, price: 110, rent: 65, rentOneHouse: 130, rentTwoHouses: 260, rentThreeHouses: 390, OneHouseCost: 110, houses: 0, owner: null, color: '#2acb1a', mortgaged: false },
    { name: "P7", index: 13, price: 260, rent: 75, rentOneHouse: 150, rentTwoHouses: 300, rentThreeHouses: 450, OneHouseCost: 260, houses: 0, owner: null, color: '#FFA500', mortgaged: false },
    { name: "P8", index: 15, price: 210, rent: 85, rentOneHouse: 170, rentTwoHouses: 340, rentThreeHouses: 510, OneHouseCost: 210, houses: 0, owner: null, color: '#FF69B4', mortgaged: false },
  ]);

  const [landedProperty, setLandedProperty] = useState<any>(null);
  const [chanceCard, setChanceCard] = useState<any>(null);
  const [communityChestCard, setCommunityChestCard] = useState<any>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [inJailDialog, setinJailDialog] = useState(true);
  const [gameDialog, setGameDialog] = useState<any>({ avatar: null, description: null });


  const players = [
    { player: player1, setPlayer: setPlayer1 },
    { player: player2, setPlayer: setPlayer2 },
  ];

  const currentPlayer = players[currentPlayerIndex].player;

  useEffect(() => {
    async function handleGameTurns() {
      if (turn == 1) {
        setGameDialog({ avatar: '3', description: 'Game Started' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(200);
      } else if (turn > 1 && turn % 2 === 0) {
        setGameDialog({ avatar: '1', description: 'Player turn ended' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(200);
        setGameDialog({ avatar: '2', description: 'AI turn started' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });

        AITurn();
      } else if (turn > 1 && turn % 2 != 0) {
        setGameDialog({ avatar: '2', description: 'AI turn ended' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(200);
        setGameDialog({ avatar: '1', description: 'Player turn started' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(200);
        setinJailDialog(true);
      }
    }

    handleGameTurns();
  }, [turn]);

  const rollDice = () => {
    const player = player1;
    const setPlayer = setPlayer1

    setVisible(true);

    const rollingInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollingInterval);
      const dice1 = Math.floor(Math.random() * 6) + 1;
      const dice2 = Math.floor(Math.random() * 6) + 1;
      setDiceValues([dice1, dice2]);

      if (player.inJail && (dice1 != dice2)) {
        setPlayer((prev: any) => ({
          ...prev,
          turnsInJail: prev.turnsInJail + 1
        }));
        setTimeout(() => {
          setVisible(false);
        }, 3000);
        return;
      } else if (player.inJail && (dice1 == dice2)) {
        setPlayer((prev: any) => ({
          ...prev,
          turnsInJail: 0,
          inJail: false
        }));
      }

      const diceRoll = dice1 + dice2;
      let newPosition = (player.position + diceRoll) % 16;

      let currentPos = player.position;
      const moveInterval = setInterval( async () => {
        if (currentPos !== newPosition) {
          currentPos = (currentPos + 1) % 16;
          setPlayer((prev: any) => ({
            ...prev,
            position: currentPos,
          }));
        } else {
          clearInterval(moveInterval);
          setTimeout(() => setVisible(false), 1000);

          const property = properties.find(p => p.index === newPosition);
          if (property) {
            setLandedProperty({ player, setPlayer, property });
          } else if (newPosition == 6 || newPosition == 14) {
            const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
            setChanceCard(card)
            card.functionality(player, setPlayer, players);
          } else if (newPosition == 2 || newPosition == 10) {
            const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
            setChanceCard(card)
            card.functionality(player, setPlayer, players);
          } else if (newPosition == 12) {
            setPlayer((prev: any) => ({
              ...prev,
              inJail: true,
              position: 4,
              turnsInJail: 0,
            }));
            setinJailDialog(false)
            setGameDialog({ avatar: '2', description: 'Player is in Jail' });
            await sleep(1500);
            setGameDialog({ avatar: null, description: null });
            await sleep(300);
          }
        }
      }, 250);
    }, 1500);

  };


  const nextTurn = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
    setTurn((prev) => prev + 1); // No AITurn here
  };

  const buyProperty = (landedProperty: any) => {
    if (landedProperty.player.balance >= landedProperty.property.price) {
      landedProperty.setPlayer((prev: any) => ({
        ...prev,
        balance: prev.balance - landedProperty.property.price,
        properties: [...prev.properties, landedProperty.property.name],
      }));

      setProperties(prev =>
        prev.map(p =>
          p.name === landedProperty.property.name
            ? { ...p, owner: landedProperty.player.name }
            : p
        )
      );
    }
    setLandedProperty(null);
  };

  const payRent = async (landedProperty: any) => {
    let rentAmount;

    switch (landedProperty.property.houses) {
      case 1: rentAmount = landedProperty.property.rentOneHouse; break;
      case 2: rentAmount = landedProperty.property.rentTwoHouses; break;
      case 3: rentAmount = landedProperty.property.rentThreeHouses; break;
      default: rentAmount = landedProperty.property.rent; break;
    }

    const tenant = landedProperty.player;
    const owner = players.find((p: any) => p.player.name === landedProperty.property.owner);

    if (!owner) return;

    if (tenant.balance >= rentAmount) {
      landedProperty.setPlayer((prev: any) => ({
        ...prev,
        balance: prev.balance - rentAmount
      }));

      // Give money to the property owner
      if (owner.player.name === "Player") setPlayer1((prev: any) => ({ ...prev, balance: prev.balance + rentAmount }));
      if (owner.player.name === "AI") setPlayer2((prev: any) => ({ ...prev, balance: prev.balance + rentAmount }));

      if (player1.balance < 0){
        setPlayer1((prev: any) => ({ ...prev, bankrupt: true, balance: 0, properties: [] }));
        setGameDialog({ avatar: '1', description: `Player is Bankrupt` });
        await sleep(1500);
        setGameDialog({ avatar: '2', description: `AI Wins!` });
        await sleep(300);
        return;
      }

      setLandedProperty(null);
    }
  };

  const upgradeProperty = (player: any, setPlayer: any, property: any) => {
    if (!property || !player) return;

    // Check if the player owns all properties of this color

    if (property.houses >= 3) {
      alert("You can't build more than 3 houses on a property!");
      return;
    }

    if (player.balance < property.OneHouseCost) {
      alert("Not enough balance to buy a house!");
      return;
    }

    // Deduct house cost and add a house
    setPlayer((prev: any) => ({
      ...prev,
      balance: prev.balance - property.OneHouseCost
    }));

    setProperties(prev =>
      prev.map(p =>
        p.name === property.name ? { ...p, houses: p.houses + 1 } : p
      )
    );
  };

  const checkRent = (landedProperty: any) => {
    switch (landedProperty.property.houses) {
      case 1: return landedProperty.property.rentOneHouse;
      case 2: return landedProperty.property.rentTwoHouses;
      case 3: return landedProperty.property.rentThreeHouses;
      default: return landedProperty.property.rent;
    }
  }

  const handleEndTurn = (player: number) => {
    nextTurn()
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const AITurn = async () => {
    console.log("AI Turn")
    const { player, setPlayer } = players[1];
    if (player.bankrupt) return;

    if (player.inJail) {
      const jailOptions = [];

      if (player.turnsInJail < 3) jailOptions.push('rollDouble');
      if (player.balance >= 50) jailOptions.push('payFine');
      if (player.getOutOfJailCards > 0) jailOptions.push('useCard');

      setLoading(true);
      setinJailDialog(false)
      await sleep(2000);

      const result = await fetch('http://127.0.0.1:8000/ai/mcts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_player: player,
          players: players.map(p => p.player),
          properties: properties,
          jail_options: jailOptions
        })
      });

      const chosen = await result.json()
      setLoading(false);

      await sleep(500);

      if (chosen === 1) {
        setGameDialog({ avatar: '2', description: 'AI decided to Roll Twice' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(300);
        setinJailDialog(false);
        setVisible(true);
        let intervalId;

        intervalId = setInterval(() => {
          setDiceValues([
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
          ]);
        }, 100);

        await sleep(1500);
        clearInterval(intervalId);

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        setDiceValues([dice1, dice2]);
        await sleep(1000);
        setVisible(false);

        if (dice1 !== dice2) {
          setPlayer((prev: any) => ({
            ...prev,
            turnsInJail: prev.turnsInJail + 1,
          }));
          nextTurn()
          return;
        } else {
          setPlayer((prev: any) => ({
            ...prev,
            inJail: false,
            turnsInJail: 0,
          }));

          const diceRoll = dice1 + dice2;
          const newPosition = (player.position + diceRoll) % 16;

          let currentPos = player.position;
          while (currentPos !== newPosition) {
            currentPos = (currentPos + 1) % 16;
            setPlayer((prev: any) => ({
              ...prev,
              position: currentPos,
            }));
            await sleep(250);
          }

          const property = properties.find(p => p.index === newPosition);

          if (property) {
            if (!property.owner && property.price <= player.balance) {

              setLoading(true);
              const response = await fetch('http://127.0.0.1:8000/ai/ucb1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  current_player: player,
                  players: players.map(p => p.player),
                  properties,
                  property_to_consider: property
                })
              });

              const shouldBuy = await response.json();

              setLoading(false);

              if (shouldBuy) {

                setGameDialog({ avatar: '2', description: 'AI decided to Buy the Property' });
                await sleep(1500);
                setGameDialog({ avatar: null, description: null });
                await sleep(300);

                setPlayer((prev: any) => ({
                  ...prev,
                  balance: prev.balance - property.price,
                  properties: [...prev.properties, property.name],
                }));
                setProperties(prev =>
                  prev.map(p => p.name === property.name ? { ...p, owner: player.name } : p)
                );
              } else {
                setGameDialog({ avatar: '2', description: 'AI decided to Skip Buying the Property' });
                await sleep(1500);
                setGameDialog({ avatar: null, description: null });
                await sleep(300);
              }
            } else if (property.owner !== player.name) {
              // Pay Rent + TD-learning could learn from bad decisions
              const rent = checkRent({ property });
              const ownerObj = players.find(p => p.player.name === property.owner);
              if (!ownerObj) return;

              if (player.balance >= rent) {
                setPlayer((prev: any) => ({ ...prev, balance: prev.balance - rent }));
                ownerObj.setPlayer((prev: any) => ({ ...prev, balance: prev.balance + rent }));
                setGameDialog({ avatar: '2', description: `AI paid $${rent} rent` });
                await sleep(1500);
                setGameDialog({ avatar: null, description: null });
                await sleep(300);
              } else {
                setPlayer((prev: any) => ({ ...prev, bankrupt: true, balance: 0, properties: [] }));
                setGameDialog({ avatar: '2', description: `AI is Bankrupt` });
                await sleep(1500);
                setGameDialog({ avatar: '1', description: `Player Wins!` });
                await sleep(300);
                return;
              }
            } else if (property.owner == player.name && property.houses < 3 && player.balance >= property.OneHouseCost) {
              setLoading(true);
              const shouldBuild = await fetch('http://127.0.0.1:8000/ai/expectimax-building', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  current_player: player,
                  players: players.map(p => p.player),
                  property: property,
                  properties: properties
                })
              });

              const decision = await shouldBuild.json();

              setLoading(false);

              if (decision) {
                setGameDialog({ avatar: '2', description: 'AI decided to Build a new house' });
                await sleep(1500);
                setGameDialog({ avatar: null, description: null });
                await sleep(300);

                setPlayer((prev: any) => ({
                  ...prev,
                  balance: prev.balance - property.OneHouseCost
                }));

                setProperties(prev =>
                  prev.map(p =>
                    p.name === property.name ? { ...p, houses: p.houses + 1 } : p
                  )
                );
              } else {
                setGameDialog({ avatar: '2', description: 'AI decided to Skip Building a new house' });
                await sleep(1500);
                setGameDialog({ avatar: null, description: null });
                await sleep(300);
              }
            }
          } else if ([6, 14].includes(newPosition)) {
            const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
            setChanceCard(card);
            card.functionality(player, setPlayer, players);
          } else if ([2, 10].includes(newPosition)) {
            const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
            setCommunityChestCard(card);
            card.functionality(player, setPlayer, players);
          } else if (newPosition == 12) {
            setGameDialog({ avatar: '2', description: 'AI is in Jail' });
            await sleep(1500);
            setGameDialog({ avatar: null, description: null });
            await sleep(300);

            setPlayer((prev: any) => ({
              ...prev,
              inJail: true,
              position: 4,
              turnsInJail: 0,
            }));
            setinJailDialog(false)
          }

          nextTurn()
          await sleep(800);
        }
      } else if (chosen === 2 && player.balance >= 50) {
        setinJailDialog(false);
        setGameDialog({ avatar: '2', description: 'AI decided to Pay $50 Fee' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(300);
        setPlayer((prev: any) => ({
          ...prev,
          balance: prev.balance - 50,
          inJail: false,
          turnsInJail: 0,
        }));
        nextTurn()
        return;
      } else if (chosen === 3 && player.getOutOfJailCards > 0) {
        setGameDialog({ avatar: '2', description: 'AI decided use Get out of Jail Card' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(300);
        setinJailDialog(false);
        setPlayer((prev: any) => ({
          ...prev,
          getOutOfJailCards: prev.getOutOfJailCards - 1,
          inJail: false,
          turnsInJail: 0,
        }));
        nextTurn()
        return;
      }
    }

    if (player.skipTurnCount > 0) {
      setLoading(true);
      const expectimaxResult = await fetch('http://127.0.0.1:8000/ai/expectimax-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_player: player,
          players: players.map(p => p.player),
          properties: properties
        })
      });

      const expectedLoss = await expectimaxResult.json();
      setLoading(false);

      if (expectedLoss < 300) {
        setGameDialog({ avatar: '2', description: 'AI decided to Skip Thier Turn' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(300);

        setPlayer((prev: any) => ({
          ...prev,
          skipTurnCount: prev.skipTurnCount - 1,
        }));

        nextTurn()
        return;
      } else {
        setGameDialog({ avatar: '2', description: 'AI decided to Roll the Dice' });
        await sleep(1500);
        setGameDialog({ avatar: null, description: null });
        await sleep(300);
        setinJailDialog(true);
      }
    }

    setVisible(true);
    let rollInterval;

    rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
    }, 100);

    await sleep(1500);
    clearInterval(rollInterval);

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    setDiceValues([dice1, dice2]);
    await sleep(1000);
    setVisible(false);

    const diceRoll = dice1 + dice2;
    const newPosition = (player.position + diceRoll) % 16;

    let currentPos = player.position;
    while (currentPos !== newPosition) {
      currentPos = (currentPos + 1) % 16;
      setPlayer((prev: any) => ({
        ...prev,
        position: currentPos,
      }));
      await sleep(250);
    }

    const property = properties.find(p => p.index === newPosition);

    if (property) {
      if (!property.owner && property.price <= player.balance) {

        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/ai/ucb1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_player: player,
            players: players.map(p => p.player),
            properties,
            property_to_consider: property
          })
        });

        const shouldBuy = await response.json();

        setLoading(false);

        if (shouldBuy) {

          setGameDialog({ avatar: '2', description: 'AI decided to Buy the Property' });
          await sleep(1500);
          setGameDialog({ avatar: null, description: null });
          await sleep(300);

          setPlayer((prev: any) => ({
            ...prev,
            balance: prev.balance - property.price,
            properties: [...prev.properties, property.name],
          }));
          setProperties(prev =>
            prev.map(p => p.name === property.name ? { ...p, owner: player.name } : p)
          );
        } else {
          setGameDialog({ avatar: '2', description: 'AI decided to Skip Buying the Property' });
          await sleep(1500);
          setGameDialog({ avatar: null, description: null });
          await sleep(300);
        }
      } else if (property.owner !== player.name) {
        // Pay Rent + TD-learning could learn from bad decisions
        const rent = checkRent({ property });
        const ownerObj = players.find(p => p.player.name === property.owner);
        if (!ownerObj) return;

        if (player.balance >= rent) {
          setPlayer((prev: any) => ({ ...prev, balance: prev.balance - rent }));
          ownerObj.setPlayer((prev: any) => ({ ...prev, balance: prev.balance + rent }));
        } else {
          setPlayer((prev: any) => ({ ...prev, bankrupt: true, balance: 0, properties: [] }));
        }
      } else if (property.owner == player.name && property.houses < 3 && player.balance >= property.OneHouseCost) {
        setLoading(true);
        const shouldBuild = await fetch('http://127.0.0.1:8000/ai/expectimax-building', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_player: player,
            players: players.map(p => p.player),
            property: property,
            properties: properties
          })
        });

        const decision = await shouldBuild.json();

        setLoading(false);

        if (decision) {
          setGameDialog({ avatar: '2', description: 'AI decided to Build a new house' });
          await sleep(1500);
          setGameDialog({ avatar: null, description: null });
          await sleep(300);

          setPlayer((prev: any) => ({
            ...prev,
            balance: prev.balance - property.OneHouseCost
          }));

          setProperties(prev =>
            prev.map(p =>
              p.name === property.name ? { ...p, houses: p.houses + 1 } : p
            )
          );
        } else {
          setGameDialog({ avatar: '2', description: 'AI decided to Skip Building a new house' });
          await sleep(1500);
          setGameDialog({ avatar: null, description: null });
          await sleep(300);
        }
      }
    } else if ([6, 14].includes(newPosition)) {
      const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
      setChanceCard(card);
      card.functionality(player, setPlayer, players);
    } else if ([2, 10].includes(newPosition)) {
      const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
      setCommunityChestCard(card);
      card.functionality(player, setPlayer, players);
    } else if (newPosition == 12) {
      setGameDialog({ avatar: '2', description: 'AI is in Jail' });
      await sleep(1500);
      setGameDialog({ avatar: null, description: null });
      await sleep(300);

      setPlayer((prev: any) => ({
        ...prev,
        inJail: true,
        position: 4,
        turnsInJail: 0,
      }));
      setinJailDialog(false)
    }

    nextTurn()
    await sleep(800);
  };

  const breakOutOfJail = (method: string) => {
    const player = players.filter(player => player.player.name === currentPlayer.name)

    if (method == 'rollDouble') {
      setinJailDialog(false)
      rollDice()
    } else if (method == 'payFine') {
      player[0].setPlayer((prev: any) => ({ ...prev, balance: prev.balance - 50, turnsInJail: 0, inJail: false }))
    } else if (method == 'useCard') {
      player[0].setPlayer((prev: any) => ({ ...prev, getOutOfJailCards: prev.getOutOfJailCards - 1, turnsInJail: 0, inJail: false }))
    }
  }

  const generateScenario = () => {
    const allProperties = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
    const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);
    const shuffledProperties = shuffle(allProperties);

    // Random number of total owned properties: between 2 and 7 (leaving some unowned)
    const totalOwned = Math.floor(Math.random() * 6) + 2;

    const ownedProperties = shuffledProperties.slice(0, totalOwned);
    const unownedProperties = shuffledProperties.slice(totalOwned);

    // Randomly decide how many of the owned properties go to Player 1
    const player1Count = Math.floor(Math.random() * totalOwned);
    const player1Properties = ownedProperties.slice(0, player1Count);
    const player2Properties = ownedProperties.slice(player1Count);

    const randomBalance1 = () => Math.floor(Math.random() * 1600) + 400; // 800–1200
    const randomBalance2 = () => Math.floor(Math.random() * 1600) + 400; // 800–1200

    const randomHouses = () => Math.floor(Math.random() * 3); // 0–4 houses

    setPlayer1({
      ...initialStats,
      name: "Player",
      avatar: "avatar_1.png",
      balance: randomBalance1(),
      position: Math.floor(Math.random() * 10),
      properties: player1Properties,
      houses: {},
      inJail: false,
      bankrupt: false,
    });

    setPlayer2({
      ...initialStats,
      name: "AI",
      avatar: "avatar_2.png",
      balance: randomBalance2(),
      position: Math.floor(Math.random() * 10),
      properties: player2Properties,
      houses: {},
      inJail: false,
      bankrupt: false,
    });

    setProperties((prev: any) =>
      prev.map((p: any) => {
        if (player1Properties.includes(p.name)) return { ...p, owner: "Player", houses: randomHouses() };
        if (player2Properties.includes(p.name)) return { ...p, owner: "AI", houses: randomHouses() };
        return { ...p, owner: null, houses: 0 };
      })
    );

    setCurrentPlayerIndex(0);
    setTurn(1);
  };


  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bg-move-2.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-10 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-row justify-center items-center py-2 rounded-lg gap-3 relative">
          <div className="absolute top-[220px] left-[-300px] flex flex-col justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[175px] w-[175px]" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }}>
            <p className="text-white font-semibold text-[20px]">Player Turn</p>
            <Image src={`/${currentPlayer.avatar}`} alt="avatar" height={75} width={75} />
            <p className="text-white font-semibold text-[20px]">{currentPlayer.name}</p>
          </div>
          <div className="absolute top-[450px] left-[-300px] flex flex-col justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[175px] w-[175px]" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }}>
            <p className="text-white font-semibold text-[20px]">Current Round</p>
            <p className="text-yellow-500 font-semibold text-[50px]">{turn}</p>
          </div>
          <div className="absolute top-[350px] right-[-300px] flex flex-col justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[175px] w-[175px] cursor-pointer" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }} onClick={generateScenario}>
            <Image src={`/scenario.png`} alt="avatar" height={400} width={400} className="h-[200px] w-[200px]" />
          </div>
          <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[300px]" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }}>
            <Image src={'/balance.png'} alt="money" className="h-[75px] w-[120px]" height={200} width={200} />
            <p className="text-[20px] text-white font-semibold">${(player2.balance).toLocaleString()}</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[300px] cursor-pointer" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }} onClick={() => handleEndTurn(2)}>
            <Image src={'/hand.png'} alt="money" className="h-[80px] w-[90px]" height={200} width={200} />
            <p className="text-[20px] text-white font-semibold">End Turn</p>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-10 relative">
          <Board properties={properties} players={players} />
          {gameDialog.avatar &&
            <div className={`absolute top-56 h-[150px] w-[400px] flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 fade-in`} style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover', animation: 'fadeIn 0.3s ease-in-out' }}>
              <Image src={`/avatar_${gameDialog.avatar}.png`} alt="avatar" height={200} width={200} className="aspect-square w-1/3 rounded-lg" />
              <p className="text-[20px] text-white font-semibold w-2/3 text-center">{gameDialog.description}</p>
            </div>
          }
        </div>
        <div className="flex flex-row justify-center items-center py-2 rounded-lg gap-3">
          <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px]" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }}>
            <Image src={'/balance.png'} alt="money" className="h-[75px] w-[120px]" height={200} width={200} />
            <p className="text-[20px] text-white font-semibold">${(player1.balance).toLocaleString()}</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px] cursor-pointer" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }} onClick={() => handleEndTurn(1)}>
            <Image src={'/hand.png'} alt="money" className="h-[80px] w-[90px]" height={200} width={200} />
            <p className="text-[20px] text-white font-semibold">End Turn</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px]" style={{ backgroundColor: 'rgba(100, 22, 159, 0.5)' }} onClick={() => rollDice()}>
            <Image src={'/dice.png'} alt="money" className="h-[100px] w-[100px]" height={200} width={200} />
            <p className="text-[20px] text-white font-semibold">Roll</p>
          </div>
        </div>
        {(landedProperty && !landedProperty.property.owner) &&
          <AlertDialog open={true} onOpenChange={() => setLandedProperty(null)}>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-500 w-[180px] text-[25px] font-bold text-center rounded-md">{landedProperty.property.name} is for sale</AlertDialogTitle>
                <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                  <p>RENT ${landedProperty.property.rent}</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 1 House</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentOneHouse}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full my-1">
                    <p className="w-1/2 text-center">With 2 House</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentTwoHouses}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 3 House</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentThreeHouses}</p>
                  </div>
                  <p>---------------------------</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">One House Cost</p>
                    <p className="w-1/2 text-center">${landedProperty.property.OneHouseCost}</p>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-[16px]" onClick={() => setLandedProperty(null)}>No</AlertDialogCancel>
                <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => buyProperty(landedProperty)}>Buy for ${landedProperty.property.price}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        {chanceCard &&
          <AlertDialog open={true} onOpenChange={() => setChanceCard(null)}>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-500 w-[180px] text-[25px] font-bold text-center rounded-md">Chance Cards!</AlertDialogTitle>
                {chanceCard && <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                  <p className="text-center text-[21px]">{chanceCard.title}</p>
                  <p className="text-center text-[21px]">{chanceCard.description}</p>
                </div>}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-[16px]" onClick={() => setChanceCard(null)}>Ok</AlertDialogCancel>
                {/* <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => buyProperty(landedProperty)}>Buy for ${landedProperty.property.price}</AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        {communityChestCard &&
          <AlertDialog open={true} onOpenChange={() => setCommunityChestCard(null)}>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-400 w-[180px] text-[25px] font-bold text-center rounded-md">Chance Cards!</AlertDialogTitle>
                {communityChestCard && <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                  <p className="text-center text-[21px]">{communityChestCard.title}</p>
                  <p className="text-center text-[21px]">{communityChestCard.description}</p>
                </div>}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-[16px]" onClick={() => setCommunityChestCard(null)}>Ok</AlertDialogCancel>
                {/* <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => buyProperty(landedProperty)}>Buy for ${landedProperty.property.price}</AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        {currentPlayer.inJail &&
          <AlertDialog open={inJailDialog && currentPlayerIndex == 0} onOpenChange={() => setCommunityChestCard(null)}>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-400 w-[180px] text-[25px] font-bold text-center rounded-md">{`You're`} in Jail!</AlertDialogTitle>
                <p className="text-[21px] text-white text-center">What would you like to do?</p>
                <p className="text-[21px] text-white text-center">Turns in Jail: {currentPlayer.turnsInJail}</p>
              </AlertDialogHeader>
              <Button onClick={() => breakOutOfJail('rollDouble')} className="bg-yellow-400 text-black font-bold text-[17px]" disabled={currentPlayer.turnsInJail == 3}>Try Roll Double</Button>
              <Button onClick={() => breakOutOfJail('payFine')} className="bg-yellow-400 text-black font-bold text-[17px]">Pay $50 Fine</Button>
              <Button onClick={() => breakOutOfJail('useCard')} className="bg-yellow-400 text-black font-bold text-[17px]" disabled={currentPlayer.getOutOfJailCards == 0}>Use Get Out Of Jail Card</Button>
              <AlertDialogFooter>
                {/* <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => buyProperty(landedProperty)}>Buy for ${landedProperty.property.price}</AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>}
        {landedProperty && landedProperty.property.owner && landedProperty.property.owner !== landedProperty.player.name && (
          <AlertDialog open={true} onOpenChange={() => setLandedProperty(null)}>
            <AlertDialogTrigger><></></AlertDialogTrigger>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-400 w-[180px] text-[25px] font-bold text-center rounded-md">
                  Pay Rent to {landedProperty.property.owner}
                </AlertDialogTitle>
                <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                  <p>RENT: ${landedProperty.property.rent}</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 1 House</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentOneHouse}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full my-1">
                    <p className="w-1/2 text-center">With 2 Houses</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentTwoHouses}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 3 Houses</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentThreeHouses}</p>
                  </div>
                  <p>---------------------------</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">One House Cost</p>
                    <p className="w-1/2 text-center">${landedProperty.property.OneHouseCost}</p>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => payRent(landedProperty)}>Pay ${checkRent(landedProperty)}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {landedProperty && landedProperty.property?.owner !== null && landedProperty.property?.owner !== undefined && landedProperty.property.owner === landedProperty.player.name && (
          <AlertDialog open={true} onOpenChange={() => setLandedProperty(null)}>
            <AlertDialogTrigger><></></AlertDialogTrigger>
            <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-yellow-400 w-[300px] text-[25px] font-bold text-center rounded-md">
                  Build House No.{landedProperty.property.houses + 1}
                </AlertDialogTitle>
                <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                  <p>RENT: ${landedProperty.property.rent}</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 1 House</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentOneHouse}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full my-1">
                    <p className="w-1/2 text-center">With 2 Houses</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentTwoHouses}</p>
                  </div>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">With 3 Houses</p>
                    <p className="w-1/2 text-center">${landedProperty.property.rentThreeHouses}</p>
                  </div>
                  <p>---------------------------</p>
                  <div className="flex flex-row justify-around items-center w-full">
                    <p className="w-1/2 text-center">One House Cost</p>
                    <p className="w-1/2 text-center">${landedProperty.property.OneHouseCost}</p>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-[16px]" onClick={() => setLandedProperty(null)}>No</AlertDialogCancel>
                <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => upgradeProperty(landedProperty.player, landedProperty.setPlayer, landedProperty.property)}>
                  Build House for ${landedProperty.property.OneHouseCost}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {visible && (
          <div className="flex flex-row justify-center absolute top-120 items-center gap-3 p-5 rounded-lg border-[4px] border-yellow-500" style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }}>
            <Image
              src={`/dice/${diceValues[0]}.jpeg`}
              alt="dice"
              className="h-[75px] w-[75px] rounded-lg border-2 border-yellow-500"
              height={150}
              width={150}
            />
            <Image
              src={`/dice/${diceValues[1]}.jpeg`}
              alt="dice"
              className="h-[75px] w-[75px] rounded-lg border-2 border-yellow-500"
              height={150}
              width={150}
            />
          </div>
        )}
        {loading && (
          <div className="flex flex-row justify-center absolute top-120 items-center gap-3 p-5 rounded-lg border-4 border-yellow-400" style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }}>
            <Image
              src={`/hourglass.png`}
              alt="hourglass"
              className="h-[75px] w-[75px] rounded-md animate-spin"
              height={150}
              width={150}
            />
          </div>
        )}
      </div>
    </div>
  );
}
