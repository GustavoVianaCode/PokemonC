interface PokemonStatsProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
}

export default function PokemonStats({ stats }: PokemonStatsProps) {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    spAttack: 'Sp. Attack',
    spDefense: 'Sp. Defense',
    speed: 'Speed',
  };

  return (
    <div className="lg:col-span-1">
      <h2 className="text-base font-pixel text-yellow-400 mb-3 text-center drop-shadow-lg">
        STATUS BASE
      </h2>
      <div className="space-y-2">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-2 border border-purple-500/30">
            <p className="font-pixel text-[9px] text-purple-200 uppercase mb-1">
              {statNames[stat]}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-grow bg-purple-950/50 rounded-full h-2 border border-purple-500/30">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full shadow-lg transition-all duration-300"
                  style={{ width: `${(value / 255) * 100}%` }}
                />
              </div>
              <span className="font-pixel text-[10px] text-yellow-400 min-w-[30px]">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
