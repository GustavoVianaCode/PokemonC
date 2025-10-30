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
    <div className="lg:col-span-1 space-y-6">
      {/* Vantagens */}
      <div>
        <h3 className="text-lg font-pixel text-purple-900 mb-3 text-center">
          VANTAGENS
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(advantages).map(([type, multiplier]) => (
            <div key={type} className="text-center">
              <span
                className={`${typeColors[type]} text-white font-pixel px-3 py-1 rounded-lg uppercase shadow-lg block mb-1 text-xs`}
              >
                {type}
              </span>
              <span className="font-pixel text-[10px] text-green-600">
                {multiplier}x
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Fraquezas */}
      <div>
        <h3 className="text-lg font-pixel text-purple-900 mb-3 text-center">
          FRAQUEZAS
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(weaknesses).map(([type, multiplier]) => (
            <div key={type} className="text-center">
              <span
                className={`${typeColors[type]} text-white font-pixel px-3 py-1 rounded-lg uppercase shadow-lg block mb-1 text-xs`}
              >
                {type}
              </span>
              <span className="font-pixel text-[10px] text-red-600">
                {multiplier}x
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Resistências */}
      <div>
        <h3 className="text-lg font-pixel text-purple-900 mb-3 text-center">
          RESISTÊNCIAS
        </h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(resistances).map(([type, multiplier]) => (
            <div key={type} className="text-center">
              <span
                className={`${typeColors[type]} text-white font-pixel px-3 py-1 rounded-lg uppercase shadow-lg block mb-1 text-xs`}
              >
                {type}
              </span>
              <span className="font-pixel text-[10px] text-green-600">
                {multiplier}x
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
