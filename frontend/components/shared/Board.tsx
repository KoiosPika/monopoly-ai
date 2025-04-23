import Image from 'next/image';
import React from 'react';

// Function to get color based on property type
const getColor = (cell: string) => {
    const colorMap: Record<string, string> = {
        'P1': 'bg-[#2acb1a]', 'P6': 'bg-[#2acb1a]', // Green
        'P2': 'bg-[#2365d9]',// Blue
        'P3': 'bg-[#FF69B4]', 'P8': 'bg-[#FF69B4]',// Pink
        'P4': 'bg-[#FFA500]', 'P7': 'bg-[#FFA500]',// Orange
        'P5': 'bg-[#a84ecf]',// Purple
        'Chance': 'bg-[#A9A9A9]', 'Community Chest': 'bg-[#A9A9A9]', // Dark Gray
        'Go': 'bg-[#e34b30]', 'Jail': 'bg-[#e34b30]', 'Free Parking': 'bg-[#e34b30]', 'Go To Jail': 'bg-[#e34b30]'
    };
    return colorMap[cell] || 'bg-white';
};

const Board = ({ players, properties }: { players: any, properties: any }) => {
    const bottomRow = [{ name: 'Jail', index: 4 }, { name: 'P2', index: 3 }, { name: 'Community Chest', index: 2 }, { name: 'P1', index: 1 }, { name: 'Go', index: 0 }];
    const leftColumn = [{ name: 'P4', index: 7 }, { name: 'Chance', index: 6 }, { name: 'P3', index: 5 }];
    const topRow = [{ name: 'Free Parking', index: 8 }, { name: 'P5', index: 9 }, { name: 'Community Chest', index: 10 }, { name: 'P6', index: 11 }, { name: 'Go To Jail', index: 12 }];
    const rightColumn = [{ name: 'P7', index: 13 }, { name: 'Chance', index: 14 }, { name: 'P8', index: 15 }];
    const positionClasses = ["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"];

    return (
        <div className="h-[600px] w-[600px] border-2 border-black flex flex-col justify-center items-center bg-[#cde6d0] font-bold text-center relative">

            {/* Top Row */}
            <div className="flex flex-row justify-center items-center w-full">
                {topRow.map((cell, index) => {
                    const owner = players.find((player: any) =>
                        player.player.properties.some((property: any) => property === cell.name)
                    );
                    return (
                        <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                            {cell.name}
                            {owner && (
                                <p className={`absolute top-[-30px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                    ))}
                                </>
                            )}
                            {players.filter((player: any) => player.player.position === cell.index).map((player: any, playerIndex: number) => (
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
                        let owner = players.find((player: any) =>
                            player.player.properties.some((property: any) => property === cell.name)
                        )
                        return (
                            <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                                {cell.name}
                                {owner && (
                                    <p className={`rotate-270 absolute left-[-75px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                    <>
                                        {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                        ))}
                                    </>
                                )}
                                {players.filter((player: any) => player.player.position === cell.index).map((player: any, playerIndex: number) => (
                                    <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]}`} />
                                ))}
                            </div>
                        )
                    })}
                </div>

                {/* Center */}
                <div className="h-[360px] w-[360px] border-2 border-black">
                    <Image src={'/middle.png'} className="h-[360px] w-[360px]" alt="middle" height={500} width={500} />
                </div>

                {/* Right Column */}
                <div className="grid grid-cols-1 w-[120px] h-full">
                    {rightColumn.map((cell, index) => {
                        const owner = players.find((player: any) =>
                            player.player.properties.some((property: any) => property === cell.name)
                        );
                        return (
                            <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                                {cell.name}
                                {owner && (
                                    <p className={`rotate-90 absolute right-[-75px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                    <>
                                        {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                        ))}
                                    </>
                                )}
                                {players.filter((player: any) => player.player.position === cell.index).map((player: any, playerIndex: number) => (
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
                    const owner = players.find((player: any) =>
                        player.player.properties.some((property: any) => property === cell.name)
                    );
                    return (
                        <div key={index} className={`relative flex justify-center items-center border-black border w-[120px] h-[120px] ${getColor(cell.name)}`}>
                            {cell.name}
                            {owner && (
                                <p className={`absolute bottom-[-30px] ${getColor(cell.name)} w-[110px] text-center rounded-md px-1`}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={30} height={30} className={`absolute top-${houseIndex * 10}`} />
                                    ))}
                                </>
                            )}
                            {players.filter((player: any) => player.player.position === cell.index).map((player:any, playerIndex:number) => (
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