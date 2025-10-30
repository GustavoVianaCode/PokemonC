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
      <h2 className="text-xl font-pixel text-purple-900 mb-4 text-center">
        STATUS BASE
      </h2>
      <div className="space-y-3">
        {Object.entries(stats).map(([stat, value]) => (
          <div key={stat} className="bg-purple-100 rounded-lg p-3">
            <p className="font-pixel text-[10px] text-purple-900 uppercase mb-1">
              {statNames[stat]}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-grow bg-gray-300 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(value / 255) * 100}%` }}
                />
              </div>
              <span className="font-pixel text-xs text-purple-900 min-w-[35px]">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
