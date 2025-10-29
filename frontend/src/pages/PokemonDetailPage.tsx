// filepath: c:\Users\Gusta\Documents\GitHub\PokemonC\frontend\src\pages\PokemonDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TypeInfo {
  type: { name: string };
}

interface StatInfo {
  base_stat: number;
  stat: { name: string };
}

interface EvolutionData {
  id: number;
  name: string;
  image: string;
}

interface PokemonData {
  id: number;
  name: string;
  normalSprite: string;
  shinySprite: string;
  types: string[];
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  evolutions: EvolutionData[];
}

const typeColors: Record<string, string> = {
  normal: 'bg-gray-500', fire: 'bg-red-500', water: 'bg-blue-500',
  electric: 'bg-yellow-400', grass: 'bg-green-500', ice: 'bg-cyan-300',
  fighting: 'bg-red-700', poison: 'bg-purple-500', ground: 'bg-yellow-600',
  flying: 'bg-indigo-400', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-700', ghost: 'bg-purple-700', dragon: 'bg-indigo-700',
  dark: 'bg-gray-700', steel: 'bg-gray-500', fairy: 'bg-pink-300',
};

const typeMatchups: Record<string, Record<string, number>> = {
  normal: { fighting: 2, ghost: 0 },
  fire: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
  water: { electric: 2, grass: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
  grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, water: 0.5, electric: 0.5, grass: 0.5, ground: 0.5 },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5 },
  poison: { ground: 2, psychic: 2, fighting: 0.5, poison: 0.5, bug: 0.5, grass: 0.5, fairy: 0.5 },
  ground: { water: 2, ice: 2, grass: 2, poison: 0.5, rock: 0.5, electric: 0 },
  flying: { electric: 2, ice: 2, rock: 2, fighting: 0.5, bug: 0.5, grass: 0.5, ground: 0 },
  psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
  bug: { fire: 2, flying: 2, rock: 2, fighting: 0.5, grass: 0.5, ground: 0.5 },
  rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
  ghost: { ghost: 2, dark: 2, poison: 0.5, bug: 0.5, normal: 0, fighting: 0 },
  dragon: { ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, grass: 0.5 },
  dark: { fighting: 2, bug: 2, fairy: 2, ghost: 0.5, dark: 0.5, psychic: 0 },
  steel: { fire: 2, fighting: 2, ground: 2, normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5, poison: 0 },
  fairy: { poison: 2, steel: 2, fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0 },
};

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPokemonDetails();
  }, [id]);

  const loadPokemonDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = response.data;

      const speciesResponse = await axios.get(data.species.url);
      const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);

      const evolutions = await parseEvolutionChain(evolutionResponse.data.chain);

      const pokemonInfo: PokemonData = {
        id: data.id,
        name: data.name,
        normalSprite: data.sprites.other['official-artwork'].front_default,
        shinySprite: data.sprites.other['official-artwork'].front_shiny,
        types: data.types.map((t: TypeInfo) => t.type.name),
        baseStats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          spAttack: data.stats[3].base_stat,
          spDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
        evolutions,
      };

      setPokemon(pokemonInfo);
    } catch (error) {
      console.error('Erro ao carregar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseEvolutionChain = async (chain: any): Promise<EvolutionData[]> => {
    const evolutions: EvolutionData[] = [];
    let current = chain;

    while (current) {
      const pokemonId = parseInt(current.species.url.split('/').slice(-2, -1)[0]);
      const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
      
      evolutions.push({
        id: pokemonId,
        name: current.species.name,
        image: sprite,
      });

      current = current.evolves_to[0];
    }

    return evolutions;
  };

  const calculateTypeEffectiveness = (defenderTypes: string[]) => {
    const weaknesses: Record<string, number> = {};
    const resistances: Record<string, number> = {};

    defenderTypes.forEach(defenderType => {
      const matchup = typeMatchups[defenderType];
      if (matchup) {
        Object.entries(matchup).forEach(([attackerType, multiplier]) => {
          if (multiplier > 1) {
            weaknesses[attackerType] = (weaknesses[attackerType] || 1) * multiplier;
          } else if (multiplier < 1) {
            resistances[attackerType] = (resistances[attackerType] || 1) * multiplier;
          }
        });
      }
    });

    return { weaknesses, resistances };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700 flex items-center justify-center">
        <p className="text-white font-pixel text-2xl">CARREGANDO...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700 flex items-center justify-center">
        <p className="text-white font-pixel text-2xl">POKÉMON NÃO ENCONTRADO</p>
      </div>
    );
  }

  const { weaknesses, resistances } = calculateTypeEffectiveness(pokemon.types);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700 py-8">
      <div className="container mx-auto px-4">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/')}
          className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-6 py-3 rounded-lg shadow-lg mb-8"
        >
          ← VOLTAR
        </button>

        <div className="bg-white/90 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-pixel text-purple-900 capitalize mb-2">
              {pokemon.name}
            </h1>
            <p className="text-2xl font-pixel text-gray-600">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
          </div>

          {/* Imagem e Shiny Toggle */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <img
                src={isShiny ? pokemon.shinySprite : pokemon.normalSprite}
                alt={pokemon.name}
                className="w-64 h-64 object-contain"
              />
              <button
                onClick={() => setIsShiny(!isShiny)}
                className="absolute top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-4 py-2 rounded-lg shadow-lg text-sm"
              >
                ✨ {isShiny ? 'NORMAL' : 'SHINY'}
              </button>
            </div>
          </div>

          {/* Tipos */}
          <div className="flex justify-center gap-3 mb-8">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`${typeColors[type]} text-white font-pixel px-6 py-2 rounded-lg uppercase shadow-lg`}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Stats Base */}
          <div className="mb-8">
            <h2 className="text-2xl font-pixel text-purple-900 mb-4 text-center">
              STATUS BASE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(pokemon.baseStats).map(([stat, value]) => (
                <div key={stat} className="bg-purple-100 rounded-lg p-4">
                  <p className="font-pixel text-xs text-purple-900 uppercase mb-2">
                    {stat.replace('sp', 'Sp. ')}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-300 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${(value / 255) * 100}%` }}
                      />
                    </div>
                    <span className="font-pixel text-sm text-purple-900 min-w-[40px]">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linha Evolutiva */}
          {pokemon.evolutions.length > 1 && (
            <div className="mb-8">
              <h2 className="text-2xl font-pixel text-purple-900 mb-4 text-center">
                LINHA EVOLUTIVA
              </h2>
              <div className="flex justify-center items-center gap-6 flex-wrap">
                {pokemon.evolutions.map((evo, index) => (
                  <div key={evo.id} className="flex items-center">
                    <div
                      className="bg-purple-100 rounded-lg p-4 cursor-pointer hover:shadow-xl transition"
                      onClick={() => navigate(`/pokemon/${evo.id}`)}
                    >
                      <img src={evo.image} alt={evo.name} className="w-24 h-24" />
                      <p className="text-center font-pixel text-xs text-purple-900 capitalize mt-2">
                        {evo.name}
                      </p>
                    </div>
                    {index < pokemon.evolutions.length - 1 && (
                      <span className="text-4xl text-purple-900 mx-4">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fraquezas */}
          <div className="mb-8">
            <h2 className="text-2xl font-pixel text-purple-900 mb-4 text-center">
              FRAQUEZAS
            </h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {Object.entries(weaknesses).map(([type, multiplier]) => (
                <div key={type} className="text-center">
                  <span className={`${typeColors[type]} text-white font-pixel px-4 py-2 rounded-lg uppercase shadow-lg block mb-2`}>
                    {type}
                  </span>
                  <span className="font-pixel text-sm text-red-600">
                    {multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resistências */}
          <div>
            <h2 className="text-2xl font-pixel text-purple-900 mb-4 text-center">
              RESISTÊNCIAS
            </h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {Object.entries(resistances).map(([type, multiplier]) => (
                <div key={type} className="text-center">
                  <span className={`${typeColors[type]} text-white font-pixel px-4 py-2 rounded-lg uppercase shadow-lg block mb-2`}>
                    {type}
                  </span>
                  <span className="font-pixel text-sm text-green-600">
                    {multiplier}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}