import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { typeColors } from '../utils/typeColors';

interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

interface SavedTeam {
  id: number;
  name: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export default function MyTeamsPage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<SavedTeam[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const savedTeams = JSON.parse(localStorage.getItem('pokemonTeams') || '[]');
    setTeams(savedTeams.sort((a: SavedTeam, b: SavedTeam) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const deleteTeam = (teamId: number) => {
    if (confirm('⚠️ Tem certeza que deseja excluir este time?')) {
      const updatedTeams = teams.filter(team => team.id !== teamId);
      localStorage.setItem('pokemonTeams', JSON.stringify(updatedTeams));
      setTeams(updatedTeams);
      alert('✅ Time excluído com sucesso!');
    }
  };

  const exportTeam = (team: SavedTeam) => {
    const teamText = `
🏆 ${team.name}
━━━━━━━━━━━━━━━━━━━━
${team.members.map((m, i) => 
  `${i + 1}. ${m.name.toUpperCase()} (#${m.id})
   Tipos: ${m.types.join(', ').toUpperCase()}`
).join('\n')}
━━━━━━━━━━━━━━━━━━━━
Criado em: ${new Date(team.createdAt).toLocaleDateString('pt-BR')}
Total: ${team.members.length} Pokémon
    `.trim();

    navigator.clipboard.writeText(teamText);
    alert('✅ Time copiado para a área de transferência!');
  };

  const getTeamTypes = (team: SavedTeam) => {
    const types = new Set<string>();
    team.members.forEach(member => {
      member.types.forEach(type => types.add(type));
    });
    return Array.from(types);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <button 
            onClick={() => navigate('/criar-time')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            CRIAR TIME
          </button>
          <button className="bg-green-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg">
            MEUS TIMES
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-pixel text-yellow-400 drop-shadow-lg">
            🏆 MEUS TIMES ({teams.length})
          </h2>
          <button
            onClick={() => navigate('/criar-time')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            ➕ NOVO TIME
          </button>
        </div>

        {/* Teams List */}
        {teams.length === 0 ? (
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-12 border-2 border-purple-500/50 text-center">
            <p className="text-6xl mb-4">🎮</p>
            <p className="font-pixel text-purple-200 text-xl mb-4">
              Você ainda não tem times salvos
            </p>
            <p className="font-pixel text-purple-400 text-sm mb-6">
              Crie seu primeiro time e comece sua jornada!
            </p>
            <button
              onClick={() => navigate('/criar-time')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              ➕ CRIAR PRIMEIRO TIME
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map(team => {
              const isExpanded = expandedTeam === team.id;
              const teamTypes = getTeamTypes(team);

              return (
                <div
                  key={team.id}
                  className="bg-purple-900/40 backdrop-blur-sm rounded-lg border-2 border-purple-500/50 overflow-hidden transition-all hover:border-purple-400/70"
                >
                  {/* Team Header */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow">
                        <h3 className="text-2xl font-pixel text-yellow-400 mb-2 drop-shadow-lg">
                          {team.name}
                        </h3>
                        <p className="font-pixel text-purple-300 text-xs">
                          📅 Criado em: {formatDate(team.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportTeam(team)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs px-3 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
                          title="Exportar time"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-pixel text-xs px-3 py-2 rounded-lg shadow-lg transform transition hover:scale-105"
                          title="Excluir time"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Pokemon Preview */}
                    <div className="grid grid-cols-6 gap-3 mb-4">
                      {team.members.map((member, index) => (
                        <div
                          key={index}
                          className="relative bg-purple-800/50 border-2 border-purple-500/30 rounded-lg p-2 group hover:border-yellow-400 transition cursor-pointer"
                          onClick={() => navigate(`/pokemon/${member.id}`)}
                        >
                          <img
                            src={member.sprite}
                            alt={member.name}
                            className="w-full aspect-square object-contain"
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                            <p className="font-pixel text-white text-[8px] capitalize text-center">
                              {member.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Team Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-purple-200 text-xs">
                          Total:
                        </span>
                        <span className="bg-purple-600 text-white font-pixel text-xs px-3 py-1 rounded-lg">
                          {team.members.length} Pokémon
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-pixel text-purple-200 text-xs">
                          Tipos:
                        </span>
                        {teamTypes.slice(0, 5).map(type => (
                          <span
                            key={type}
                            className={`${typeColors[type]} text-white font-pixel text-[10px] px-2 py-1 rounded uppercase`}
                          >
                            {type}
                          </span>
                        ))}
                        {teamTypes.length > 5 && (
                          <span className="bg-purple-600 text-white font-pixel text-[10px] px-2 py-1 rounded">
                            +{teamTypes.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                      className="w-full bg-purple-700/50 hover:bg-purple-600/50 text-purple-200 font-pixel text-xs py-2 rounded-lg transition"
                    >
                      {isExpanded ? '▲ OCULTAR DETALHES' : '▼ VER DETALHES'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-purple-950/50 p-6 border-t-2 border-purple-500/30">
                      <h4 className="font-pixel text-yellow-400 text-lg mb-4">
                        📋 MEMBROS DO TIME
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            onClick={() => navigate(`/pokemon/${member.id}`)}
                            className="bg-purple-800/50 border-2 border-purple-500/30 hover:border-yellow-400 rounded-lg p-4 transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={member.sprite}
                                  alt={member.name}
                                  className="w-20 h-20 object-contain"
                                />
                                <div className="absolute -top-2 -left-2 bg-yellow-400 text-purple-900 font-pixel text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-pixel text-purple-100 text-sm capitalize mb-1 group-hover:text-yellow-400 transition">
                                  {member.name}
                                </h5>
                                <p className="font-pixel text-purple-400 text-xs mb-2">
                                  #{member.id.toString().padStart(3, '0')}
                                </p>
                                <div className="flex gap-1">
                                  {member.types.map(type => (
                                    <span
                                      key={type}
                                      className={`${typeColors[type]} text-white font-pixel text-[9px] px-2 py-0.5 rounded uppercase`}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => exportTeam(team)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-pixel text-sm py-3 rounded-lg shadow-lg transform transition hover:scale-105"
                        >
                          📋 EXPORTAR
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-pixel text-sm py-3 rounded-lg shadow-lg transform transition hover:scale-105"
                        >
                          🗑️ EXCLUIR
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
