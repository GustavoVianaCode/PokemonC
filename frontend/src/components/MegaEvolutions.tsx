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
    <div className="border-t-2 border-pink-300 pt-8 mt-8">
      <h2 className="text-2xl font-pixel text-pink-600 mb-6 text-center">
        MEGA EVOLUÇÕES
      </h2>
      <div className="flex justify-center items-center gap-6 flex-wrap">
        {megaEvolutions.map((mega) => (
          <div
            key={mega.id}
            className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg p-4 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 relative"
            onClick={() => navigate(`/pokemon/${mega.id}`)}
          >
            <div className="absolute top-2 right-2 bg-pink-600 text-white font-pixel text-[8px] px-2 py-1 rounded shadow-lg">
              MEGA
            </div>
            <img src={mega.image} alt={mega.name} className="w-32 h-32" />
            <p className="text-center font-pixel text-xs text-purple-900 capitalize mt-2">
              {mega.name}
            </p>
            {mega.megaType && (
              <div className="flex justify-center gap-1 mt-2">
                {mega.megaType.map((type) => (
                  <span
                    key={type}
                    className={`${typeColors[type]} text-white font-pixel px-2 py-1 rounded text-[8px] uppercase`}
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
