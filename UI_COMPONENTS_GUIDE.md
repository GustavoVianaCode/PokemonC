# 📚 Guia de Uso - Componentes UI

## 🎨 Componentes Disponíveis

### **1. Button**

```tsx
import { Button } from '@/components/ui';

// Variantes
<Button variant="primary">Botão Primário</Button>
<Button variant="success">Salvar</Button>
<Button variant="danger">Excluir</Button>
<Button variant="info">Informação</Button>
<Button variant="secondary">Secundário</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="md">Médio (padrão)</Button>
<Button size="lg">Grande</Button>

// Desabilitado
<Button disabled>Desabilitado</Button>

// Com classe customizada
<Button className="w-full">Largura Total</Button>
```

---

### **2. Input**

```tsx
import { Input } from '@/components/ui';

// Simples
<Input placeholder="Digite algo..." />

// Com label
<Input label="Nome" placeholder="Seu nome" />

// Com erro
<Input 
  label="Email" 
  error="Email inválido" 
  placeholder="email@example.com" 
/>

// Tipos diferentes
<Input type="password" label="Senha" />
<Input type="number" label="Idade" />
```

---

### **3. Select**

```tsx
import { Select } from '@/components/ui';

// Simples
<Select>
  <option value="">Selecione...</option>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</Select>

// Com label
<Select label="Escolha um jogo">
  <option value="">Todos</option>
  <option value="red">Pokémon Red</option>
  <option value="blue">Pokémon Blue</option>
</Select>

// Com erro
<Select 
  label="País" 
  error="Campo obrigatório"
>
  <option value="">Selecione...</option>
  <option value="BR">Brasil</option>
</Select>
```

---

### **4. Card**

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

// Card completo
<Card>
  <CardHeader>
    <h2 className="font-pixel text-yellow-400 text-xl">Título</h2>
  </CardHeader>
  
  <CardBody>
    <p>Conteúdo do card</p>
  </CardBody>
  
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>

// Card simples
<Card className="p-4">
  Conteúdo
</Card>
```

---

### **5. Modal**

```tsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/components/ui';

function MyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        maxWidth="xl" // sm, md, lg, xl, 2xl, 4xl
      >
        <ModalHeader>
          <div className="flex justify-between items-center">
            <h2 className="font-pixel text-yellow-400 text-2xl">Título</h2>
            <Button variant="danger" size="sm" onClick={() => setIsOpen(false)}>
              ✕
            </Button>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <p>Conteúdo do modal</p>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

---

### **6. Badge**

```tsx
import { Badge } from '@/components/ui';

// Badge padrão
<Badge>Nova</Badge>

// Badge de tipo Pokémon
<Badge variant="type" type="fire" size="md">Fire</Badge>
<Badge variant="type" type="water" size="sm">Water</Badge>

// Tamanhos
<Badge size="xs">Pequeno</Badge>
<Badge size="sm">Médio</Badge>
<Badge size="md">Grande</Badge>
```

---

## 🎨 Tema (Estilos Centralizados)

```tsx
import { colors, typography, spacing, cn } from '@/styles/theme';

// Cores
<div className={colors.yellow.main}>Amarelo</div>
<div className={colors.purple[900]}>Roxo Escuro</div>
<div className={colors.success.bg}>Verde</div>

// Tipografia
<h1 className={typography.title.xl}>Título Grande</h1>
<p className={typography.body.base}>Texto normal</p>
<label className={typography.label.primary}>Label</label>

// Espaçamento
<div className={spacing.card}>Padding de card</div>

// Combinar classes (helper cn)
<div className={cn(
  colors.yellow.main,
  typography.title.md,
  'text-center'
)}>
  Combinando classes
</div>
```

---

## 📦 Exemplo Completo - Página com UI Components

```tsx
import { useState } from 'react';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  CardHeader, 
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from '@/components/ui';

export default function ExamplePage() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [game, setGame] = useState('');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-pixel text-yellow-400 text-center mb-8">
        Exemplo de Uso
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <Card>
          <CardHeader>
            <h2 className="font-pixel text-yellow-400 text-xl">
              Formulário
            </h2>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-4">
              <Input
                label="Nome do Time"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite um nome..."
              />
              
              <Select
                label="Jogo"
                value={game}
                onChange={(e) => setGame(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="red">Pokémon Red</option>
                <option value="blue">Pokémon Blue</option>
              </Select>
              
              <Button 
                variant="success" 
                className="w-full"
                onClick={() => setShowModal(true)}
              >
                Salvar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Card 2 */}
        <Card>
          <CardHeader>
            <h2 className="font-pixel text-yellow-400 text-xl">
              Tipos
            </h2>
          </CardHeader>
          
          <CardBody>
            <div className="flex flex-wrap gap-2">
              <Badge variant="type" type="fire">Fire</Badge>
              <Badge variant="type" type="water">Water</Badge>
              <Badge variant="type" type="grass">Grass</Badge>
              <Badge variant="type" type="electric">Electric</Badge>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader>
          <h2 className="font-pixel text-yellow-400 text-2xl">
            Confirmação
          </h2>
        </ModalHeader>
        
        <ModalBody>
          <p className="font-pixel text-purple-200">
            Time "{name}" salvo com sucesso!
          </p>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
```

---

## ✅ Benefícios

| Antes | Depois |
|-------|--------|
| `className="bg-green-500 hover:bg-green-600 text-white font-pixel px-6 py-3 rounded-lg..."` | `<Button variant="success">` |
| Repetir classes 50x | Componente reutilizável |
| Mudar cor = editar 50 arquivos | Editar 1 arquivo (`Button.tsx`) |
| Código poluído | Código limpo e legível |

---

## 🚀 Próximos Passos

Refatorar outros componentes para usar a biblioteca UI:
- [ ] CreateTeamPage.tsx
- [ ] MyTeamsPage.tsx
- [ ] HomePage.tsx
- [ ] PokemonDetailPage.tsx

**Desenvolvido com ❤️ para ChampionDex**
