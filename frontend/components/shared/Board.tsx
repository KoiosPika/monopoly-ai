import Image from 'next/image';
import React from 'react';

// Function to get color based on property type
const getColor = (cell: string) => {
    const colorMap: Record<string, string> = {
        'P1': 'bg-[#2acb1a]', 'P6': 'bg-[#2acb1a]', 'P14': 'bg-[#2acb1a]', // Green
        'P2': 'bg-[#2365d9]', 'P10': 'bg-[#2365d9]', 'P13': 'bg-[#2365d9]',// Blue
        'P3': 'bg-[#FF69B4]', 'P8': 'bg-[#FF69B4]', 'P11': 'bg-[#FF69B4]',// Pink
        'P4': 'bg-[#FFA500]', 'P7': 'bg-[#FFA500]', 'P15': 'bg-[#FFA500]',// Orange
        'P9': 'bg-[#a84ecf]', 'P5': 'bg-[#a84ecf]', 'P16': 'bg-[#a84ecf]', 'P12': 'bg-[#a84ecf]',// Purple
        'Chance': 'bg-[#A9A9A9]', 'Community Chest': 'bg-[#A9A9A9]', // Dark Gray
        'Go': 'bg-[#e34b30]', 'Jail': 'bg-[#e34b30]', 'Free Parking': 'bg-[#e34b30]', 'Go To Jail': 'bg-[#e34b30]'
    };
    return colorMap[cell] || 'bg-white';
};

const Board = ({ players, properties }: { players: any, properties: any }) => {
    const bottomRow = [{ name: 'Jail', index: 6 }, { name: 'P4', index: 5 }, { name: 'P3', index: 4 }, { name: 'Community Chest', index: 3 }, { name: 'P2', index: 2 }, { name: 'P1', index: 1 }, { name: 'Go', index: 0 }];
    const leftColumn = [{ name: 'P8', index: 11 }, { name: 'P7', index: 10 }, { name: 'Chance', index: 9 }, { name: 'P6', index: 8 }, { name: 'P5', index: 7 }];
    const topRow = [{ name: 'Free Parking', index: 12 }, { name: 'P9', index: 13 }, { name: 'P10', index: 14 }, { name: 'Community Chest', index: 15 }, { name: 'P11', index: 16 }, { name: 'P12', index: 17 }, { name: 'Go To Jail', index: 18 }];
    const rightColumn = [{ name: 'P13', index: 19 }, { name: 'P14', index: 20 }, { name: 'Chance', index: 21 }, { name: 'P15', index: 22 }, { name: 'P16', index: 23 }];
    const positionClasses = ["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"];

    return (
        <div className="h-[840px] w-[840px] border-2 border-black flex flex-col justify-center items-center bg-[#cde6d0] font-bold text-center relative">

            {/* Top Row */}
            <div className="flex flex-row justify-center items-center w-full">
                {topRow.map((cell, index) => {
                    const owner = players.find(player =>
                        player.player.properties.some(property => property === cell.name)
                    );
                    return (
                        <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                            {cell.name}
                            {owner && (
                                <p className={`absolute top-[-30px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find(p => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find(p => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                    ))}
                                </>
                            )}
                            {players.filter(player => player.player.position === cell.index).map((player, playerIndex) => (
                                <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]}`} />
                            ))}
                        </div>
                    )
                })}
            </div>

            {/* Middle Section */}
            <div className="h-[600px] w-full flex flex-row justify-center items-center">

                {/* Left Column */}
                <div className="grid grid-cols-1 w-[120px] h-full">
                    {leftColumn.map((cell, index) => {
                        console.log(players)
                        let owner = players.find(player =>
                            player.player.properties.some(property => property === cell.name)
                        )
                        return (
                            <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                                {cell.name}
                                {owner && (
                                    <p className={`rotate-270 absolute left-[-75px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find(p => p.name === cell.name)?.houses > 0 && (
                                    <>
                                        {Array(properties.find(p => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                        ))}
                                    </>
                                )}
                                {players.filter(player => player.player.position === cell.index).map((player, playerIndex) => (
                                    <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]}`} />
                                ))}
                            </div>
                        )
                    })}
                </div>

                {/* Center */}
                <div className="h-[600px] w-[600px] border-2 border-black">
                    <Image src={'/middle.png'} className="h-[600px] w-[600px]" alt="middle" height={500} width={500} />
                </div>

                {/* Right Column */}
                <div className="grid grid-cols-1 w-[120px] h-full">
                    {rightColumn.map((cell, index) => {
                        const owner = players.find(player =>
                            player.player.properties.some(property => property === cell.name)
                        );
                        return (
                            <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                                {cell.name}
                                {owner && (
                                    <p className={`rotate-90 absolute right-[-75px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find(p => p.name === cell.name)?.houses > 0 && (
                                    <>
                                        {Array(properties.find(p => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                        ))}
                                    </>
                                )}
                                {players.filter(player => player.player.position === cell.index).map((player, playerIndex) => (
                                    <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]}`} />
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-row justify-center items-center w-full">
                {bottomRow.map((cell, index) => {
                    const owner = players.find(player =>
                        player.player.properties.some(property => property === cell.name)
                    );
                    return (
                        <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                            {cell.name}
                            {owner && (
                                <p className={`absolute bottom-[-30px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find(p => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find(p => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                    ))}
                                </>
                            )}
                            {players.filter(player => player.player.position === cell.index).map((player, playerIndex) => (
                                <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]}`} />
                            ))}
                        </div>
                    )
                })}
            </div>

        </div>
    );
};

export default Board;