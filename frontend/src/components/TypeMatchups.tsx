import { typeColors } from '../utils/typeColors';

interface TypeMatchupsProps {
  advantages: Record<string, number>;
  weaknesses: Record<string, number>;
  resistances: Record<string, number>;
}

export default function TypeMatchups({
  advantages,
  weaknesses,
  resistances,
}: TypeMatchupsProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Vantagens */}
      {Object.keys(advantages).length > 0 && (
        <div>
          <h3 className="text-sm font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
            VANTAGENS
          </h3>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {Object.entries(advantages).map(([type, multiplier]) => (
              <div key={type} className="text-center">
                <span
                  className={`${typeColors[type]} text-white font-pixel px-2 py-0.5 rounded-lg uppercase shadow-lg block mb-0.5 text-[9px] border-2 border-white/20`}
                >
                  {type}
                </span>
                <span className="font-pixel text-[8px] text-blue-400">
                  {multiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fraquezas */}
      {Object.keys(weaknesses).length > 0 && (
        <div>
          <h3 className="text-sm font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
            FRAQUEZAS
          </h3>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {Object.entries(weaknesses).map(([type, multiplier]) => (
              <div key={type} className="text-center">
                <span
                  className={`${typeColors[type]} text-white font-pixel px-2 py-0.5 rounded-lg uppercase shadow-lg block mb-0.5 text-[9px] border-2 border-white/20`}
                >
                  {type}
                </span>
                <span className="font-pixel text-[8px] text-red-400">
                  {multiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resistências */}
      {Object.keys(resistances).length > 0 && (
        <div>
          <h3 className="text-sm font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
            RESISTÊNCIAS
          </h3>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {Object.entries(resistances).map(([type, multiplier]) => (
              <div key={type} className="text-center">
                <span
                  className={`${typeColors[type]} text-white font-pixel px-2 py-0.5 rounded-lg uppercase shadow-lg block mb-0.5 text-[9px] border-2 border-white/20`}
                >
                  {type}
                </span>
                <span className="font-pixel text-[8px] text-green-400">
                  {multiplier}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
