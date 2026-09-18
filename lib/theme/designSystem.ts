export const designTokens = {
  colors: {
    primary: {
      darkest: '#0a1a0a',
      dark: '#0f2a0f',
      main: '#1B5E20',
      bright: '#4CAF50',
      light: '#81C784',
      lighter: '#A5D6A7',
      neon: '#00FF88',
    },
    gradients: {
      heroMain: 'linear-gradient(135deg, #0a1a0a 0%, #1B5E20 50%, #0f2a0f 100%)',
      glassDark: 'linear-gradient(135deg, rgba(27,94,32,0.1) 0%, rgba(76,175,80,0.05) 100%)',
      glassLight: 'linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(165,214,167,0.1) 100%)',
      neonAccent: 'linear-gradient(90deg, #4CAF50, #00FF88)',
      cardHover: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(27,94,32,0.1) 100%)',
    },
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#ef4444',
    info: '#2196F3',
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(165,214,167,0.8)',
      tertiary: 'rgba(165,214,167,0.5)',
      muted: 'rgba(165,214,167,0.3)',
    },
    bg: {
      primary: '#030A03',
      secondary: 'rgba(10,26,10,0.8)',
      tertiary: 'rgba(15,42,15,0.6)',
    },
  },
  glass: {
    blur: { sm: '8px', md: '12px', lg: '16px', xl: '20px' },
    backgrounds: {
      light: 'rgba(27,94,32,0.08)',
      medium: 'rgba(27,94,32,0.12)',
      dark: 'rgba(27,94,32,0.16)',
    },
    borders: {
      light: 'rgba(76,175,80,0.1)',
      medium: 'rgba(76,175,80,0.2)',
      bright: 'rgba(76,175,80,0.4)',
    },
  },
  radius: {
    sm: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '24px', full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.3)',
    md: '0 4px 16px rgba(0,0,0,0.4)',
    lg: '0 8px 32px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(76,175,80,0.3)',
    glowBright: '0 0 30px rgba(76,175,80,0.5)',
  },
}

export type DesignTokens = typeof designTokens
