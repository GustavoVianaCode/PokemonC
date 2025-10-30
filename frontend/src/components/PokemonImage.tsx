import { typeColors } from '../utils/typeColors';

interface PokemonImageProps {
  normalSprite: string;
  shinySprite: string;
  name: string;
  types: string[];
  isShiny: boolean;
  setIsShiny: (value: boolean) => void;
}

export default function PokemonImage({
  normalSprite,
  shinySprite,
  name,
  types,
  isShiny,
  setIsShiny,
}: PokemonImageProps) {
  return (
    <div className="lg:col-span-1 flex flex-col items-center justify-center">
      <div className="relative mb-6">
        <img
          src={isShiny ? shinySprite : normalSprite}
          alt={name}
          className="w-50 h-50 object-contain"
        />
        <button
          className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-4 py-2 rounded-lg shadow-lg text-sm transition transform hover:scale-105"
          onClick={() => setIsShiny(!isShiny)}
        >
          {isShiny ? '✨ SHINY' : '⭐ NORMAL'}
        </button>
      </div>
      <div className="flex gap-3">
        {types.map((type) => (
          <span
            key={type}
            className={`${typeColors[type]} text-white font-pixel px-6 py-2 rounded-lg uppercase shadow-lg`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
