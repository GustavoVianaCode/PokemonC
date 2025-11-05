import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { typeColors } from '../utils/typeColors';
import MovesetModal, { MovesetConfig } from '../components/MovesetModal';

interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  moveset?: MovesetConfig;
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

interface PokemonGame {
  id: number;
  name: string;
  displayName: string;
  generation: number;
  pokedex: string;
  emoji: string;
}

const POKEMON_GAMES: PokemonGame[] = [
  { id: 1, name: 'red-blue', displayName: 'Pokémon Red/Blue', generation: 1, pokedex: 'kanto', emoji: '🔴' },
  { id: 2, name: 'yellow', displayName: 'Pokémon Yellow', generation: 1, pokedex: 'kanto', emoji: '⚡' },
  { id: 3, name: 'gold-silver', displayName: 'Pokémon Gold/Silver', generation: 2, pokedex: 'original-johto', emoji: '🥇' },
  { id: 4, name: 'crystal', displayName: 'Pokémon Crystal', generation: 2, pokedex: 'original-johto', emoji: '💎' },
  { id: 5, name: 'ruby-sapphire', displayName: 'Pokémon Ruby/Sapphire', generation: 3, pokedex: 'hoenn', emoji: '🔥' },
  { id: 6, name: 'emerald', displayName: 'Pokémon Emerald', generation: 3, pokedex: 'hoenn', emoji: '💚' },
  { id: 7, name: 'firered-leafgreen', displayName: 'Pokémon FireRed/LeafGreen', generation: 3, pokedex: 'kanto', emoji: '🍃' },
  { id: 8, name: 'diamond-pearl', displayName: 'Pokémon Diamond/Pearl', generation: 4, pokedex: 'original-sinnoh', emoji: '💎' },
  { id: 9, name: 'platinum', displayName: 'Pokémon Platinum', generation: 4, pokedex: 'extended-sinnoh', emoji: '⚪' },
  { id: 10, name: 'heartgold-soulsilver', displayName: 'Pokémon HeartGold/SoulSilver', generation: 4, pokedex: 'updated-johto', emoji: '❤️' },
  { id: 11, name: 'black-white', displayName: 'Pokémon Black/White', generation: 5, pokedex: 'original-unova', emoji: '⚫' },
  { id: 12, name: 'black-2-white-2', displayName: 'Pokémon Black 2/White 2', generation: 5, pokedex: 'updated-unova', emoji: '⚫' },
  { id: 13, name: 'x-y', displayName: 'Pokémon X/Y', generation: 6, pokedex: 'kalos-central', emoji: '🔵' },
  { id: 14, name: 'omega-ruby-alpha-sapphire', displayName: 'Pokémon Omega Ruby/Alpha Sapphire', generation: 6, pokedex: 'updated-hoenn', emoji: '🌊' },
  { id: 15, name: 'sun-moon', displayName: 'Pokémon Sun/Moon', generation: 7, pokedex: 'original-alola', emoji: '☀️' },
  { id: 16, name: 'ultra-sun-ultra-moon', displayName: 'Pokémon Ultra Sun/Ultra Moon', generation: 7, pokedex: 'updated-alola', emoji: '🌙' },
  { id: 17, name: 'sword-shield', displayName: 'Pokémon Sword/Shield', generation: 8, pokedex: 'galar', emoji: '⚔️' },
  { id: 18, name: 'brilliant-diamond-shining-pearl', displayName: 'Pokémon Brilliant Diamond/Shining Pearl', generation: 8, pokedex: 'original-sinnoh', emoji: '✨' },
  { id: 19, name: 'legends-arceus', displayName: 'Pokémon Legends: Arceus', generation: 8, pokedex: 'hisui', emoji: '🏔️' },
  { id: 20, name: 'scarlet-violet', displayName: 'Pokémon Scarlet/Violet', generation: 9, pokedex: 'paldea', emoji: '🌺' },
];

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [availablePokemon, setAvailablePokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>('');
  
  // Estados para o modal de moveset
  const [showMovesetModal, setShowMovesetModal] = useState(false);
  const [selectedPokemonForMoveset, setSelectedPokemonForMoveset] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      
      // OTIMIZAÇÃO: Verificar cache primeiro
      const cacheKey = 'pokemon-all-1025';
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        const cacheDate = new Date(cachedData.timestamp);
        const now = new Date();
        const daysSinceCache = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Cache válido por 30 dias
        if (daysSinceCache < 30) {
          console.log('📦 Carregando todos os Pokémon do cache...');
          setAvailablePokemon(cachedData.pokemon);
          setLoading(false);
          return;
        } else {
          console.log('🗑️ Cache expirado, buscando novamente...');
          localStorage.removeItem(cacheKey);
        }
      }

      console.log('🔄 Buscando todos os Pokémon da API...');
      const limit = 1025; // Todos os Pokémon até Gen 9
      const offset = 0;
      
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const pokemonDetails = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
          try {
            const details = await axios.get(pokemon.url);
            return {
              id: details.data.id,
              name: details.data.name,
              sprite: details.data.sprites.front_default,
              types: details.data.types.map((t: any) => t.type.name),
            };
          } catch {
            return null;
          }
        })
      );

      const validPokemon = pokemonDetails.filter((p): p is Pokemon => p !== null);
      
      // Salvar no cache
      const cacheData = {
        pokemon: validPokemon,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('💾 Todos os Pokémon salvos no cache!');

      setAvailablePokemon(validPokemon);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para determinar se a forma deve ser incluída no jogo
  const shouldIncludeInGame = (pokemonName: string, gameName: string): boolean => {
    // Sempre incluir forma base
    if (!pokemonName.includes('-')) {
      return true;
    }

    // Mega Evoluções (disponíveis de X/Y em diante)
    if (pokemonName.includes('-mega')) {
      const megaGames = ['x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon'];
      return megaGames.includes(gameName);
    }

    // Formas Alolan (Sun/Moon em diante)
    if (pokemonName.includes('-alola')) {
      const alolanGames = ['sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'brilliant-diamond-shining-pearl', 'legends-arceus', 'scarlet-violet'];
      return alolanGames.includes(gameName);
    }

    // Formas Galarian (Sword/Shield em diante)
    if (pokemonName.includes('-galar')) {
      const galarianGames = ['sword-shield', 'scarlet-violet'];
      return galarianGames.includes(gameName);
    }

    // Formas Hisuian (Legends Arceus em diante)
    if (pokemonName.includes('-hisui')) {
      const hisuianGames = ['legends-arceus', 'scarlet-violet'];
      return hisuianGames.includes(gameName);
    }

    // Formas Paldean (Scarlet/Violet)
    if (pokemonName.includes('-paldea')) {
      return gameName === 'scarlet-violet';
    }

    // Gigamax (Sword/Shield)
    if (pokemonName.includes('-gmax')) {
      return gameName === 'sword-shield';
    }

    // Outras formas específicas
    const formMapping: Record<string, string[]> = {
      '-primal': ['omega-ruby-alpha-sapphire', 'scarlet-violet'],
      '-origin': ['platinum', 'legends-arceus', 'brilliant-diamond-shining-pearl', 'scarlet-violet'],
      '-sky': ['platinum', 'heartgold-soulsilver', 'black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'brilliant-diamond-shining-pearl', 'scarlet-violet'],
      '-therian': ['black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'scarlet-violet'],
      '-black': ['black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'scarlet-violet'],
      '-white': ['black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire', 'sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'scarlet-violet'],
    };

    for (const [formSuffix, allowedGames] of Object.entries(formMapping)) {
      if (pokemonName.includes(formSuffix)) {
        return allowedGames.includes(gameName);
      }
    }

    // Por padrão, incluir outras formas
    return true;
  };

  const fetchPokemonByGame = async (gameName: string) => {
    try {
      setLoading(true);
      
      // OTIMIZAÇÃO 1: Verificar cache primeiro
      const cacheKey = `pokemon-game-${gameName}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        const cachedData = JSON.parse(cached);
        const cacheDate = new Date(cachedData.timestamp);
        const now = new Date();
        const daysSinceCache = (now.getTime() - cacheDate.getTime()) / (1000 * 60 * 60 * 24);
        
        // Cache válido por 30 dias
        if (daysSinceCache < 30) {
          console.log(`📦 Carregando ${gameName} do cache...`);
          setAvailablePokemon(cachedData.pokemon);
          setLoading(false);
          return;
        } else {
          console.log(`🗑️ Cache de ${gameName} expirado, buscando novamente...`);
          localStorage.removeItem(cacheKey);
        }
      }

      console.log(`🔄 Buscando ${gameName} da API...`);
      const game = POKEMON_GAMES.find(g => g.name === gameName);
      if (!game) return;

      const response = await axios.get(`https://pokeapi.co/api/v2/pokedex/${game.pokedex}`);
      const pokemonEntries = response.data.pokemon_entries;

      // OTIMIZAÇÃO 2: Verificar se precisa buscar varieties
      const needsVarieties = ['sun-moon', 'ultra-sun-ultra-moon', 'sword-shield', 'legends-arceus', 'scarlet-violet', 'x-y', 'omega-ruby-alpha-sapphire'];
      const shouldFetchVarieties = needsVarieties.includes(gameName);

      let allPokemon: Pokemon[];

      if (!shouldFetchVarieties) {
        // OTIMIZAÇÃO 3: Busca rápida (sem varieties) com Promise.all
        console.log(`⚡ Modo rápido para ${gameName} (sem formas alternativas)`);
        
        const pokemonDetails = await Promise.all(
          pokemonEntries.map(async (entry: any) => {
            try {
              const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${entry.pokemon_species.name}`;
              const pokemonResponse = await axios.get(pokemonUrl);
              const pokemonData = pokemonResponse.data;

              return {
                id: pokemonData.id,
                name: pokemonData.name,
                sprite: pokemonData.sprites.front_default,
                types: pokemonData.types.map((t: any) => t.type.name),
              };
            } catch {
              return null;
            }
          })
        );

        allPokemon = pokemonDetails.filter((p): p is Pokemon => p !== null);
        
      } else {
        // OTIMIZAÇÃO 4: Busca completa com varieties usando Promise.all
        console.log(`🔍 Modo completo para ${gameName} (com formas alternativas)`);
        
        const pokemonWithVarieties = await Promise.all(
          pokemonEntries.map(async (entry: any) => {
            try {
              const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${entry.pokemon_species.name}`;
              const speciesResponse = await axios.get(speciesUrl);
              const varieties = speciesResponse.data.varieties;

              const varietyDetails = await Promise.all(
                varieties.map(async (variety: any) => {
                  try {
                    const pokemonResponse = await axios.get(variety.pokemon.url);
                    const pokemonData = pokemonResponse.data;

                    if (shouldIncludeInGame(pokemonData.name, gameName)) {
                      return {
                        id: pokemonData.id,
                        name: pokemonData.name,
                        sprite: pokemonData.sprites.front_default || pokemonData.sprites.other?.home?.front_default,
                        types: pokemonData.types.map((t: any) => t.type.name),
                      };
                    }
                    return null;
                  } catch {
                    return null;
                  }
                })
              );

              return varietyDetails.filter((p): p is Pokemon => p !== null);
            } catch {
              return [];
            }
          })
        );

        allPokemon = pokemonWithVarieties.flat();
      }

      // OTIMIZAÇÃO 5: Salvar no cache
      const cacheData = {
        pokemon: allPokemon,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`💾 ${gameName} salvo no cache! (${allPokemon.length} Pokémon)`);

      setAvailablePokemon(allPokemon);

    } catch (error) {
      console.error('Erro ao buscar Pokémon por jogo:', error);
      alert('❌ Erro ao carregar Pokémon. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGameSelect = async (gameName: string) => {
    setSelectedGame(gameName);
    
    if (gameName === '') {
      fetchPokemon();
    } else {
      await fetchPokemonByGame(gameName);
    }
  };

  const addToTeam = (pokemon: Pokemon) => {
    // Verificar se já está no time
    if (team.some(member => member?.id === pokemon.id)) {
      alert('Este Pokémon já está no seu time!');
      return;
    }

    // Verificar se o time está cheio
    if (team.filter(m => m !== null).length >= 6) {
      alert('Seu time já está completo! Remova um Pokémon antes de adicionar outro.');
      return;
    }

    // Abrir modal de moveset
    setSelectedPokemonForMoveset(pokemon);
    setShowMovesetModal(true);
  };

  const handleMovesetSave = (config: MovesetConfig) => {
    if (!selectedPokemonForMoveset) return;

    const emptyIndex = team.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      const newTeam = [...team];
      newTeam[emptyIndex] = {
        ...selectedPokemonForMoveset,
        moveset: config
      };
      setTeam(newTeam);
    }

    // Fechar modal
    setShowMovesetModal(false);
    setSelectedPokemonForMoveset(null);
  };

  const handleMovesetCancel = () => {
    setShowMovesetModal(false);
    setSelectedPokemonForMoveset(null);
  };

  const removeFromTeam = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  const calculateTypeCoverage = () => {
    const offensiveTypes = new Set<string>();
    const teamTypes: string[] = [];

    team.forEach(member => {
      if (member) {
        member.types.forEach(type => {
          offensiveTypes.add(type);
          teamTypes.push(type);
        });
      }
    });

    // Calcular fraquezas comuns (simplificado)
    const typeWeaknesses: Record<string, string[]> = {
      fire: ['water', 'ground', 'rock'],
      water: ['electric', 'grass'],
      grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
      electric: ['ground'],
      psychic: ['bug', 'ghost', 'dark'],
      normal: ['fighting'],
      fighting: ['flying', 'psychic', 'fairy'],
      flying: ['electric', 'ice', 'rock'],
      poison: ['ground', 'psychic'],
      ground: ['water', 'grass', 'ice'],
      rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
      bug: ['fire', 'flying', 'rock'],
      ghost: ['ghost', 'dark'],
      steel: ['fire', 'fighting', 'ground'],
      dragon: ['ice', 'dragon', 'fairy'],
      dark: ['fighting', 'bug', 'fairy'],
      fairy: ['poison', 'steel'],
      ice: ['fire', 'fighting', 'rock', 'steel'],
    };

    const weaknessCount: Record<string, number> = {};

    teamTypes.forEach(type => {
      const weaknesses = typeWeaknesses[type] || [];
      weaknesses.forEach(weakness => {
        weaknessCount[weakness] = (weaknessCount[weakness] || 0) + 1;
      });
    });

    return { 
      offensiveTypes: Array.from(offensiveTypes), 
      weaknesses: Object.entries(weaknessCount).sort((a, b) => b[1] - a[1])
    };
  };

  const saveTeam = () => {
    if (!teamName.trim()) {
      alert('⚠️ Dê um nome ao seu time!');
      return;
    }

    const teamMembers = team.filter(m => m !== null);
    if (teamMembers.length === 0) {
      alert('⚠️ Adicione pelo menos 1 Pokémon!');
      return;
    }

    const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams') || '[]');
    const newTeam = {
      id: Date.now(),
      name: teamName,
      members: teamMembers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    savedTeams.push(newTeam);
    localStorage.setItem('pokemonTeams', JSON.stringify(savedTeams));
    
    alert('✅ Time salvo com sucesso!');
    navigate('/meus-times');
  };

  const clearPokemonCache = () => {
    const confirmed = confirm('🗑️ Deseja limpar o cache de Pokémon?\n\nIsso forçará o carregamento da API na próxima busca.');
    
    if (confirmed) {
      // Limpar apenas caches de Pokémon, manter times salvos
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pokemon-')) {
          localStorage.removeItem(key);
        }
      });
      alert('✅ Cache de Pokémon limpo com sucesso!');
      console.log('🗑️ Cache limpo pelo usuário');
    }
  };

  const { offensiveTypes, weaknesses } = calculateTypeCoverage();
  const filteredPokemon = availablePokemon.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700">
      {/* Header Compacto */}
      <header className="py-4">
        <h1 className="text-center text-4xl font-pixel text-yellow-400 drop-shadow-lg mb-4">
          ChampionDex
        </h1>
        
        <nav className="flex justify-center gap-3 mb-4">
          <button 
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-5 py-2 rounded-lg shadow-lg transform transition hover:scale-105 text-sm"
          >
            HOME
          </button>
          <button className="bg-blue-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg text-sm">
            CRIAR TIME
          </button>
          <button 
            onClick={() => navigate('/meus-times')}
            className="bg-green-500 hover:bg-green-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg transform transition hover:scale-105 text-sm"
          >
            MEUS TIMES
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-8">
        {/* Header Compacto: Nome + Botão Salvar */}
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-500/50 mb-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <label className="font-pixel text-purple-200 text-xs whitespace-nowrap self-center">
              NOME DO TIME:
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ex: Campeões de Kanto"
              className="flex-grow px-3 py-1.5 rounded-lg font-pixel text-xs bg-purple-800/50 text-yellow-400 border-2 border-purple-500/50 focus:border-yellow-400 outline-none"
              maxLength={30}
            />
            <button
              onClick={saveTeam}
              className="bg-green-500 hover:bg-green-600 text-white font-pixel px-4 py-1.5 rounded-lg shadow-lg transform transition hover:scale-105 text-xs whitespace-nowrap"
            >
              💾 SALVAR
            </button>
          </div>
        </div>

        {/* Layout em 2 Colunas (Desktop) / 1 Coluna (Mobile) */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-3">
          
          {/* COLUNA ESQUERDA: Meu Time + Análise */}
          <div className="space-y-3">
            {/* Meu Time - COMPACTO */}
            <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-500/50">
              <h2 className="text-base font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
                MEU TIME ({team.filter(m => m !== null).length}/6)
              </h2>
              
              <div className="grid grid-cols-3 gap-1.5">
                {team.map((member, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg border-2 ${
                      member 
                        ? 'bg-purple-800/50 border-yellow-400 shadow-lg shadow-yellow-400/20' 
                        : 'bg-purple-950/30 border-purple-500/30 border-dashed'
                    } flex items-center justify-center transition-all hover:scale-105`}
                  >
                    {member ? (
                      <>
                        <img 
                          src={member.sprite} 
                          alt={member.name} 
                          className="w-full h-full object-contain p-0.5" 
                        />
                        <button
                          onClick={() => removeFromTeam(index)}
                          className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white font-pixel text-[8px] w-4 h-4 rounded-full shadow-lg transform transition hover:scale-110 flex items-center justify-center"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white text-center font-pixel text-[7px] rounded-b px-0.5 py-0.5">
                          <div className="truncate capitalize">{member.name}</div>
                        </div>
                      </>
                    ) : (
                      <span className="text-purple-500/50 font-pixel text-xl">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Análise - COMPACTO */}
            {team.filter(m => m !== null).length > 0 && (
              <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-500/50">
                <h3 className="text-sm font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
                  📊 ANÁLISE
                </h3>
                
                <div className="space-y-2">
                  {/* Cobertura */}
                  <div>
                    <p className="font-pixel text-purple-200 text-[9px] mb-1">
                      ⚔️ Cobertura ({offensiveTypes.length}):
                    </p>
                    <div className="flex flex-wrap gap-0.5">
                      {offensiveTypes.map(type => (
                        <span
                          key={type}
                          className={`${typeColors[type]} text-white font-pixel text-[7px] px-1.5 py-0.5 rounded uppercase shadow`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Fraquezas */}
                  {weaknesses.length > 0 && (
                    <div>
                      <p className="font-pixel text-purple-200 text-[9px] mb-1">
                        ⚠️ Fraquezas:
                      </p>
                      <div className="flex flex-wrap gap-0.5">
                        {weaknesses.slice(0, 4).map(([type, count]) => (
                          <span
                            key={type}
                            className="bg-red-600 text-white font-pixel text-[7px] px-1.5 py-0.5 rounded uppercase shadow"
                          >
                            {type} x{count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA: Seleção de Pokémon */}
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-500/50">
            <h3 className="text-lg font-pixel text-yellow-400 mb-2 text-center drop-shadow-lg">
              {team.filter(m => m !== null).length >= 6 ? '✅ TIME COMPLETO' : '➕ ADICIONAR POKÉMON'}
            </h3>

            {/* Filtros Compactos */}
            <div className="space-y-2 mb-3">
              {/* Dropdown Jogo - COMPACTO */}
              <select
                value={selectedGame}
                onChange={(e) => handleGameSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg font-pixel text-xs border-2 border-purple-500/50 focus:outline-none focus:border-yellow-400 shadow bg-purple-800/50 text-yellow-400"
              >
                <option value="">🎮 Todos (1025)</option>
                <optgroup label="Gen 1">
                  <option value="red-blue">🔴 Red/Blue</option>
                  <option value="yellow">⚡ Yellow</option>
                </optgroup>
                <optgroup label="Gen 2">
                  <option value="gold-silver">🥇 Gold/Silver</option>
                  <option value="crystal">💎 Crystal</option>
                </optgroup>
                <optgroup label="Gen 3">
                  <option value="ruby-sapphire">🔥 Ruby/Sapphire</option>
                  <option value="emerald">💚 Emerald</option>
                  <option value="firered-leafgreen">🍃 FireRed/LeafGreen</option>
                </optgroup>
                <optgroup label="Gen 4">
                  <option value="diamond-pearl">💎 Diamond/Pearl</option>
                  <option value="platinum">⚪ Platinum</option>
                  <option value="heartgold-soulsilver">❤️ HeartGold/SoulSilver</option>
                </optgroup>
                <optgroup label="Gen 5">
                  <option value="black-white">⚫ Black/White</option>
                  <option value="black-2-white-2">⚫ Black 2/White 2</option>
                </optgroup>
                <optgroup label="Gen 6">
                  <option value="x-y">🔵 X/Y</option>
                  <option value="omega-ruby-alpha-sapphire">🌊 OR/AS</option>
                </optgroup>
                <optgroup label="Gen 7">
                  <option value="sun-moon">☀️ Sun/Moon</option>
                  <option value="ultra-sun-ultra-moon">🌙 Ultra S/M</option>
                </optgroup>
                <optgroup label="Gen 8">
                  <option value="sword-shield">⚔️ Sword/Shield</option>
                  <option value="brilliant-diamond-shining-pearl">✨ BD/SP</option>
                  <option value="legends-arceus">🏔️ Legends Arceus</option>
                </optgroup>
                <optgroup label="Gen 9">
                  <option value="scarlet-violet">🌺 Scarlet/Violet</option>
                </optgroup>
              </select>

              {/* Busca - COMPACTO */}
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Buscar..."
                className="w-full px-3 py-2 rounded-lg font-pixel text-xs bg-purple-800/50 text-yellow-400 border-2 border-purple-500/50 focus:border-yellow-400 outline-none placeholder:text-purple-400"
              />

              {/* Botão Cache - DISCRETO */}
              <button
                onClick={clearPokemonCache}
                className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-pixel text-[9px] px-2 py-1 rounded transition"
                title="Limpar cache"
              >
                🗑️ Limpar Cache
              </button>
            </div>

            {/* Grid de Pokémon - MAIOR */}
            {loading ? (
              <div className="text-center py-12">
                <p className="font-pixel text-purple-200 text-base animate-pulse">
                  Carregando...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 custom-scrollbar">
                {filteredPokemon.map(pokemon => {
                  const isInTeam = team.some(m => m?.id === pokemon.id);
                  const teamFull = team.filter(m => m !== null).length >= 6;
                  
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => addToTeam(pokemon)}
                      disabled={teamFull || isInTeam}
                      className={`relative bg-purple-800/50 border-2 rounded-lg p-1 transition group ${
                        isInTeam 
                          ? 'border-green-500 opacity-50 cursor-not-allowed' 
                          : teamFull
                          ? 'border-purple-500/30 opacity-30 cursor-not-allowed'
                          : 'border-purple-500/30 hover:border-yellow-400 hover:bg-purple-700/50 transform hover:scale-105'
                      }`}
                    >
                      {isInTeam && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[7px] font-pixel px-1 rounded z-10">
                          ✓
                        </div>
                      )}
                      <img 
                        src={pokemon.sprite} 
                        alt={pokemon.name} 
                        className="w-full aspect-square object-contain" 
                      />
                      <p className="font-pixel text-[6px] text-purple-200 text-center truncate capitalize">
                        {pokemon.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
      </main>

      {/* Modal de Moveset */}
      {showMovesetModal && selectedPokemonForMoveset && (
        <MovesetModal
          pokemon={selectedPokemonForMoveset}
          onSave={handleMovesetSave}
          onCancel={handleMovesetCancel}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
