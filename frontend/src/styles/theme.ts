/**
 * ChampionDex Theme
 * Cores, espaçamentos e estilos centralizados
 */

export const colors = {
  // Cores principais
  yellow: {
    main: 'bg-yellow-400',
    hover: 'hover:bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-400',
  },
  
  purple: {
    900: 'bg-purple-900',
    800: 'bg-purple-800',
    700: 'bg-purple-700',
    600: 'bg-purple-600',
    500: 'bg-purple-500',
    400: 'bg-purple-400',
    200: 'text-purple-200',
    100: 'text-purple-100',
    dark: 'text-purple-900',
  },

  // Cores de ação
  success: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-green-500',
    border: 'border-green-500',
  },

  danger: {
    bg: 'bg-red-500',
    hover: 'hover:bg-red-600',
    text: 'text-red-500',
    border: 'border-red-500',
  },

  info: {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    border: 'border-blue-600',
  },

  // Backgrounds especiais
  backgrounds: {
    card: 'bg-purple-900/40',
    cardHover: 'hover:bg-purple-700/50',
    input: 'bg-purple-800/50',
    modal: 'bg-purple-900',
    overlay: 'bg-black/80',
  },
};

export const typography = {
  // Títulos
  title: {
    xl: 'font-pixel text-6xl text-yellow-400 drop-shadow-lg',
    lg: 'font-pixel text-4xl text-yellow-400 drop-shadow-lg',
    md: 'font-pixel text-2xl text-yellow-400 drop-shadow-lg',
    sm: 'font-pixel text-xl text-yellow-400 drop-shadow-lg',
    xs: 'font-pixel text-lg text-yellow-400 drop-shadow-lg',
  },

  // Labels
  label: {
    primary: 'font-pixel text-yellow-400 text-sm',
    secondary: 'font-pixel text-purple-200 text-sm',
    small: 'font-pixel text-purple-200 text-xs',
  },

  // Body text
  body: {
    base: 'font-pixel text-sm text-purple-200',
    small: 'font-pixel text-xs text-purple-200',
    tiny: 'font-pixel text-[10px] text-purple-200',
  },
};

export const spacing = {
  // Padding
  card: 'p-6',
  cardSm: 'p-3',
  cardMd: 'p-4',
  
  button: {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  },

  input: 'px-4 py-2',
  inputSm: 'px-3 py-1.5',

  // Gaps
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  },

  // Margins
  section: 'space-y-6',
  sectionSm: 'space-y-3',
  sectionLg: 'space-y-8',
};

export const borders = {
  card: 'border-2 border-purple-500/50',
  cardHover: 'hover:border-yellow-400',
  input: 'border-2 border-purple-500/50',
  inputFocus: 'focus:border-yellow-400',
  modal: 'border-4 border-yellow-400',
};

export const effects = {
  backdrop: 'backdrop-blur-sm',
  shadow: 'shadow-lg',
  rounded: {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  },
  transition: 'transition duration-200',
  scale: 'transform hover:scale-105',
};

// Helper para combinar classes
export const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Classes compostas comuns
export const commonStyles = {
  button: {
    base: `font-pixel rounded-lg shadow-lg transform transition hover:scale-105`,
    primary: `${colors.yellow.main} ${colors.yellow.hover} ${colors.purple.dark}`,
    success: `${colors.success.bg} ${colors.success.hover} text-white`,
    danger: `${colors.danger.bg} ${colors.danger.hover} text-white`,
    info: `${colors.info.bg} ${colors.info.hover} text-white`,
  },

  input: {
    base: `w-full rounded-lg font-pixel text-sm outline-none transition`,
    variant: `${colors.backgrounds.input} ${colors.yellow.text} ${borders.input} ${borders.inputFocus}`,
  },

  card: {
    base: `rounded-lg ${borders.card}`,
    variant: `${colors.backgrounds.card} ${effects.backdrop}`,
  },

  modal: {
    overlay: `fixed inset-0 ${colors.backgrounds.overlay} ${effects.backdrop} flex items-center justify-center z-50 p-4`,
    content: `${colors.backgrounds.modal} ${borders.modal} rounded-lg w-full`,
  },
};
