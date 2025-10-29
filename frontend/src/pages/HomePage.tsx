import { useState, useEffect } from 'react';
import axios from 'axios';

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

const GENERATIONS = [
  { id: 1, name: 'Gen 1', range: { start: 1, end: 151 } },
  { id: 2, name: 'Gen 2', range: { start: 152, end: 251 } },
  { id: 3, name: 'Gen 3', range: { start: 252, end: 386 } },
  { id: 4, name: 'Gen 4', range: { start: 387, end: 493 } },
  { id: 5, name: 'Gen 5', range: { start: 494, end: 649 } },
  { id: 6, name: 'Gen 6', range: { start: 650, end: 721 } },
  { id: 7, name: 'Gen 7', range: { start: 722, end: 809 } },
  { id: 8, name: 'Gen 8', range: { start: 810, end: 905 } },
  { id: 9, name: 'Gen 9', range: { start: 906, end: 1025 } },
];

const TYPE_COLORS: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-700',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
};

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState(1);

  useEffect(() => {
    fetchPokemon();
  }, [selectedGeneration]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemon(filtered);
    } else {
      setFilteredPokemon(pokemonList);
    }
  }, [searchTerm, pokemonList]);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const generation = GENERATIONS.find(gen => gen.id === selectedGeneration);
      if (!generation) return;

      const { start, end } = generation.range;
      const limit = end - start + 1;
      const offset = start - 1;

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      // Buscar dados completos de cada Pokémon (incluindo tipos)
      const results = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
          const detailsResponse = await axios.get(pokemon.url);
          const pokemonData = detailsResponse.data;
          
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default,
            types: pokemonData.types.map((typeInfo: PokemonType) => typeInfo.type.name),
          };
        })
      );

      setPokemonList(results);
      setFilteredPokemon(results);
    } catch (error) {
      console.error('Erro ao buscar pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700">
      {/* Header */}
      <header className="py-8">
        <h1 className="text-center text-6xl font-pixel text-yellow-400 drop-shadow-lg mb-8">
          ChampionDex
        </h1>
        
        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
            HOME
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
            CRIAR TIME
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
            MEUS TIMES
          </button>
        </nav>
      </header>

      {/* Search Bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 rounded-lg text-lg font-pixel border-4 border-yellow-400 focus:outline-none focus:border-yellow-500 shadow-lg"
          />
        </div>
      </div>

      {/* Generation Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-full mx-auto">
          <h2 className="text-center text-white font-pixel text-xl mb-4">
            ESCOLHA A GERAÇÃO
          </h2>
          <div className="flex justify-center gap-3 min-w-max px-4">
            {GENERATIONS.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setSelectedGeneration(gen.id)}
                className={`font-pixel px-4 py-2 rounded-lg shadow-lg transform transition hover:scale-105 whitespace-nowrap ${
                  selectedGeneration === gen.id
                    ? 'bg-yellow-400 text-purple-900'
                    : 'bg-white/80 text-purple-900 hover:bg-white'
                }`}
              >
                {gen.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="container mx-auto px-4 mb-8">
        {loading ? (
          <div className="text-center text-white font-pixel text-2xl">
            CARREGANDO POKÉMON...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredPokemon.map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-gray-400 rounded-lg p-4 shadow-lg hover:shadow-xl transform transition hover:scale-105 cursor-pointer"
              >
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-full h-24 object-contain"
                />
                <p className="text-center font-pixel text-xs mt-2 text-purple-900">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>
                <p className="text-center font-pixel text-xs text-purple-900 capitalize mb-2">
                  {pokemon.name}
                </p>
                {/* Types */}
                <div className="flex justify-center gap-1 flex-wrap">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className={`${TYPE_COLORS[type]} text-white text-[8px] font-pixel px-2 py-1 rounded uppercase`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Team Button */}
      <div className="container mx-auto px-4 py-8 text-center">
        <button className="bg-red-500 hover:bg-red-600 text-white font-pixel px-12 py-4 rounded-lg shadow-lg transform transition hover:scale-105 text-xl">
          CRIAR NOVO TIME
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-6 mt-8">
        <p className="text-center font-pixel text-lg">
          © 2025 Gustavo Viana
        </p>
      </footer>
    </div>
  );
}