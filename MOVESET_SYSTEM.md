# 🎮 Sistema de Moveset - ChampionDex

## 📋 Visão Geral

Sistema completo de configuração de moveset estilo **Pokémon Showdown**, permitindo que os usuários criem times com movesets detalhados.

---

## ✨ Funcionalidades Implementadas

### **1. Modal de Configuração (`MovesetModal.tsx`)**

Ao clicar em um Pokémon para adicionar ao time, abre um modal com:

- ✅ **Nickname** (opcional, máx 12 caracteres)
- ✅ **Ability** (carregado da API, mostra Hidden Ability)
- ✅ **Item** (30+ itens populares do competitivo)
- ✅ **Nature** (todas as 25 natures)
- ✅ **Tera Type** (todos os 18 tipos)
- ✅ **Shiny Toggle** (ativa/desativa)
- ✅ **4 Moves Slots** (com busca individual por move)
- ✅ **Preview** do formato Showdown em tempo real

---

## 🔧 Componentes Atualizados

### **CreateTeamPage.tsx**
- Interface `TeamMember` agora inclui `moveset?: MovesetConfig`
- Função `addToTeam()` abre modal em vez de adicionar direto
- Novas funções: `handleMovesetSave()`, `handleMovesetCancel()`
- Modal renderizado condicionalmente com `showMovesetModal`

### **MyTeamsPage.tsx**
- Interface `TeamMember` atualizada com moveset
- Função `exportTeam()` reformatada para **Pokémon Showdown**
- Cards expandidos mostram:
  - Ícone ✨ se for Shiny
  - Item, Nature, Ability
  - Lista de 4 moves
- Exportação copia formato compatível com Showdown

---

## 📊 Formato de Exportação

### **Antes (Simples):**
```
🏆 Meu Time
━━━━━━━━━━━━━━━━━━━━
1. CHARIZARD (#6)
   Tipos: FIRE, FLYING
━━━━━━━━━━━━━━━━━━━━
```

### **Depois (Pokémon Showdown):**
```
🏆 Meu Time
━━━━━━━━━━━━━━━━━━━━

Charizard @ Life Orb
Ability: Solar Power
Shiny: Yes
Tera Type: Fire
Adamant Nature
- Flare Blitz
- Dragon Claw
- Earthquake
- Roost

Pikachu @ Light Ball
Ability: Lightning Rod
Tera Type: Electric
Jolly Nature
- Thunderbolt
- Volt Tackle
- Iron Tail
- Quick Attack

━━━━━━━━━━━━━━━━━━━━
Total: 2 Pokémon
```

---

## 🎯 Como Usar

### **1. Criar Time**
1. Acesse **"CRIAR TIME"**
2. Clique em um Pokémon
3. Configure o moveset no modal:
   - Escolha Ability
   - Selecione Item
   - Defina Nature
   - Escolha Tera Type
   - Ative Shiny (se quiser)
   - Selecione até 4 moves (use a busca!)
   - Adicione nickname (opcional)
4. Clique em **"ADICIONAR AO TIME"**

### **2. Ver Times Salvos**
1. Acesse **"MEUS TIMES"**
2. Clique em **"VER DETALHES"** no time desejado
3. Visualize os movesets completos de cada Pokémon
4. Clique em **"EXPORTAR TIME"** para copiar formato Showdown

---

## 🔍 Detalhes Técnicos

### **Interface MovesetConfig:**
```typescript
export interface MovesetConfig {
  moves: string[];        // Até 4 moves
  ability: string;        // Nome da ability
  item: string;           // Item equipado
  nature: string;         // Nature (afeta stats)
  teraType: string;       // Tipo Tera (Gen 9)
  shiny: boolean;         // Se é shiny
  nickname: string;       // Apelido customizado
}
```

### **Dados Carregados da API:**
- **Moves**: `/pokemon/{id}` → `moves[]`
- **Abilities**: `/pokemon/{id}` → `abilities[]` (inclui hidden)
- **Items**: Lista predefinida (30+ itens competitivos)
- **Natures**: Lista hardcoded (25 natures)
- **Types**: Lista hardcoded (18 tipos)

---

## 🎨 UI/UX

### **Modal:**
- Design dark purple com bordas amarelas (tema do app)
- Scroll vertical para mobile
- Busca individual em cada slot de move (performance)
- Preview em tempo real do formato Showdown
- Validação: desabilita "ADICIONAR" se não tiver moves

### **Cards de Time:**
- Ícone ✨ para Pokémon Shiny
- Informações compactas: Item, Nature, Ability
- Lista de moves em formato clean
- Click para ver detalhes do Pokémon

---

## 🚀 Melhorias Futuras (Opcional)

- [ ] EVs/IVs (distribuição de pontos)
- [ ] Gender (masculino/feminino)
- [ ] Level customizado
- [ ] Importar time do Showdown (paste reverso)
- [ ] Validação de legalidade (moves aprendíveis)
- [ ] Suggestões de sets competitivos (Smogon)
- [ ] Cálculo de dano (damage calculator)

---

## 📦 Arquivos Modificados

```
frontend/src/
├── components/
│   └── MovesetModal.tsx (NOVO - 380 linhas)
├── pages/
│   ├── CreateTeamPage.tsx (atualizado - +40 linhas)
│   └── MyTeamsPage.tsx (atualizado - +60 linhas)
```

---

## ✅ Checklist de Implementação

- [x] Criar componente MovesetModal
- [x] Adicionar interface MovesetConfig
- [x] Integrar modal no CreateTeamPage
- [x] Atualizar interface TeamMember
- [x] Modificar função addToTeam
- [x] Atualizar exportTeam para formato Showdown
- [x] Exibir movesets nos cards (MyTeamsPage)
- [x] Adicionar ícone Shiny
- [x] Preview em tempo real
- [x] Validação de campos obrigatórios

---

## 🎉 Resultado Final

Agora o ChampionDex tem um sistema de **team builder profissional** igual ao Pokémon Showdown, permitindo criar times competitivos completos com movesets detalhados e exportação compatível!

**Desenvolvido com ❤️ para ChampionDex**
