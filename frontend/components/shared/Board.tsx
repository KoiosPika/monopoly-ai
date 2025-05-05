import Image from 'next/image';
import React from 'react';

// Function to get color based on property type
const getColor = (cell: string) => {
    const colorMap: Record<string, string> = {
        'P1': 'bg-gradient-to-l from-green-500 to-green-700', 'P6': 'bg-gradient-to-l from-green-500 to-green-700', // Green
        'P2': 'bg-gradient-to-l from-blue-500 to-blue-700',// Blue
        'P3': 'bg-gradient-to-l from-pink-500 to-pink-700', 'P8': 'bg-gradient-to-l from-pink-500 to-pink-700',// Pink
        'P4': 'bg-gradient-to-l from-yellow-400 to-yellow-600', 'P7': 'bg-gradient-to-l from-yellow-400 to-yellow-600',// Orange
        'P5': 'bg-gradient-to-l from-purple-500 to-purple-700',// Purple
        'Chance': 'bg-gradient-to-l from-gray-400 to-gray-500', 'Community Chest': 'bg-gradient-to-l from-gray-400 to-gray-500', // Dark Gray
        'Go': 'bg-gradient-to-l from-red-500 to-red-600', 'Jail': 'bg-gradient-to-l from-red-500 to-red-600', 'Free Parking': 'bg-gradient-to-l from-red-500 to-red-600', 'Go To Jail': 'bg-gradient-to-l from-red-500 to-red-600'
    };
    return colorMap[cell] || 'bg-white';
};

const Board = ({ players, properties }: { players: any, properties: any }) => {
    const bottomRow = [{ name: 'Jail', index: 4, image:2 }, { name: 'P2', index: 3, image:3 }, { name: 'Community Chest', index: 2, image:1}, { name: 'P1', index: 1, image:5 }, { name: 'Go', index: 0, image:2 }];
    const leftColumn = [{ name: 'P4', index: 7, image:4 }, { name: 'Chance', index: 6, image:1 }, { name: 'P3', index: 5, image:6 }];
    const topRow = [{ name: 'Free Parking', index: 8, image:2 }, { name: 'P5', index: 9, image:5 }, { name: 'Community Chest', index: 10, image:1 }, { name: 'P6', index: 11, image:3 }, { name: 'Go To Jail', index: 12, image:2 }];
    const rightColumn = [{ name: 'P7', index: 13, image:6 }, { name: 'Chance', index: 14, image:1 }, { name: 'P8', index: 15, image:4 }];
    const positionClasses = ["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"];

    return (
        <div className="h-[600px] w-[600px] border-2 border-yellow-500 flex flex-col justify-center items-center font-bold text-center relative text-[18px]">

            {/* Top Row */}
            <div className="flex flex-row justify-center items-center w-full">
                {topRow.map((cell, index) => {
                    const owner = players.find((player: any) =>
                        player.player.properties.some((property: any) => property === cell.name)
                    );
                    return (
                        <div key={index} className={`text-white relative flex justify-center items-center border-yellow-500 border border-2 w-[120px] h-[120px] p-[5px] opacity-90`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                            <p className=''>{cell.name}</p>
                            {owner && (
                                <p className={`absolute top-[-40px] w-[110px] text-center rounded-md p-[2px]`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={40} height={40} className={`absolute`} style={{ top: `${houseIndex * 40}px` }}  />
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
                        let owner = players.find((player: any) =>
                            player.player.properties.some((property: any) => property === cell.name)
                        )
                        return (
                            <div key={index} className={`text-white relative flex justify-center items-center border-yellow-500 border w-[120px] h-[120px] rotate-90`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                <p className='rotate-270'>{cell.name}</p>
                                {owner && (
                                    <p className={`absolute bottom-[-40px] w-[110px] text-center rounded-md p-[2px] rotate-180`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                    <div className='grid grid-cols-1'>
                                        {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={40} height={40} className={`absolute rotate-270`} style={{ top: `${40}px`, left:`${houseIndex * 40}px` }}  />
                                        ))}
                                    </div>
                                )}
                                {players.filter((player: any) => player.player.position === cell.index).map((player: any, playerIndex: number) => (
                                    <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]} rotate-270`} />
                                ))}
                            </div>
                        )
                    })}
                </div>

                {/* Center */}
                <div className="h-[360px] w-[360px] border-2 border-yellow-500">
                    <Image src={'/middle.png'} className="h-[360px] w-[360px] bg-gradient-to-l from-[#70e37e] to-[#3ae54f]" alt="middle" height={500} width={500} />
                </div>

                {/* Right Column */}
                <div className="grid grid-cols-1 w-[120px] h-full">
                    {rightColumn.map((cell, index) => {
                        const owner = players.find((player: any) =>
                            player.player.properties.some((property: any) => property === cell.name)
                        );
                        return (
                            <div key={index} className={`relative text-white rotate-270 flex justify-center items-center border-yellow-500 border w-[120px] h-[120px]`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                <p className='rotate-90'>{cell.name}</p>
                                {owner && (
                                    <p className={`rotate-180 absolute bottom-[-40px] w-[110px] text-center rounded-md p-[2px]`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                        {owner.player.name}
                                    </p>
                                )}
                                {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                    <>
                                        {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                            <Image key={houseIndex} src={`/House.png`} alt="House" width={40} height={40} className={`absolute rotate-90`} style={{ top: `${40}px`, right:`${houseIndex * 40}px`}}  />
                                        ))}
                                    </>
                                )}
                                {players.filter((player: any) => player.player.position === cell.index).map((player: any, playerIndex: number) => (
                                    <Image key={player.player.name} src={`/${player.player.avatar}`} alt={player.player.name} width={40} height={40} className={`absolute ${positionClasses[playerIndex]} rotate-90`} />
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
                        <div key={index} className={`text-white relative flex justify-center items-center border-yellow-500 border w-[120px] h-[120px]`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                            {cell.name}
                            {owner && (
                                <p className={`absolute bottom-[-40px] w-[110px] text-center rounded-md p-[2px]`} style={{backgroundImage: `url('/properties/${cell.image}.png')`, backgroundSize: 'cover'}}>
                                    {owner.player.name}
                                </p>
                            )}
                            {properties.find((p: any) => p.name === cell.name)?.houses > 0 && (
                                <>
                                    {Array(properties.find((p: any) => p.name === cell.name)?.houses).fill(0).map((_, houseIndex) => (
                                        <Image key={houseIndex} src={`/House.png`} alt="House" width={40} height={40} className={`absolute`} style={{ top: `${houseIndex * 30}px` }} />
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