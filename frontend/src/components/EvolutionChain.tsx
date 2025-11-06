import { useNavigate } from 'react-router-dom';

interface EvolutionData {
  id: number;
  name: string;
  image: string;
  isMega?: boolean;
  megaType?: string[];
}

interface EvolutionChainProps {
  evolutions: EvolutionData[];
}

export default function EvolutionChain({ evolutions }: EvolutionChainProps) {
  const navigate = useNavigate();

  if (evolutions.length <= 1) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-pixel text-yellow-400 mb-3 text-center drop-shadow-lg">
        LINHA EVOLUTIVA
      </h2>
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {evolutions.map((evo, index) => (
          <div key={evo.id} className="flex items-center">
            <div
              className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-2 cursor-pointer hover:shadow-xl transition transform hover:scale-105 border-2 border-purple-500/30 hover:border-yellow-400"
              onClick={() => navigate(`/pokemon/${evo.id}`)}
            >
              <img src={evo.image} alt={evo.name} className="w-20 h-20" />
              <p className="text-center font-pixel text-[9px] text-purple-200 capitalize mt-1">
                {evo.name}
              </p>
            </div>
            {index < evolutions.length - 1 && (
              <span className="text-2xl text-yellow-400 mx-2 drop-shadow-lg">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
