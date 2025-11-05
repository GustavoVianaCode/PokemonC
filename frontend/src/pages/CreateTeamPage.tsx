import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { typeColors } from '../utils/typeColors';

interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [availablePokemon, setAvailablePokemon] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemon();
  }, []);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const limit = 151; // Gen 1 por enquanto
      const offset = 0;
      
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const pokemonDetails = await Promise.all(
        response.data.results.map(async (pokemon: any) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name,
            sprite: details.data.sprites.front_default,
            types: details.data.types.map((t: any) => t.type.name),
          };
        })
      );

      setAvailablePokemon(pokemonDetails);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToTeam = (pokemon: Pokemon) => {
    // Verificar se já está no time
    if (team.some(member => member?.id === pokemon.id)) {
      alert('Este Pokémon já está no seu time!');
      return;
    }

    const emptyIndex = team.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      const newTeam = [...team];
      newTeam[emptyIndex] = pokemon;
      setTeam(newTeam);
    }
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

  const { offensiveTypes, weaknesses } = calculateTypeCoverage();
  const filteredPokemon = availablePokemon.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-green-700">
      {/* Header */}
      <header className="py-8">
        <h1 className="text-center text-6xl font-pixel text-yellow-400 drop-shadow-lg mb-8">
          ChampionDex
        </h1>
        
        <nav className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            HOME
          </button>
          <button className="bg-blue-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg">
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

      <main className="container mx-auto px-4 pb-8">
        <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-8 border-2 border-purple-500/50">
          {/* Header do Time */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-grow w-full md:w-auto">
              <label className="font-pixel text-purple-200 text-sm block mb-2">
                NOME DO TIME:
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: Campeões de Kanto"
                className="w-full max-w-md px-4 py-3 rounded-lg font-pixel bg-purple-800/50 text-yellow-400 border-2 border-purple-500/50 focus:border-yellow-400 outline-none"
                maxLength={30}
              />
            </div>
            <button
              onClick={saveTeam}
              className="bg-green-500 hover:bg-green-600 text-white font-pixel px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105 w-full md:w-auto"
            >
              💾 SALVAR TIME
            </button>
          </div>

          {/* Slots do Time */}
          <div className="mb-8">
            <h2 className="text-2xl font-pixel text-yellow-400 mb-4 text-center drop-shadow-lg">
              MEU TIME ({team.filter(m => m !== null).length}/6)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg border-4 ${
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
                        className="w-full h-full object-contain p-2" 
                      />
                      <button
                        onClick={() => removeFromTeam(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white font-pixel text-xs px-2 py-1 rounded shadow-lg transform transition hover:scale-110"
                      >
                        ✕
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white text-center font-pixel text-[10px] rounded-b px-1 py-2">
                        <div className="truncate capitalize mb-1">{member.name}</div>
                        <div className="flex gap-1 justify-center">
                          {member.types.map(type => (
                            <span 
                              key={type}
                              className={`${typeColors[type]} text-white text-[8px] px-1 rounded`}
                            >
                              {type.substring(0, 3).toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-purple-500/50 font-pixel text-4xl">+</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Análise do Time */}
          {team.filter(m => m !== null).length > 0 && (
            <div className="mb-8 bg-purple-800/30 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-pixel text-yellow-400 mb-4 text-center drop-shadow-lg">
                📊 ANÁLISE DO TIME
              </h3>
              
              {/* Cobertura Ofensiva */}
              <div className="mb-4">
                <p className="font-pixel text-purple-200 text-sm mb-2">
                  ⚔️ Cobertura Ofensiva ({offensiveTypes.length} tipos):
                </p>
                <div className="flex flex-wrap gap-2">
                  {offensiveTypes.map(type => (
                    <span
                      key={type}
                      className={`${typeColors[type]} text-white font-pixel text-xs px-3 py-1 rounded-lg uppercase shadow-lg`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fraquezas do Time */}
              {weaknesses.length > 0 && (
                <div>
                  <p className="font-pixel text-purple-200 text-sm mb-2">
                    ⚠️ Fraquezas Mais Comuns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weaknesses.slice(0, 5).map(([type, count]) => (
                      <span
                        key={type}
                        className="bg-red-600 text-white font-pixel text-xs px-3 py-1 rounded-lg uppercase shadow-lg"
                      >
                        {type} x{count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid de Pokémon Disponíveis */}
          <div>
            <h3 className="text-2xl font-pixel text-yellow-400 mb-4 text-center drop-shadow-lg">
              {team.filter(m => m !== null).length >= 6 ? '✅ TIME COMPLETO' : '➕ ADICIONAR POKÉMON'}
            </h3>
            
            {/* Busca */}
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Buscar Pokémon por nome..."
                className="w-full px-4 py-3 rounded-lg font-pixel bg-purple-800/50 text-yellow-400 border-2 border-purple-500/50 focus:border-yellow-400 outline-none placeholder:text-purple-400"
              />
            </div>

            {/* Loading */}
            {loading ? (
              <div className="text-center py-12">
                <p className="font-pixel text-purple-200 text-xl animate-pulse">
                  Carregando Pokémon...
                </p>
              </div>
            ) : (
              /* Grid */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPokemon.map(pokemon => {
                  const isInTeam = team.some(m => m?.id === pokemon.id);
                  const teamFull = team.filter(m => m !== null).length >= 6;
                  
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => addToTeam(pokemon)}
                      disabled={teamFull || isInTeam}
                      className={`relative bg-purple-800/50 border-2 rounded-lg p-2 transition group ${
                        isInTeam 
                          ? 'border-green-500 opacity-50 cursor-not-allowed' 
                          : teamFull
                          ? 'border-purple-500/30 opacity-30 cursor-not-allowed'
                          : 'border-purple-500/30 hover:border-yellow-400 hover:bg-purple-700/50 transform hover:scale-105'
                      }`}
                    >
                      {isInTeam && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-pixel px-1 rounded">
                          ✓
                        </div>
                      )}
                      <img 
                        src={pokemon.sprite} 
                        alt={pokemon.name} 
                        className="w-full aspect-square object-contain" 
                      />
                      <p className="font-pixel text-[8px] text-purple-200 text-center mt-1 truncate capitalize">
                        {pokemon.name}
                      </p>
                      <p className="font-pixel text-[7px] text-purple-400 text-center">
                        #{pokemon.id.toString().padStart(3, '0')}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 92, 246, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
