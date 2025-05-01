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

  const [player1, setPlayer1] = useState<any>({ ...initialStats, name: "Player 1", avatar: 'avatar_1.png' });
  const [player2, setPlayer2] = useState<any>({ ...initialStats, name: "Player 2", avatar: 'avatar_2.png' });
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [turn, setTurn] = useState(1);
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [properties, setProperties] = useState([
    { name: "P1", index: 1, price: 100, rent: 10, rentOneHouse: 20, rentTwoHouses: 30, rentThreeHouses: 40, OneHouseCost: 60, houses: 0, owner: null, color: '#2acb1a', mortgaged: false },
    { name: "P2", index: 3, price: 150, rent: 20, rentOneHouse: 40, rentTwoHouses: 60, rentThreeHouses: 80, OneHouseCost: 90, houses: 0, owner: null, color: '#2365d9', mortgaged: false },
    { name: "P3", index: 5, price: 200, rent: 40, rentOneHouse: 80, rentTwoHouses: 120, rentThreeHouses: 160, OneHouseCost: 120, houses: 0, owner: null, color: '#FF69B4', mortgaged: false },
    { name: "P4", index: 7, price: 250, rent: 60, rentOneHouse: 120, rentTwoHouses: 180, rentThreeHouses: 240, OneHouseCost: 150, houses: 0, owner: null, color: '#FFA500', mortgaged: false },
    { name: "P5", index: 9, price: 160, rent: 23, rentOneHouse: 45, rentTwoHouses: 70, rentThreeHouses: 90, OneHouseCost: 95, houses: 0, owner: null, color: '#a84ecf', mortgaged: false },
    { name: "P6", index: 11, price: 110, rent: 12, rentOneHouse: 25, rentTwoHouses: 35, rentThreeHouses: 50, OneHouseCost: 65, houses: 0, owner: null, color: '#2acb1a', mortgaged: false },
    { name: "P7", index: 13, price: 260, rent: 65, rentOneHouse: 130, rentTwoHouses: 195, rentThreeHouses: 260, OneHouseCost: 155, houses: 0, owner: null, color: '#FFA500', mortgaged: false },
    { name: "P8", index: 15, price: 210, rent: 44, rentOneHouse: 90, rentTwoHouses: 130, rentThreeHouses: 175, OneHouseCost: 125, houses: 0, owner: null, color: '#FF69B4', mortgaged: false },
  ]);

  const [landedProperty, setLandedProperty] = useState<any>(null);
  const [chanceCard, setChanceCard] = useState<any>(null);
  const [communityChestCard, setCommunityChestCard] = useState<any>(null);
  const [bankruptcyModal, setBankruptcyModal] = useState<any>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [inJailDialog, setinJailDialog] = useState(true);
  const [scenarioGenerated, setScenarioGenerated] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);


  const players = [
    { player: player1, setPlayer: setPlayer1 },
    { player: player2, setPlayer: setPlayer2 },
  ];

  const currentPlayer = players[currentPlayerIndex].player;

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
      const moveInterval = setInterval(() => {
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
          }
        }
      }, 250);
    }, 1500);
  };

  const nextTurn = () => {
    setTurn((prev) => (prev + 1));
    setinJailDialog(true)
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
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

  const payRent = (landedProperty: any) => {
    let rentAmount;

    switch (landedProperty.property.houses) {
      case 1: rentAmount = landedProperty.property.rentOneHouse; break;
      case 2: rentAmount = landedProperty.property.rentTwoHouses; break;
      case 3: rentAmount = landedProperty.property.rentThreeHouses; break;
      default: rentAmount = landedProperty.property.rent; break;
    }

    const tenant = landedProperty.player;
    const owner = players.find((p: any) => p.player.name === landedProperty.property.owner);

    if (!owner) return; // Safety check in case owner is missing

    if (tenant.balance >= rentAmount) {
      // Normal rent payment
      landedProperty.setPlayer((prev: any) => ({
        ...prev,
        balance: prev.balance - rentAmount
      }));

      // Give money to the property owner
      if (owner.player.name === "Player 1") setPlayer1((prev: any) => ({ ...prev, balance: prev.balance + rentAmount }));
      if (owner.player.name === "Player 2") setPlayer2((prev: any) => ({ ...prev, balance: prev.balance + rentAmount }));

      setLandedProperty(null);
    } else {
      // Not enough balance: handle bankruptcy
      setBankruptcyModal({ tenant, owner, rentAmount });
    }
  };

  const declareBankruptcy = (player: any) => {
    setPlayer1((prev: any) => prev.name === player.name ? { ...prev, bankrupt: true, balance: 0, properties: [] } : prev);
    setPlayer2((prev: any) => prev.name === player.name ? { ...prev, bankrupt: true, balance: 0, properties: [] } : prev);

    setBankruptcyModal(null);
  };

  const sellProperty = (landedProperty: any) => {
    const player = landedProperty.player;
    const setPlayer = landedProperty.setPlayer;

    if (player.properties.length === 0) return; // No properties to sell

    const propertyToSell = player.properties[0]; // Just pick the first one for now

    // Find a buyer (for now, just give it to the next player in turn)
    const buyer = players.find(p => p.player.name !== player.name && !p.player.bankrupt);
    if (!buyer) return; // No buyer available

    // Transfer property
    setPlayer((prev: any) => ({
      ...prev,
      balance: prev.balance + propertyToSell.price, // Get full property price
      properties: prev.properties.filter((prop: any) => prop.name !== propertyToSell.name), // Remove from seller
    }));

    // Give property to buyer
    if (buyer.player.name === "Player 1") setPlayer1((prev: any) => ({ ...prev, properties: [...prev.properties, propertyToSell.name] }));
    if (buyer.player.name === "Player 2") setPlayer2((prev: any) => ({ ...prev, properties: [...prev.properties, propertyToSell.name] }));

    setLandedProperty(null);
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
    if (player == 1) {
      nextTurn()
      AITurn()
    } else {
      nextTurn()
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const AITurn = async () => {
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
            if (!property.owner) {
              const colorSet = properties.filter(p => p.color === property.color);
              const ownedByPlayer = colorSet.filter(p => p.owner === player.name);
              const isMonopolyPossible = ownedByPlayer.length >= colorSet.length - 1;

              const shouldBuy =
                player.balance >= property.price &&
                (isMonopolyPossible || property.rent > 20 || Math.random() > 0.3);

              if (shouldBuy) {

                if (player.balance >= property.price) {
                  setPlayer((prev: any) => ({
                    ...prev,
                    balance: prev.balance - property.price,
                    properties: [...prev.properties, property.name],
                  }));
                  setProperties(prev =>
                    prev.map(p => p.name === property.name ? { ...p, owner: player.name } : p)
                  );
                }
              }
            } else if (property.owner !== player.name) {
              // 💰 Pay Rent + TD-learning could learn from bad decisions
              const rent = checkRent({ property });
              const ownerObj = players.find(p => p.player.name === property.owner);
              if (!ownerObj) return;

              setLoading(true);
              const shouldPay = await fetch('http://127.0.0.1:8000/ai/td-learning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  current_player: player,
                  players: players.map(p => p.player),
                  properties,
                  rent
                })
              });

              const decision = await shouldPay.json();
              setLoading(false);

              if (decision && player.balance >= rent) {
                setPlayer((prev: any) => ({ ...prev, balance: prev.balance - rent }));
                ownerObj.setPlayer((prev: any) => ({ ...prev, balance: prev.balance + rent }));
              }
            } else if (property.owner == player.name) {
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

              if (decision && player.balance >= property.OneHouseCost) {
                setPlayer((prev: any) => ({
                  ...prev,
                  balance: prev.balance - property.OneHouseCost
                }));

                setProperties(prev =>
                  prev.map(p =>
                    p.name === property.name ? { ...p, houses: p.houses + 1 } : p
                  )
                );
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
            setPlayer((prev: any) => ({
              ...prev,
              inJail: true,
              position: 4,
              turnsInJail: 0,
            }));
            setinJailDialog(false)
          }

          return;
        }
      } else if (chosen === 2 && player.balance >= 50) {
        setinJailDialog(false);
        setPlayer((prev: any) => ({
          ...prev,
          balance: prev.balance - 50,
          inJail: false,
          turnsInJail: 0,
        }));
        return;
      } else if (chosen === 3 && player.getOutOfJailCards > 0) {
        setinJailDialog(false);
        setPlayer((prev: any) => ({
          ...prev,
          getOutOfJailCards: prev.getOutOfJailCards - 1,
          inJail: false,
          turnsInJail: 0,
        }));
        return;
      } else {
        setinJailDialog(false);
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

      if (expectedLoss < 300) {

        setPlayer((prev: any) => ({
          ...prev,
          skipTurnCount: prev.skipTurnCount - 1,
        }));

        setLoading(false);
        return;
      }

      setLoading(false);
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
      if (!property.owner) {

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

          if (player.balance >= property.price) {
            setPlayer((prev: any) => ({
              ...prev,
              balance: prev.balance - property.price,
              properties: [...prev.properties, property.name],
            }));
            setProperties(prev =>
              prev.map(p => p.name === property.name ? { ...p, owner: player.name } : p)
            );
          }
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
      } else if (property.owner == player.name) {
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

        if (decision && player.balance >= property.OneHouseCost) {
          setPlayer((prev: any) => ({
            ...prev,
            balance: prev.balance - property.OneHouseCost
          }));

          setProperties(prev =>
            prev.map(p =>
              p.name === property.name ? { ...p, houses: p.houses + 1 } : p
            )
          );
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
      setPlayer((prev: any) => ({
        ...prev,
        inJail: true,
        position: 4,
        turnsInJail: 0,
      }));
      setinJailDialog(false)
    }

    nextTurn();
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

    const randomBalance1 = () => Math.floor(Math.random() * 400) + 1600; // 800–1200
    const randomBalance2 = () => Math.floor(Math.random() * 400) + 1600; // 800–1200

    const randomHouses = () => Math.floor(Math.random() * 3); // 0–4 houses

    setPlayer1({
      ...initialStats,
      name: "Player 1",
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
      name: "Player 2",
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
        if (player1Properties.includes(p.name)) return { ...p, owner: "Player 1", houses: randomHouses() };
        if (player2Properties.includes(p.name)) return { ...p, owner: "Player 2", houses: randomHouses() };
        return { ...p, owner: null, houses: 0 };
      })
    );

    setScenarioGenerated(true);
    setGameStarted(false);
    setCurrentPlayerIndex(0);
  };

  const startGame = () => {
    setGameStarted(true);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-10 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]" style={{ backgroundImage: 'url(/bg.jpg)' }}>
      <div>
          {/* current turn */}
          <div className="text-[30px] font-bold">{turn}</div>
        </div>
      <div className="flex flex-row justify-center items-center py-2 rounded-lg gap-3 relative">
        <div className="absolute top-10 left-[-370px] flex flex-col justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[175px] w-[175px]" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }}>
          <p className="text-white font-semibold text-[20px]">Player Turn</p>
          <Image src={`/${currentPlayer.avatar}`} alt="avatar" height={75} width={75} />
          <p className="text-white font-semibold text-[20px]">{currentPlayer.name}</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[300px]" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }}>
          <Image src={'/balance.png'} alt="money" className="h-[75px] w-[120px]" height={200} width={200} />
          <p className="text-[20px] text-white font-semibold">${(player2.balance).toLocaleString()}</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[300px] cursor-pointer" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }} onClick={() => handleEndTurn(2)}>
          <Image src={'/hand.png'} alt="money" className="h-[80px] w-[90px]" height={200} width={200} />
          <p className="text-[20px] text-white font-semibold">End Turn</p>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-10">
        <Board properties={properties} players={players} />
      </div>
      <div className="flex flex-row justify-center items-center py-2 rounded-lg gap-3">
        <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px]" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }}>
          <Image src={'/balance.png'} alt="money" className="h-[75px] w-[120px]" height={200} width={200} />
          <p className="text-[20px] text-white font-semibold">${(player1.balance).toLocaleString()}</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px] cursor-pointer" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }} onClick={() => handleEndTurn(1)}>
          <Image src={'/hand.png'} alt="money" className="h-[80px] w-[90px]" height={200} width={200} />
          <p className="text-[20px] text-white font-semibold">End Turn</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-3 p-2 rounded-lg border-3 border-yellow-400 h-[100px] w-[225px]" style={{ backgroundColor: 'rgba(238, 117, 23, 0.5)' }} onClick={() => rollDice()}>
          <Image src={'/dice.png'} alt="money" className="h-[100px] w-[100px]" height={200} width={200} />
          <p className="text-[20px] text-white font-semibold">Roll</p>
        </div>
      </div>
      <div className="flex gap-6 mt-6">
        {!scenarioGenerated && (
          <Button onClick={generateScenario} className="bg-blue-500 text-white px-6 py-2 rounded-md text-lg">
            Generate Scenario
          </Button>
        )}
        {scenarioGenerated && !gameStarted && (
          <Button onClick={startGame} className="bg-green-500 text-white px-6 py-2 rounded-md text-lg">
            Start Game
          </Button>
        )}
      </div>
      {(landedProperty && !landedProperty.property.owner) &&
        <AlertDialog open={true} onOpenChange={() => setLandedProperty(null)}>
          <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-yellow-400 text-black w-[180px] text-[25px] font-bold text-center rounded-md">{landedProperty.property.name} is for sale</AlertDialogTitle>
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
          <AlertDialogTrigger>g</AlertDialogTrigger>
          <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-yellow-400 text-black w-[180px] text-[25px] font-bold text-center rounded-md">Chance Cards!</AlertDialogTitle>
              {chanceCard && <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                <p className="text-center">{chanceCard.title}</p>
                <p className="text-center">{chanceCard.description}</p>
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
          <AlertDialogTrigger>g</AlertDialogTrigger>
          <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-yellow-400 text-black w-[180px] text-[25px] font-bold text-center rounded-md">Chance Cards!</AlertDialogTitle>
              {communityChestCard && <div className="flex flex-col justify-center items-center text-white text-[20px] w-full">
                <p className="text-center">{communityChestCard.title}</p>
                <p className="text-center">{communityChestCard.description}</p>
              </div>}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-[16px]" onClick={() => setCommunityChestCard(null)}>Ok</AlertDialogCancel>
              {/* <AlertDialogAction className="bg-yellow-500 text-black text-[16px]" onClick={() => buyProperty(landedProperty)}>Buy for ${landedProperty.property.price}</AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
      {currentPlayer.inJail &&
        <AlertDialog open={inJailDialog} onOpenChange={() => setCommunityChestCard(null)}>
          <AlertDialogTrigger>g</AlertDialogTrigger>
          <AlertDialogContent style={{ backgroundImage: 'url(/bg-dialog.jpg)', backgroundSize: 'cover' }} className="border-3 border-yellow-400 w-[350px] font-semibold">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-yellow-400 text-black w-[180px] text-[25px] font-bold text-center rounded-md">{`You're`} in Jail!</AlertDialogTitle>
              <p className="text-[18px] text-white text-center">What would you like to do?</p>
              <p className="text-[18px] text-white text-center">Turns in Jail: {currentPlayer.turnsInJail}</p>
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
              <AlertDialogTitle className="bg-yellow-400 text-black w-[180px] text-[25px] font-bold text-center rounded-md">
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
              <AlertDialogTitle className="bg-yellow-400 text-black w-[300px] text-[25px] font-bold text-center rounded-md">
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
      {bankruptcyModal && (
        <AlertDialog open={true} onOpenChange={() => setBankruptcyModal(null)}>
          <AlertDialogTrigger><></></AlertDialogTrigger>
          <AlertDialogContent className="border-3 border-red-500 w-[350px] font-semibold">
            <AlertDialogHeader>
              <AlertDialogTitle className="bg-red-500 text-white w-[200px] text-[22px] font-bold text-center rounded-md">
                {bankruptcyModal.tenant.name} is Broke!
              </AlertDialogTitle>
              <div className="text-center text-white">
                {bankruptcyModal.tenant.name} does not have enough money to pay rent of ${bankruptcyModal.rentAmount} to {bankruptcyModal.owner.name}.
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {visible && (
        <div className="flex flex-row justify-center absolute top-120 items-center gap-3 p-5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-lg">
          <Image
            src={`/dice/${diceValues[0]}.jpeg`}
            alt="dice"
            className="h-[75px] w-[75px] rounded-md"
            height={150}
            width={150}
          />
          <Image
            src={`/dice/${diceValues[1]}.jpeg`}
            alt="dice"
            className="h-[75px] w-[75px] rounded-md"
            height={150}
            width={150}
          />
        </div>
      )}
      {loading && (
        <div className="flex flex-row justify-center absolute top-120 items-center gap-3 p-5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-lg">
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
  );
}
