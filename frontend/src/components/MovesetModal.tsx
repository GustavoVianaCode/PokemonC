import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, Input, Select, Button } from '@/components/ui';

interface Move {
  name: string;
  displayName: string;
}

interface Ability {
  name: string;
  displayName: string;
  isHidden: boolean;
}

export interface MovesetConfig {
  moves: string[];
  ability: string;
  item: string;
  nature: string;
  teraType: string;
  shiny: boolean;
  nickname: string;
}

interface MovesetModalProps {
  pokemon: {
    id: number;
    name: string;
    sprite: string;
    types: string[];
  };
  onSave: (config: MovesetConfig) => void;
  onCancel: () => void;
}

const NATURES = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
];

const POPULAR_ITEMS = [
  'Leftovers', 'Choice Band', 'Choice Scarf', 'Choice Specs',
  'Life Orb', 'Focus Sash', 'Assault Vest', 'Heavy-Duty Boots',
  'Sitrus Berry', 'Rocky Helmet', 'Air Balloon', 'Expert Belt',
  'Mental Herb', 'Weakness Policy', 'Covert Cloak', 'Safety Goggles',
  'Scope Lens', 'Muscle Band', 'Wise Glasses', 'Blunder Policy',
  'White Herb', 'Power Herb', 'Eject Button', 'Red Card',
  'Eviolite', 'Black Sludge', 'Absorb Bulb', 'Cell Battery',
  'Luminous Moss', 'Snowball', 'None'
];

const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function MovesetModal({ pokemon, onSave, onCancel }: MovesetModalProps) {
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [availableAbilities, setAvailableAbilities] = useState<Ability[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMoves, setSelectedMoves] = useState<string[]>(['', '', '', '']);
  const [selectedAbility, setSelectedAbility] = useState('');
  const [selectedItem, setSelectedItem] = useState('None');
  const [selectedNature, setSelectedNature] = useState('Hardy');
  const [selectedTeraType, setSelectedTeraType] = useState(pokemon.types[0]);
  const [isShiny, setIsShiny] = useState(false);
  const [nickname, setNickname] = useState('');
  const [moveSearch, setMoveSearch] = useState(['', '', '', '']);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const data = response.data;

      // Buscar moves
      const moves = data.moves.map((m: any) => ({
        name: m.move.name,
        displayName: m.move.name.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }));
      setAvailableMoves(moves);

      // Buscar abilities
      const abilities = data.abilities.map((a: any) => ({
        name: a.ability.name,
        displayName: a.ability.name.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        isHidden: a.is_hidden
      }));
      setAvailableAbilities(abilities);
      
      if (abilities.length > 0) {
        setSelectedAbility(abilities[0].name);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveSelect = (index: number, moveName: string) => {
    const newMoves = [...selectedMoves];
    newMoves[index] = moveName;
    setSelectedMoves(newMoves);
  };

  const handleSave = () => {
    const config: MovesetConfig = {
      moves: selectedMoves.filter(m => m !== ''),
      ability: selectedAbility,
      item: selectedItem,
      nature: selectedNature,
      teraType: selectedTeraType,
      shiny: isShiny,
      nickname: nickname.trim()
    };
    onSave(config);
  };

  const filteredMoves = (index: number) => {
    const search = moveSearch[index].toLowerCase();
    return availableMoves.filter(m => 
      m.displayName.toLowerCase().includes(search)
    );
  };

  const formatName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Modal isOpen={true} onClose={onCancel} maxWidth="4xl">
      <ModalHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20" />
            <div>
              <h2 className="text-2xl font-pixel text-yellow-400 uppercase">
                {pokemon.name}
              </h2>
              <p className="text-sm font-pixel text-purple-200">
                Configure o moveset
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" onClick={onCancel}>
            ✕ FECHAR
          </Button>
        </div>
      </ModalHeader>

      <ModalBody>
        {loading ? (
          <div className="text-center py-4">
            <p className="font-pixel text-purple-200 animate-pulse">
              Carregando dados...
            </p>
          </div>
        ) : (
          <>
          {/* Nickname */}
          <Input
            label="NICKNAME (Opcional):"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={formatName(pokemon.name)}
            maxLength={12}
          />

          {/* Grid: Ability, Item, Nature, Tera Type */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Ability */}
            <Select
              label="ABILITY:"
              value={selectedAbility}
              onChange={(e) => setSelectedAbility(e.target.value)}
            >
              {availableAbilities.map(ability => (
                <option key={ability.name} value={ability.name}>
                  {ability.displayName} {ability.isHidden ? '(Hidden)' : ''}
                </option>
              ))}
            </Select>

            {/* Item */}
            <Select
              label="ITEM:"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {POPULAR_ITEMS.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            {/* Nature */}
            <Select
              label="NATURE:"
              value={selectedNature}
              onChange={(e) => setSelectedNature(e.target.value)}
            >
              {NATURES.map(nature => (
                <option key={nature} value={nature}>
                  {nature}
                </option>
              ))}
            </Select>

            {/* Tera Type */}
            <Select
              label="TERA TYPE:"
              value={selectedTeraType}
              onChange={(e) => setSelectedTeraType(e.target.value)}
              className="capitalize"
            >
              {TYPES.map(type => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </Select>
          </div>

          {/* Shiny Toggle */}
          <div className="flex items-center gap-3">
            <label className="font-pixel text-yellow-400 text-sm">
              SHINY:
            </label>
            <Button
              size="sm"
              variant={isShiny ? 'primary' : 'secondary'}
              onClick={() => setIsShiny(!isShiny)}
            >
              {isShiny ? '✨ YES' : 'NO'}
            </Button>
          </div>

          {/* Moves (4 slots) */}
          <div>
            <h3 className="font-pixel text-yellow-400 text-sm mb-3">
              MOVES (Selecione até 4):
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map(index => (
                <div key={index}>
                  <label className="font-pixel text-purple-200 text-xs block mb-1">
                    Move {index + 1}:
                  </label>
                  
                  {/* Busca de move */}
                  <Input
                    placeholder="Buscar move..."
                    value={moveSearch[index]}
                    onChange={(e) => {
                      const newSearch = [...moveSearch];
                      newSearch[index] = e.target.value;
                      setMoveSearch(newSearch);
                    }}
                    className="text-xs py-1.5 mb-1"
                  />
                  
                  {/* Select de move */}
                  <Select
                    value={selectedMoves[index]}
                    onChange={(e) => handleMoveSelect(index, e.target.value)}
                    className="text-xs"
                  >
                    <option value="">-- Nenhum --</option>
                    {filteredMoves(index).slice(0, 100).map(move => (
                      <option key={move.name} value={move.name}>
                        {move.displayName}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedMoves.some(m => m !== '') && (
            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/30">
              <h4 className="font-pixel text-yellow-400 text-xs mb-2">
                PREVIEW (Formato Showdown):
              </h4>
              <pre className="font-mono text-[10px] text-purple-200 whitespace-pre-wrap">
{`${nickname || formatName(pokemon.name)}${selectedItem !== 'None' ? ' @ ' + selectedItem : ''}
Ability: ${formatName(selectedAbility)}${isShiny ? '\nShiny: Yes' : ''}
Tera Type: ${selectedTeraType.charAt(0).toUpperCase() + selectedTeraType.slice(1)}
${selectedNature} Nature
${selectedMoves.filter(m => m !== '').map(m => '- ' + formatName(m)).join('\n')}`}
              </pre>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t-2 border-purple-500/30">
            <Button
              onClick={handleSave}
              disabled={selectedMoves.every(m => m === '')}
              variant="success"
              className="flex-1"
            >
              💾 ADICIONAR AO TIME
            </Button>
            <Button
              onClick={onCancel}
              variant="danger"
              className="flex-1"
            >
              ✕ CANCELAR
            </Button>
          </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}
