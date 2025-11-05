// filepath: c:\Users\Gusta\Documents\GitHub\PokemonC\frontend\src\pages\PokemonDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PokemonStats from '../components/PokemonStats';
import PokemonImage from '../components/PokemonImage';
import TypeMatchups from '../components/TypeMatchups';
import EvolutionChain from '../components/EvolutionChain';
import MegaEvolutions from '../components/MegaEvolutions';
import { typeMatchups } from '../utils/typeMatchups';

interface TypeInfo {
  type: { name: string };
}

interface EvolutionData {
  id: number;
  name: string;
  image: string;
  isMega?: boolean;
  megaType?: string[];
}

interface PokemonVariety {
  name: string;
  displayName: string;
  isDefault: boolean;
  url: string;
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
  megaEvolutions?: EvolutionData[];
}

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(true);
  const [varieties, setVarieties] = useState<PokemonVariety[]>([]);
  const [selectedVariety, setSelectedVariety] = useState<string>('');

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

      const megaEvolutions = await fetchMegaEvolutions(data.name);

      // Buscar formas alternativas
      const varietiesData = speciesResponse.data.varieties;
      const formattedVarieties: PokemonVariety[] = varietiesData.map((variety: any) => ({
        name: variety.pokemon.name,
        displayName: variety.pokemon.name.replace(/-/g, ' ').toUpperCase(),
        isDefault: variety.is_default,
        url: variety.pokemon.url,
      }));
      
      setVarieties(formattedVarieties);
      setSelectedVariety(data.name); // Selecionar a forma atual

      // Detectar se é Mega para usar sprites consistentes
      const isMega = data.name.includes('-mega');

      let normalSprite, shinySprite;
      
      if (isMega) {
        // Mega: SEMPRE usar 'home' (256x256) para ter consistência entre normal e shiny
        normalSprite = 
          data.sprites.other.home?.front_default ||
          data.sprites.front_default;

        shinySprite = 
          data.sprites.other.home?.front_shiny ||
          data.sprites.front_shiny;
      } else {
        // Pokémon normal: usar 'official-artwork' (melhor qualidade - 475x475)
        normalSprite = 
          data.sprites.other['official-artwork']?.front_default ||
          data.sprites.other.home?.front_default ||
          data.sprites.front_default;

        shinySprite = 
          data.sprites.other['official-artwork']?.front_shiny ||
          data.sprites.other.home?.front_shiny ||
          data.sprites.front_shiny;
      }

      const pokemonInfo: PokemonData = {
        id: data.id,
        name: data.name,
        normalSprite,
        shinySprite,
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
        megaEvolutions,
      };

      setPokemon(pokemonInfo);
    } catch (error) {
      console.error('Erro ao carregar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMegaEvolutions = async (pokemonName: string): Promise<EvolutionData[]> => {
    const megas: EvolutionData[] = [];
    
    try {
      // Tentar buscar Mega evolução padrão
      const megaVariants = ['mega', 'mega-x', 'mega-y'];
      
      for (const variant of megaVariants) {
        try {
          const megaName = `${pokemonName}-${variant}`;
          const megaResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${megaName}`);
          const megaData = megaResponse.data;
          
          const types: string[] = megaData.types.map((t: TypeInfo) => t.type.name);
          
          // Priorizar 'home' para Megas (256x256) - melhor consistência
          const sprite = 
            megaData.sprites.other.home?.front_default ||
            megaData.sprites.other['official-artwork']?.front_default ||
            megaData.sprites.other.showdown?.front_default ||
            megaData.sprites.front_default;
          
          megas.push({
            id: megaData.id,
            name: megaData.name,
            image: sprite,
            isMega: true,
            megaType: types,
          });
        } catch (err) {
          // Mega não existe para esse Pokémon/variante
          continue;
        }
      }
    } catch (error) {
      console.log('Nenhuma mega evolução encontrada');
    }
    
    return megas;
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
        isMega: false,
      });

      current = current.evolves_to[0];
    }

    return evolutions;
  };

  const handleVarietyChange = async (varietyName: string) => {
    try {
      setLoading(true);
      setSelectedVariety(varietyName);
      
      // Buscar dados da forma selecionada
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${varietyName}`);
      const data = response.data;

      // Detectar se é Mega para usar sprites consistentes
      const isMega = varietyName.includes('-mega');

      let normalSprite, shinySprite;
      
      if (isMega) {
        // Mega: SEMPRE usar 'home' (256x256) para ter consistência entre normal e shiny
        normalSprite = 
          data.sprites.other.home?.front_default ||
          data.sprites.front_default;

        shinySprite = 
          data.sprites.other.home?.front_shiny ||
          data.sprites.front_shiny;
      } else {
        // Pokémon normal: usar 'official-artwork' (melhor qualidade - 475x475)
        normalSprite = 
          data.sprites.other['official-artwork']?.front_default ||
          data.sprites.other.home?.front_default ||
          data.sprites.front_default;

        shinySprite = 
          data.sprites.other['official-artwork']?.front_shiny ||
          data.sprites.other.home?.front_shiny ||
          data.sprites.front_shiny;
      }

      // Atualizar pokemon mantendo evoluções e mega evoluções
      if (pokemon) {
        const updatedPokemon: PokemonData = {
          ...pokemon,
          id: data.id,
          name: data.name,
          normalSprite,
          shinySprite,
          types: data.types.map((t: TypeInfo) => t.type.name),
          baseStats: {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            spAttack: data.stats[3].base_stat,
            spDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat,
          },
        };

        setPokemon(updatedPokemon);
      }
    } catch (error) {
      console.error('Erro ao trocar forma:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTypeEffectiveness = (defenderTypes: string[]) => {
    const weaknesses: Record<string, number> = {};
    const resistances: Record<string, number> = {};
    const advantages: Record<string, number> = {};

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

    // Calcular vantagens (contra quais tipos o Pokémon causa dano aumentado)
    const allTypes = Object.keys(typeMatchups);
    allTypes.forEach(targetType => {
      const targetMatchup = typeMatchups[targetType];
      if (targetMatchup) {
        defenderTypes.forEach(ourType => {
          // Se o tipo alvo tem fraqueza ao nosso tipo
          if (targetMatchup[ourType] && targetMatchup[ourType] > 1) {
            advantages[targetType] = Math.max(advantages[targetType] || 0, targetMatchup[ourType]);
          }
        });
      }
    });

    return { weaknesses, resistances, advantages };
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

  const { weaknesses, resistances, advantages } = calculateTypeEffectiveness(pokemon.types);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700 flex flex-col">
      {/* Header */}
      <header className="py-8">
        <h1 className="text-center text-6xl font-pixel text-yellow-400 drop-shadow-lg mb-8">
          ChampionDex
        </h1>
        
        {/* Navigation */}
        <nav className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
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
        <div className="container mx-auto px-4">
          {/* Botão Voltar */}
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-6 py-3 rounded-lg shadow-lg mb-8"
          >
            ← VOLTAR
          </button>

        <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-8 shadow-2xl mb-12 border-2 border-purple-500/50">
          {/* Header - Nome e ID */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-pixel text-yellow-400 capitalize mb-2 drop-shadow-lg">
              {pokemon.name}
            </h1>
            <p className="text-2xl font-pixel text-purple-300">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
          </div>

          {/* Selector de Formas Alternativas */}
          {varieties.length > 1 && (
            <div className="text-center mb-8">
              <label className="font-pixel text-purple-200 text-sm mr-3">
                Forma:
              </label>
              <select
                value={selectedVariety}
                onChange={(e) => handleVarietyChange(e.target.value)}
                className="font-pixel bg-purple-800/50 text-yellow-400 px-6 py-3 rounded-lg border-2 border-purple-500/50 hover:bg-purple-700/50 transition cursor-pointer"
              >
                {varieties.map((variety) => (
                  <option key={variety.name} value={variety.name}>
                    {variety.displayName} {variety.isDefault && '(ORIGINAL)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Layout Principal: Stats (Esquerda) + Pokémon (Centro) + Type Matchups (Direita) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <PokemonStats stats={pokemon.baseStats} />
            <PokemonImage
              normalSprite={pokemon.normalSprite}
              shinySprite={pokemon.shinySprite}
              name={pokemon.name}
              types={pokemon.types}
              isShiny={isShiny}
              setIsShiny={setIsShiny}
            />
            <TypeMatchups
              advantages={advantages}
              weaknesses={weaknesses}
              resistances={resistances}
            />
          </div>

          {/* Linha Evolutiva e Mega Evoluções lado a lado */}
          {(pokemon.evolutions.length > 1 || (pokemon.megaEvolutions && pokemon.megaEvolutions.length > 0)) && (
            <div className="border-t-2 border-purple-500/30 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ESQUERDA: Linha Evolutiva */}
                {pokemon.evolutions.length > 1 && (
                  <EvolutionChain evolutions={pokemon.evolutions} />
                )}

                {/* DIREITA: Mega Evoluções */}
                {pokemon.megaEvolutions && pokemon.megaEvolutions.length > 0 && (
                  <MegaEvolutions megaEvolutions={pokemon.megaEvolutions} />
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-6 mt-auto">
        <p className="text-center font-pixel text-lg">
          © 2025 Gustavo Viana
        </p>
      </footer>
    </div>
  );
}