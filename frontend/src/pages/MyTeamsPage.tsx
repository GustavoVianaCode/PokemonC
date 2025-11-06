import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { typeColors } from '../utils/typeColors';
import { MovesetConfig } from '../components/MovesetModal';

interface TeamMember {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  moveset?: MovesetConfig;
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
    // Formato Pokémon Showdown
    const formatName = (name: string) => {
      return name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };

    const showdownFormat = team.members.map(member => {
      if (!member.moveset || member.moveset.moves.length === 0) {
        // Formato simples sem moveset
        return `${formatName(member.name)} (#${member.id})
Tipos: ${member.types.join(', ').toUpperCase()}`;
      }

      // Formato completo estilo Showdown
      const { moveset } = member;
      const displayName = moveset.nickname || formatName(member.name);
      const itemLine = moveset.item !== 'None' ? ` @ ${moveset.item}` : '';
      
      return `${displayName}${itemLine}
Ability: ${formatName(moveset.ability)}${moveset.shiny ? '\nShiny: Yes' : ''}
Tera Type: ${moveset.teraType.charAt(0).toUpperCase() + moveset.teraType.slice(1)}
${moveset.nature} Nature
${moveset.moves.map(move => '- ' + formatName(move)).join('\n')}`;
    }).join('\n\n');

    const teamText = `🏆 ${team.name}
━━━━━━━━━━━━━━━━━━━━

${showdownFormat}

━━━━━━━━━━━━━━━━━━━━
Criado em: ${new Date(team.createdAt).toLocaleDateString('pt-BR')}
Total: ${team.members.length} Pokémon`;

    navigator.clipboard.writeText(teamText);
    alert('✅ Time copiado para a área de transferência (formato Showdown)!');
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
          <button 
            onClick={() => navigate('/criar-time')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg transform transition hover:scale-105 text-sm"
          >
            CRIAR TIME
          </button>
          <button className="bg-green-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg text-sm">
            MEUS TIMES
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 pb-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-pixel text-yellow-400 drop-shadow-lg">
            🏆 MEUS TIMES ({teams.length})
          </h2>
          <button
            onClick={() => navigate('/criar-time')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg transform transition hover:scale-105 text-sm"
          >
            ➕ NOVO TIME
          </button>
        </div>

        {/* Teams List */}
        {teams.length === 0 ? (
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-8 border-2 border-purple-500/50 text-center">
            <p className="text-4xl mb-3">🎮</p>
            <p className="font-pixel text-purple-200 text-lg mb-3">
              Você ainda não tem times salvos
            </p>
            <p className="font-pixel text-purple-400 text-xs mb-4">
              Crie seu primeiro time e comece sua jornada!
            </p>
            <button
              onClick={() => navigate('/criar-time')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-pixel px-5 py-2 rounded-lg shadow-lg transform transition hover:scale-105 text-sm"
            >
              ➕ CRIAR PRIMEIRO TIME
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map(team => {
              const isExpanded = expandedTeam === team.id;
              const teamTypes = getTeamTypes(team);

              return (
                <div
                  key={team.id}
                  className="bg-purple-900/40 backdrop-blur-sm rounded-lg border-2 border-purple-500/50 overflow-hidden transition-all hover:border-purple-400/70"
                >
                  {/* Team Header */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-grow">
                        <h3 className="text-lg font-pixel text-yellow-400 mb-1 drop-shadow-lg">
                          {team.name}
                        </h3>
                        <p className="font-pixel text-purple-300 text-[9px]">
                          📅 Criado em: {formatDate(team.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => exportTeam(team)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-pixel text-[9px] px-2 py-1.5 rounded-lg shadow-lg transform transition hover:scale-105"
                          title="Exportar time"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-pixel text-[9px] px-2 py-1.5 rounded-lg shadow-lg transform transition hover:scale-105"
                          title="Excluir time"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Pokemon Preview */}
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {team.members.map((member, index) => (
                        <div
                          key={index}
                          className="relative bg-purple-800/50 border-2 border-purple-500/30 rounded-lg p-1.5 group hover:border-yellow-400 transition cursor-pointer"
                          onClick={() => navigate(`/pokemon/${member.id}`)}
                        >
                          <img
                            src={member.sprite}
                            alt={member.name}
                            className="w-full aspect-square object-contain"
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                            <p className="font-pixel text-white text-[7px] capitalize text-center px-1">
                              {member.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Team Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-pixel text-purple-200 text-[9px]">
                          Total:
                        </span>
                        <span className="bg-purple-600 text-white font-pixel text-[9px] px-2 py-0.5 rounded-lg">
                          {team.members.length} Pokémon
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-pixel text-purple-200 text-[9px]">
                          Tipos:
                        </span>
                        {teamTypes.slice(0, 5).map(type => (
                          <span
                            key={type}
                            className={`${typeColors[type]} text-white font-pixel text-[8px] px-1.5 py-0.5 rounded uppercase`}
                          >
                            {type}
                          </span>
                        ))}
                        {teamTypes.length > 5 && (
                          <span className="bg-purple-600 text-white font-pixel text-[8px] px-1.5 py-0.5 rounded">
                            +{teamTypes.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                      className="w-full bg-purple-700/50 hover:bg-purple-600/50 text-purple-200 font-pixel text-[9px] py-1.5 rounded-lg transition"
                    >
                      {isExpanded ? '▲ OCULTAR DETALHES' : '▼ VER DETALHES'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-purple-950/50 p-4 border-t-2 border-purple-500/30">
                      <h4 className="font-pixel text-yellow-400 text-sm mb-3">
                        📋 MEMBROS DO TIME
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            onClick={() => navigate(`/pokemon/${member.id}`)}
                            className="bg-purple-800/50 border-2 border-purple-500/30 hover:border-yellow-400 rounded-lg p-3 transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="relative">
                                <img
                                  src={member.sprite}
                                  alt={member.name}
                                  className="w-16 h-16 object-contain"
                                />
                                <div className="absolute -top-1.5 -left-1.5 bg-yellow-400 text-purple-900 font-pixel text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                                  {index + 1}
                                </div>
                                {member.moveset?.shiny && (
                                  <div className="absolute -bottom-0.5 -right-0.5 text-base">
                                    ✨
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <h5 className="font-pixel text-purple-100 text-xs capitalize mb-0.5 group-hover:text-yellow-400 transition">
                                  {member.moveset?.nickname || member.name}
                                </h5>
                                <p className="font-pixel text-purple-400 text-[9px] mb-1">
                                  #{member.id.toString().padStart(3, '0')}
                                </p>
                                <div className="flex gap-0.5">
                                  {member.types.map(type => (
                                    <span
                                      key={type}
                                      className={`${typeColors[type]} text-white font-pixel text-[7px] px-1.5 py-0.5 rounded uppercase`}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Moveset Info */}
                            {member.moveset && member.moveset.moves.length > 0 && (
                              <div className="bg-purple-900/50 rounded p-2 border border-purple-500/30">
                                <div className="grid grid-cols-2 gap-1 mb-1.5">
                                  <div>
                                    <p className="font-pixel text-purple-300 text-[7px]">Item:</p>
                                    <p className="font-pixel text-yellow-400 text-[8px]">{member.moveset.item}</p>
                                  </div>
                                  <div>
                                    <p className="font-pixel text-purple-300 text-[7px]">Nature:</p>
                                    <p className="font-pixel text-yellow-400 text-[8px]">{member.moveset.nature}</p>
                                  </div>
                                </div>
                                <div className="mb-1">
                                  <p className="font-pixel text-purple-300 text-[7px]">Ability:</p>
                                  <p className="font-pixel text-yellow-400 text-[8px] capitalize">
                                    {member.moveset.ability.split('-').join(' ')}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-pixel text-purple-300 text-[7px] mb-0.5">Moves:</p>
                                  <div className="space-y-0.5">
                                    {member.moveset.moves.map((move, i) => (
                                      <p key={i} className="font-pixel text-purple-200 text-[7px]">
                                        • {move.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => exportTeam(team)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs py-2 rounded-lg shadow-lg transform transition hover:scale-105"
                        >
                          📋 EXPORTAR
                        </button>
                        <button
                          onClick={() => deleteTeam(team.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-pixel text-xs py-2 rounded-lg shadow-lg transform transition hover:scale-105"
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
