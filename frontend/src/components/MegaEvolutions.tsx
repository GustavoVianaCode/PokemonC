import { useNavigate } from 'react-router-dom';
import { typeColors } from '../utils/typeColors';

interface EvolutionData {
  id: number;
  name: string;
  image: string;
  isMega?: boolean;
  megaType?: string[];
}

interface MegaEvolutionsProps {
  megaEvolutions?: EvolutionData[];
}

export default function MegaEvolutions({ megaEvolutions }: MegaEvolutionsProps) {
  const navigate = useNavigate();

  if (!megaEvolutions || megaEvolutions.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-lg font-pixel text-pink-400 mb-3 text-center drop-shadow-lg">
        MEGA EVOLUÇÕES
      </h2>
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {megaEvolutions.map((mega) => (
          <div
            key={mega.id}
            className="bg-gradient-to-br from-purple-600/50 to-pink-600/50 backdrop-blur-sm rounded-lg p-2 shadow-xl border-2 border-pink-400/50 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 relative"
            onClick={() => navigate(`/pokemon/${mega.id}`)}
          >
            <div className="absolute top-1 right-1 bg-pink-600 text-white font-pixel text-[7px] px-1.5 py-0.5 rounded-full shadow-lg">
              MEGA
            </div>
            <img src={mega.image} alt={mega.name} className="w-24 h-24" />
            <p className="text-center font-pixel text-[9px] text-purple-100 capitalize mt-1">
              {mega.name.replace('-', ' ')}
            </p>
            {mega.megaType && (
              <div className="flex justify-center gap-0.5 mt-1">
                {mega.megaType.map((type) => (
                  <span
                    key={type}
                    className={`${typeColors[type]} text-white font-pixel px-1.5 py-0.5 rounded text-[7px] uppercase shadow-lg border border-white/30`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
