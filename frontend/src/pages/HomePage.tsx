import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  hasVarieties?: boolean;
  varietyCount?: number;
}

interface PokemonVariety {
  name: string;
  displayName: string;
  sprite: string;
  types: string[];
  isDefault: boolean;
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
  normal: 'bg-gray-500',
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

const POKEMON_GAMES = [
  // Gen 1 - Kanto
  { id: 1, name: 'red-blue', displayName: 'Pokémon Red/Blue', generation: 1, pokedex: 'kanto' },
  { id: 2, name: 'yellow', displayName: 'Pokémon Yellow', generation: 1, pokedex: 'kanto' },
  // Gen 2 - Johto
  { id: 3, name: 'gold-silver', displayName: 'Pokémon Gold/Silver', generation: 2, pokedex: 'original-johto' },
  { id: 4, name: 'crystal', displayName: 'Pokémon Crystal', generation: 2, pokedex: 'original-johto' },
  // Gen 3 - Hoenn
  { id: 5, name: 'ruby-sapphire', displayName: 'Pokémon Ruby/Sapphire', generation: 3, pokedex: 'hoenn' },
  { id: 6, name: 'emerald', displayName: 'Pokémon Emerald', generation: 3, pokedex: 'hoenn' },
  { id: 7, name: 'firered-leafgreen', displayName: 'Pokémon FireRed/LeafGreen', generation: 3, pokedex: 'kanto' },
  // Gen 4 - Sinnoh
  { id: 8, name: 'diamond-pearl', displayName: 'Pokémon Diamond/Pearl', generation: 4, pokedex: 'original-sinnoh' },
  { id: 9, name: 'platinum', displayName: 'Pokémon Platinum', generation: 4, pokedex: 'extended-sinnoh' },
  { id: 10, name: 'heartgold-soulsilver', displayName: 'Pokémon HeartGold/SoulSilver', generation: 4, pokedex: 'updated-johto' },
  // Gen 5 - Unova
  { id: 11, name: 'black-white', displayName: 'Pokémon Black/White', generation: 5, pokedex: 'original-unova' },
  { id: 12, name: 'black-2-white-2', displayName: 'Pokémon Black 2/White 2', generation: 5, pokedex: 'updated-unova' },
  // Gen 6 - Kalos
  { id: 13, name: 'x-y', displayName: 'Pokémon X/Y', generation: 6, pokedex: 'kalos-central' },
  { id: 14, name: 'omega-ruby-alpha-sapphire', displayName: 'Pokémon Omega Ruby/Alpha Sapphire', generation: 6, pokedex: 'updated-hoenn' },
  // Gen 7 - Alola
  { id: 15, name: 'sun-moon', displayName: 'Pokémon Sun/Moon', generation: 7, pokedex: 'original-alola' },
  { id: 16, name: 'ultra-sun-ultra-moon', displayName: 'Pokémon Ultra Sun/Ultra Moon', generation: 7, pokedex: 'updated-alola' },
  // Gen 8 - Galar/Sinnoh
  { id: 17, name: 'sword-shield', displayName: 'Pokémon Sword/Shield', generation: 8, pokedex: 'galar' },
  { id: 18, name: 'brilliant-diamond-shining-pearl', displayName: 'Pokémon Brilliant Diamond/Shining Pearl', generation: 8, pokedex: 'original-sinnoh' },
  { id: 19, name: 'legends-arceus', displayName: 'Pokémon Legends: Arceus', generation: 8, pokedex: 'hisui' },
  // Gen 9 - Paldea
  { id: 20, name: 'scarlet-violet', displayName: 'Pokémon Scarlet/Violet', generation: 9, pokedex: 'paldea' },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGeneration, setSelectedGeneration] = useState(1);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [showVarietiesModal, setShowVarietiesModal] = useState(false);
  const [selectedPokemonVarieties, setSelectedPokemonVarieties] = useState<PokemonVariety[]>([]);
  const [varietiesLoading, setVarietiesLoading] = useState(false);
  const navigate = useNavigate();

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

      // Buscar dados completos de cada Pokémon (incluindo tipos e formas alternativas)
      const results = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
          const detailsResponse = await axios.get(pokemon.url);
          const pokemonData = detailsResponse.data;
          
          // Buscar espécie para verificar se tem formas alternativas
          let hasVarieties = false;
          let varietyCount = 0;
          
          try {
            const speciesResponse = await axios.get(pokemonData.species.url);
            const varieties = speciesResponse.data.varieties;
            hasVarieties = varieties.length > 1;
            varietyCount = varieties.length - 1; // Excluir a forma base
          } catch (error) {
            // Se falhar, continua sem formas alternativas
          }
          
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default,
            types: pokemonData.types.map((typeInfo: PokemonType) => typeInfo.type.name),
            hasVarieties,
            varietyCount,
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

  const fetchPokemonByGame = async (gameName: string) => {
    try {
      const game = POKEMON_GAMES.find(g => g.name === gameName);
      if (!game) return;

      setLoading(true);

      const response = await axios.get(`https://pokeapi.co/api/v2/pokedex/${game.pokedex}`);
      const pokemonEntries = response.data.pokemon_entries;

      const results = await Promise.all(
        pokemonEntries.map(async (entry: any) => {
          const pokemonId = parseInt(entry.pokemon_species.url.split('/').slice(-2, -1)[0]);
          const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
          const pokemonData = pokemonResponse.data;

          // Buscar espécie para verificar se tem formas alternativas
          let hasVarieties = false;
          let varietyCount = 0;
          
          try {
            const speciesResponse = await axios.get(pokemonData.species.url);
            const varieties = speciesResponse.data.varieties;
            hasVarieties = varieties.length > 1;
            varietyCount = varieties.length - 1;
          } catch (error) {
            // Se falhar, continua sem formas alternativas
          }

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default,
            types: pokemonData.types.map((typeInfo: PokemonType) => typeInfo.type.name),
            hasVarieties,
            varietyCount,
          };
        })
      );

      setPokemonList(results);
      setFilteredPokemon(results);
    } catch (error) {
      console.error('Erro ao buscar pokémon por jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = async (gameName: string) => {
    setSelectedGame(gameName);
    
    if (gameName === '') {
      // Volta para o filtro por geração
      fetchPokemon();
    } else {
      // Busca Pokémon do jogo selecionado
      await fetchPokemonByGame(gameName);
    }
  };

  const fetchVarieties = async (pokemonId: number) => {
    try {
      setVarietiesLoading(true);
      
      // Buscar espécie do Pokémon
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
      const varieties = speciesResponse.data.varieties;

      // Buscar detalhes de cada forma
      const varietiesData = await Promise.all(
        varieties.map(async (variety: any) => {
          const varResponse = await axios.get(variety.pokemon.url);
          const varData = varResponse.data;
          
          return {
            name: varData.name,
            displayName: varData.name.replace(/-/g, ' ').toUpperCase(),
            sprite: varData.sprites.other['official-artwork']?.front_default || varData.sprites.front_default,
            types: varData.types.map((t: PokemonType) => t.type.name),
            isDefault: variety.is_default,
          };
        })
      );

      setSelectedPokemonVarieties(varietiesData);
      setShowVarietiesModal(true);
    } catch (error) {
      console.error('Erro ao buscar formas alternativas:', error);
    } finally {
      setVarietiesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700 flex flex-col">
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
          <button 
            onClick={() => navigate('/criar-time')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            CRIAR TIME
          </button>
          <button 
            onClick={() => navigate('/meus-times')}
            className="bg-green-500 hover:bg-green-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            MEUS TIMES
          </button>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow">
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

      {/* Game Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-white font-pixel text-xl mb-4">
            OU ESCOLHA UM JOGO
          </h2>
          <select
            value={selectedGame}
            onChange={(e) => handleGameSelect(e.target.value)}
            className="w-full px-6 py-4 rounded-lg text-lg font-pixel border-4 border-blue-500 focus:outline-none focus:border-blue-600 shadow-lg bg-white text-purple-900"
          >
            <option value="">🎮 Todos os Jogos (Filtrar por Geração)</option>
            
            <optgroup label="🔴 Gen 1 - Kanto">
              <option value="red-blue">🔴 Pokémon Red/Blue</option>
              <option value="yellow">⚡ Pokémon Yellow</option>
            </optgroup>

            <optgroup label="🥇 Gen 2 - Johto">
              <option value="gold-silver">🥇 Pokémon Gold/Silver</option>
              <option value="crystal">💎 Pokémon Crystal</option>
            </optgroup>

            <optgroup label="🔥 Gen 3 - Hoenn">
              <option value="ruby-sapphire">🔥 Pokémon Ruby/Sapphire</option>
              <option value="emerald">💚 Pokémon Emerald</option>
              <option value="firered-leafgreen">🍃 Pokémon FireRed/LeafGreen</option>
            </optgroup>

            <optgroup label="💎 Gen 4 - Sinnoh/Johto">
              <option value="diamond-pearl">💎 Pokémon Diamond/Pearl</option>
              <option value="platinum">⚪ Pokémon Platinum</option>
              <option value="heartgold-soulsilver">❤️ Pokémon HeartGold/SoulSilver</option>
            </optgroup>

            <optgroup label="⚫ Gen 5 - Unova">
              <option value="black-white">⚫ Pokémon Black/White</option>
              <option value="black-2-white-2">⚫ Pokémon Black 2/White 2</option>
            </optgroup>

            <optgroup label="🔵 Gen 6 - Kalos/Hoenn">
              <option value="x-y">🔵 Pokémon X/Y</option>
              <option value="omega-ruby-alpha-sapphire">🌊 Pokémon Omega Ruby/Alpha Sapphire</option>
            </optgroup>

            <optgroup label="☀️ Gen 7 - Alola">
              <option value="sun-moon">☀️ Pokémon Sun/Moon</option>
              <option value="ultra-sun-ultra-moon">🌙 Pokémon Ultra Sun/Ultra Moon</option>
            </optgroup>

            <optgroup label="⚔️ Gen 8 - Galar/Sinnoh/Hisui">
              <option value="sword-shield">⚔️ Pokémon Sword/Shield</option>
              <option value="brilliant-diamond-shining-pearl">✨ Pokémon Brilliant Diamond/Shining Pearl</option>
              <option value="legends-arceus">🏔️ Pokémon Legends: Arceus</option>
            </optgroup>

            <optgroup label="🌺 Gen 9 - Paldea">
              <option value="scarlet-violet">🌺 Pokémon Scarlet/Violet</option>
            </optgroup>
          </select>
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
                className="bg-gray-400 rounded-lg p-4 shadow-lg p-2 shadow-lg hover:shadow-xl transform transition hover:scale-105 relative"
              >
                <div onClick={() => navigate(`/pokemon/${pokemon.id}`)} className="cursor-pointer">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-full h-40 object-contain"
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

                {/* Badge de Formas Alternativas */}
                {pokemon.hasVarieties && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchVarieties(pokemon.id);
                    }}
                    className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 text-white text-[8px] font-pixel px-2 py-1 rounded shadow-lg transition transform hover:scale-110"
                  >
                    🔄 +{pokemon.varietyCount}
                  </button>
                )}
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
      </main>

      {/* Modal de Formas Alternativas */}
      {showVarietiesModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVarietiesModal(false)}
        >
          <div 
            className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-400 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-pixel text-yellow-400 drop-shadow-lg">
                FORMAS ALTERNATIVAS
              </h2>
              <button 
                onClick={() => setShowVarietiesModal(false)}
                className="text-5xl text-yellow-400 hover:text-yellow-300 transition"
              >
                ×
              </button>
            </div>

            {varietiesLoading ? (
              <div className="text-center text-white font-pixel text-xl py-8">
                CARREGANDO FORMAS...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedPokemonVarieties.map((variety, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setShowVarietiesModal(false);
                      // Extrair ID do nome se possível, senão buscar
                      const pokemonName = variety.name;
                      navigate(`/pokemon/${pokemonName}`);
                    }}
                    className="bg-purple-100 rounded-lg p-4 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 border-2 border-purple-300"
                  >
                    <div className="relative">
                      {variety.isDefault && (
                        <div className="absolute top-0 right-0 bg-yellow-400 text-purple-900 text-[8px] font-pixel px-2 py-1 rounded-bl rounded-tr shadow-lg">
                          ORIGINAL
                        </div>
                      )}
                      <img 
                        src={variety.sprite} 
                        alt={variety.name}
                        className="w-full h-48 object-contain"
                      />
                    </div>
                    <p className="font-pixel text-sm text-purple-900 text-center mb-2 mt-2">
                      {variety.displayName}
                    </p>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {variety.types.map((type) => (
                        <span
                          key={type}
                          className={`${TYPE_COLORS[type]} text-white text-[8px] font-pixel px-2 py-1 rounded uppercase shadow`}
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
        </div>
      )}

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-6 mt-auto">
        <p className="text-center font-pixel text-lg">
          © 2025 Gustavo Viana
        </p>
      </footer>
    </div>
  );
}