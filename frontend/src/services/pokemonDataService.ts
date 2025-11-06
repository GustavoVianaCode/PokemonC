interface ShowdownMove {
  num: number;
  accuracy: number | true;
  basePower: number;
  category: string;
  name: string;
  pp: number;
  priority: number;
  type: string;
  shortDesc?: string;
  desc?: string;
  flags?: Record<string, number>;
  secondary?: any;
}

interface ShowdownPokemon {
  num: number;
  name: string;
  types: string[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: {
    0: string;
    1?: string;
    H?: string;
    S?: string;
  };
  weightkg: number;
  tier: string;
  prevo?: string;
  evos?: string[];
}

interface ShowdownLearnset {
  learnset: {
    [move: string]: string[];
  };
}

interface ShowdownItem {
  num: number;
  name: string;
  desc?: string;
  shortDesc?: string;
  fling?: {
    basePower: number;
  };
}

interface ShowdownAbility {
  num: number;
  name: string;
  shortDesc?: string;
  desc?: string;
}

class PokemonDataService {
  private showdownBaseUrl = 'https://play.pokemonshowdown.com/data/';
  
  // Caches
  private movesCache: Record<string, ShowdownMove> | null = null;
  private pokedexCache: Record<string, ShowdownPokemon> | null = null;
  private learnsetsCache: Record<string, ShowdownLearnset> | null = null;
  private itemsCache: Record<string, ShowdownItem> | null = null;
  private abilitiesCache: Record<string, ShowdownAbility> | null = null;

  /**
   * Normaliza nome do Pokémon para o formato do Showdown
   */
  private normalizeName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/^mr/, 'mr')
      .replace(/^mime/, 'mime');
  }

  /**
   * Formata nome para exibição
   */
  private formatName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Busca todos os moves do Showdown
   */
  async getShowdownMoves(): Promise<Record<string, ShowdownMove>> {
    if (this.movesCache) return this.movesCache;

    const cacheKey = 'showdown-moves-v1';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        // Cache por 7 dias
        if (age < 7 * 24 * 60 * 60 * 1000) {
          this.movesCache = data.moves;
          return data.moves;
        }
      } catch (e) {
        console.warn('Cache inválido, buscando novamente...');
      }
    }

    console.log('📥 Baixando dados de moves do Showdown...');
    const response = await fetch(`${this.showdownBaseUrl}moves.json`);
    const moves = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ 
      moves, 
      timestamp: Date.now() 
    }));
    
    this.movesCache = moves;
    return moves;
  }

  /**
   * Busca learnsets (quais Pokémon aprendem quais golpes)
   */
  async getShowdownLearnsets(): Promise<Record<string, ShowdownLearnset>> {
    if (this.learnsetsCache) return this.learnsetsCache;

    const cacheKey = 'showdown-learnsets-v1';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
          this.learnsetsCache = data.learnsets;
          return data.learnsets;
        }
      } catch (e) {
        console.warn('Cache inválido, buscando novamente...');
      }
    }

    console.log('📥 Baixando dados de learnsets do Showdown...');
    const response = await fetch(`${this.showdownBaseUrl}learnsets.json`);
    const learnsets = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ 
      learnsets, 
      timestamp: Date.now() 
    }));
    
    this.learnsetsCache = learnsets;
    return learnsets;
  }

  /**
   * Busca Pokédex do Showdown (com tiers, stats, etc)
   */
  async getShowdownPokedex(): Promise<Record<string, ShowdownPokemon>> {
    if (this.pokedexCache) return this.pokedexCache;

    const cacheKey = 'showdown-pokedex-v1';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
          this.pokedexCache = data.pokedex;
          return data.pokedex;
        }
      } catch (e) {
        console.warn('Cache inválido, buscando novamente...');
      }
    }

    console.log('📥 Baixando dados de pokédex do Showdown...');
    const response = await fetch(`${this.showdownBaseUrl}pokedex.json`);
    const pokedex = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ 
      pokedex, 
      timestamp: Date.now() 
    }));
    
    this.pokedexCache = pokedex;
    return pokedex;
  }

  /**
   * Busca items do Showdown
   */
  async getShowdownItems(): Promise<Record<string, ShowdownItem>> {
    if (this.itemsCache) return this.itemsCache;

    const cacheKey = 'showdown-items-v1';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
          this.itemsCache = data.items;
          return data.items;
        }
      } catch (e) {
        console.warn('Cache inválido, buscando novamente...');
      }
    }

    console.log('📥 Baixando dados de items do Showdown...');
    const response = await fetch(`${this.showdownBaseUrl}items.json`);
    const items = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ 
      items, 
      timestamp: Date.now() 
    }));
    
    this.itemsCache = items;
    return items;
  }

  /**
   * Busca abilities do Showdown
   */
  async getShowdownAbilities(): Promise<Record<string, ShowdownAbility>> {
    if (this.abilitiesCache) return this.abilitiesCache;

    const cacheKey = 'showdown-abilities-v1';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const data = JSON.parse(cached);
        const age = Date.now() - data.timestamp;
        if (age < 7 * 24 * 60 * 60 * 1000) {
          this.abilitiesCache = data.abilities;
          return data.abilities;
        }
      } catch (e) {
        console.warn('Cache inválido, buscando novamente...');
      }
    }

    console.log('📥 Baixando dados de abilities do Showdown...');
    const response = await fetch(`${this.showdownBaseUrl}abilities.json`);
    const abilities = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify({ 
      abilities, 
      timestamp: Date.now() 
    }));
    
    this.abilitiesCache = abilities;
    return abilities;
  }

  /**
   * Busca moves LEGAIS para um Pokémon específico
   */
  async getLegalMovesForPokemon(pokemonName: string): Promise<Array<ShowdownMove & { displayName: string }>> {
    try {
      const [learnsets, allMoves] = await Promise.all([
        this.getShowdownLearnsets(),
        this.getShowdownMoves()
      ]);

      const pokemonKey = this.normalizeName(pokemonName);
      const pokemonLearnset = learnsets[pokemonKey];

      if (!pokemonLearnset || !pokemonLearnset.learnset) {
        console.warn(`⚠️ Learnset não encontrado para ${pokemonName}`);
        return [];
      }

      const legalMoves: Array<ShowdownMove & { displayName: string }> = [];

      Object.keys(pokemonLearnset.learnset).forEach(moveName => {
        const moveData = allMoves[moveName];
        if (moveData) {
          legalMoves.push({
            ...moveData,
            displayName: this.formatName(moveData.name)
          });
        }
      });

      // Ordena por nome
      return legalMoves.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } catch (error) {
      console.error('Erro ao buscar moves legais:', error);
      return [];
    }
  }

  /**
   * Busca detalhes de um move específico
   */
  async getMoveDetails(moveName: string): Promise<ShowdownMove | null> {
    try {
      const moves = await this.getShowdownMoves();
      const normalizedName = moveName.toLowerCase().replace(/\s/g, '');
      return moves[normalizedName] || null;
    } catch (error) {
      console.error('Erro ao buscar detalhes do move:', error);
      return null;
    }
  }

  /**
   * Busca dados do Pokémon no Showdown (tier, stats, etc)
   */
  async getPokemonShowdownData(pokemonName: string): Promise<ShowdownPokemon | null> {
    try {
      const pokedex = await this.getShowdownPokedex();
      const pokemonKey = this.normalizeName(pokemonName);
      return pokedex[pokemonKey] || null;
    } catch (error) {
      console.error('Erro ao buscar dados do Showdown:', error);
      return null;
    }
  }

  /**
   * Busca abilities de um Pokémon com descrições
   */
  async getPokemonAbilities(pokemonName: string): Promise<Array<{ name: string; displayName: string; description: string; isHidden: boolean }>> {
    try {
      const [pokedex, abilities] = await Promise.all([
        this.getShowdownPokedex(),
        this.getShowdownAbilities()
      ]);

      const pokemonKey = this.normalizeName(pokemonName);
      const pokemonData = pokedex[pokemonKey];

      if (!pokemonData || !pokemonData.abilities) {
        return [];
      }

      const result: Array<{ name: string; displayName: string; description: string; isHidden: boolean }> = [];

      // Ability 1
      if (pokemonData.abilities[0]) {
        const abilityKey = pokemonData.abilities[0].toLowerCase().replace(/\s/g, '');
        const abilityData = abilities[abilityKey];
        result.push({
          name: pokemonData.abilities[0],
          displayName: this.formatName(pokemonData.abilities[0]),
          description: abilityData?.shortDesc || abilityData?.desc || '',
          isHidden: false
        });
      }

      // Ability 2
      if (pokemonData.abilities[1]) {
        const abilityKey = pokemonData.abilities[1].toLowerCase().replace(/\s/g, '');
        const abilityData = abilities[abilityKey];
        result.push({
          name: pokemonData.abilities[1],
          displayName: this.formatName(pokemonData.abilities[1]),
          description: abilityData?.shortDesc || abilityData?.desc || '',
          isHidden: false
        });
      }

      // Hidden Ability
      if (pokemonData.abilities.H) {
        const abilityKey = pokemonData.abilities.H.toLowerCase().replace(/\s/g, '');
        const abilityData = abilities[abilityKey];
        result.push({
          name: pokemonData.abilities.H,
          displayName: this.formatName(pokemonData.abilities.H) + ' (Hidden)',
          description: abilityData?.shortDesc || abilityData?.desc || '',
          isHidden: true
        });
      }

      return result;
    } catch (error) {
      console.error('Erro ao buscar abilities:', error);
      return [];
    }
  }

  /**
   * Limpa todos os caches
   */
  clearCache(): void {
    const keys = [
      'showdown-moves-v1',
      'showdown-learnsets-v1',
      'showdown-pokedex-v1',
      'showdown-items-v1',
      'showdown-abilities-v1'
    ];

    keys.forEach(key => localStorage.removeItem(key));

    this.movesCache = null;
    this.pokedexCache = null;
    this.learnsetsCache = null;
    this.itemsCache = null;
    this.abilitiesCache = null;

    console.log('✅ Cache do Showdown limpo!');
  }
}

export const pokemonDataService = new PokemonDataService();
