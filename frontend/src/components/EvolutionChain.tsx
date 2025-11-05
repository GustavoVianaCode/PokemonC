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
      <h2 className="text-2xl font-pixel text-yellow-400 mb-6 text-center drop-shadow-lg">
        LINHA EVOLUTIVA
      </h2>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {evolutions.map((evo, index) => (
          <div key={evo.id} className="flex items-center">
            <div
              className="bg-purple-800/50 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:shadow-xl transition transform hover:scale-105 border-2 border-purple-500/30 hover:border-yellow-400"
              onClick={() => navigate(`/pokemon/${evo.id}`)}
            >
              <img src={evo.image} alt={evo.name} className="w-28 h-28" />
              <p className="text-center font-pixel text-xs text-purple-200 capitalize mt-2">
                {evo.name}
              </p>
            </div>
            {index < evolutions.length - 1 && (
              <span className="text-4xl text-yellow-400 mx-4 drop-shadow-lg">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
