# 🎮 Integração com Pokémon Showdown API

## 📋 Resumo

Este projeto agora utiliza a **API do Pokémon Showdown** para fornecer dados competitivos precisos e atualizados, melhorando significativamente a experiência de criação de times.

---

## ✨ Funcionalidades Implementadas

### **1. Moves Legais**
- ✅ Apenas golpes que o Pokémon **realmente aprende**
- ✅ Informações completas: **poder, accuracy, tipo, categoria**
- ✅ Descrição do efeito do golpe
- ✅ Lista ordenada alfabeticamente

### **2. Abilities com Descrições**
- ✅ Abilities normais e **Hidden Abilities**
- ✅ Descrição completa de cada ability
- ✅ Tooltip com efeito da ability

### **3. Sistema de Cache**
- ✅ Cache de **7 dias** no localStorage
- ✅ Carregamento instantâneo após primeira vez
- ✅ Reduz requisições à API

### **4. Interface Melhorada**
- ✅ Loading spinner animado
- ✅ Contador de moves disponíveis
- ✅ Exibição de informações inline (BP, Accuracy)
- ✅ Tooltips com descrições

---

## 🔧 Arquitetura

### **Serviço Principal: `pokemonDataService.ts`**

Localização: `frontend/src/services/pokemonDataService.ts`

```typescript
import { pokemonDataService } from '@/services/pokemonDataService';

// Buscar moves legais
const moves = await pokemonDataService.getLegalMovesForPokemon('charizard');

// Buscar abilities
const abilities = await pokemonDataService.getPokemonAbilities('charizard');

// Buscar dados do Pokémon (tier, stats)
const data = await pokemonDataService.getPokemonShowdownData('charizard');

// Limpar cache
pokemonDataService.clearCache();
```

---

## 📊 Dados Disponíveis

### **1. Moves (`moves.json`)**
```json
{
  "flamethrower": {
    "num": 53,
    "accuracy": 100,
    "basePower": 90,
    "category": "Special",
    "name": "Flamethrower",
    "pp": 15,
    "type": "Fire",
    "shortDesc": "Has a 10% chance to burn the foe."
  }
}
```

### **2. Learnsets (`learnsets.json`)**
```json
{
  "charizard": {
    "learnset": {
      "flamethrower": ["9L36", "8L36", "7L36"],
      "earthquake": ["9M", "8M", "7M"]
    }
  }
}
```

### **3. Pokédex (`pokedex.json`)**
```json
{
  "charizard": {
    "num": 6,
    "name": "Charizard",
    "types": ["Fire", "Flying"],
    "tier": "NU",
    "baseStats": {
      "hp": 78,
      "atk": 84,
      "def": 78,
      "spa": 109,
      "spd": 85,
      "spe": 100
    },
    "abilities": {
      "0": "Blaze",
      "H": "Solar Power"
    }
  }
}
```

### **4. Abilities (`abilities.json`)**
```json
{
  "blaze": {
    "num": 66,
    "name": "Blaze",
    "shortDesc": "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Fire attacks."
  }
}
```

### **5. Items (`items.json`)**
```json
{
  "leftovers": {
    "num": 234,
    "name": "Leftovers",
    "desc": "At the end of every turn, holder restores 1/16 of its max HP."
  }
}
```

---

## 🚀 Uso no Projeto

### **MovesetModal - Antes vs Depois**

#### **ANTES (PokéAPI):**
```tsx
// Lista todos os moves (50-100+)
// Sem informação de poder/accuracy
// Lento (várias requisições)

<option value="flamethrower">Flamethrower</option>
```

#### **DEPOIS (Showdown):**
```tsx
// Lista apenas moves legais (20-50)
// Com informações completas
// Rápido (cache)

<option value="flamethrower">
  Flamethrower [Fire] | 90 BP | 100%
</option>
// Tooltip: "Has a 10% chance to burn the foe."
```

---

## 📈 Benefícios

| Aspecto | Antes (PokéAPI) | Depois (Showdown) |
|---------|-----------------|-------------------|
| **Quantidade de moves** | 50-100+ | 20-50 (legais) |
| **Informações** | Só nome | Nome, BP, Acc, Tipo, Desc |
| **Velocidade** | Lenta (múltiplas requests) | Rápida (cache) |
| **Precisão** | Todos os moves | Só os legais |
| **UX** | Confusa | Profissional |

---

## 🔄 Cache Strategy

O sistema de cache funciona assim:

```typescript
// Primeira vez
1. Busca dados do Showdown (1-2s)
2. Salva no localStorage
3. Exibe para o usuário

// Próximas vezes
1. Carrega do localStorage (<100ms)
2. Exibe instantaneamente

// Depois de 7 dias
1. Cache expira
2. Busca novamente do Showdown
3. Atualiza cache
```

---

## 🛠️ Manutenção

### **Limpar Cache Manualmente**

Se os dados estiverem desatualizados ou corrompidos:

```typescript
import { pokemonDataService } from '@/services/pokemonDataService';

// No console do navegador ou em um botão admin:
pokemonDataService.clearCache();
```

### **Verificar Cache**

```typescript
// No console do navegador:
Object.keys(localStorage)
  .filter(key => key.startsWith('showdown-'))
  .forEach(key => {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(key, new Date(data.timestamp));
  });
```

---

## 📝 URLs da API

- **Base URL:** `https://play.pokemonshowdown.com/data/`
- **Moves:** `https://play.pokemonshowdown.com/data/moves.json`
- **Learnsets:** `https://play.pokemonshowdown.com/data/learnsets.json`
- **Pokédex:** `https://play.pokemonshowdown.com/data/pokedex.json`
- **Items:** `https://play.pokemonshowdown.com/data/items.json`
- **Abilities:** `https://play.pokemonshowdown.com/data/abilities.json`

---

## 🎯 Próximas Melhorias Possíveis

- [ ] Filtrar moves por categoria (Physical/Special/Status)
- [ ] Ordenar moves por poder (BP)
- [ ] Mostrar tier do Pokémon no card
- [ ] Sugerir sets competitivos populares
- [ ] Validar combinações de moves/abilities
- [ ] Adicionar EVs/IVs
- [ ] Importar/exportar em formato Showdown

---

## 🐛 Troubleshooting

### **Erro: "Learnset não encontrado"**
- Alguns Pokémon têm nomes diferentes no Showdown
- Exemplo: `Mr. Mime` → `mrmime`
- Solução: Normalização automática já implementada

### **Erro: "Failed to fetch"**
- Problema de CORS ou rede
- Solução: Verificar conexão com internet
- Fallback: Usa PokéAPI para abilities

### **Cache muito grande**
- 5 arquivos JSON (~5-10MB total)
- Solução: Limpar cache após 7 dias automaticamente

---

## 📚 Referências

- [Pokémon Showdown](https://play.pokemonshowdown.com/)
- [Showdown GitHub](https://github.com/smogon/pokemon-showdown)
- [Showdown Data](https://github.com/smogon/pokemon-showdown/tree/master/data)

---

## ✅ Implementação Completa

- ✅ Service criado (`pokemonDataService.ts`)
- ✅ MovesetModal atualizado
- ✅ Cache implementado
- ✅ UI melhorada com tooltips
- ✅ Loading state profissional
- ✅ Fallback para PokéAPI
- ✅ TypeScript types completos
- ✅ Zero erros de compilação

🎉 **Pronto para uso!**
