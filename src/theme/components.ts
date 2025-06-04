// Personalización de componentes MUI para la aplicación de pádel
import type { Components, Theme } from '@mui/material/styles';

export const getComponents = (theme: Theme): Components => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.mode === 'light' 
            ? '#f1f1f1' 
            : '#2c2c2c',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.mode === 'light'
            ? '#c1c1c1'
            : '#6b6b6b',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.mode === 'light'
            ? '#a8a8a8'
            : '#848484',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 600,
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      },
      containedSecondary: {
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: theme.palette.mode === 'light'
          ? '0 4px 20px rgba(0, 0, 0, 0.08)'
          : '0 4px 20px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 8px 25px rgba(0, 0, 0, 0.15)'
            : '0 8px 25px rgba(0, 0, 0, 0.6)',
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '24px',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: theme.palette.mode === 'light'
          ? '0 2px 10px rgba(0, 0, 0, 0.1)'
          : '0 2px 10px rgba(0, 0, 0, 0.4)',
        backgroundImage: theme.palette.mode === 'light'
          ? 'none'
          : 'linear-gradient(to right, #1a2027, #2c3e50)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '16px 24px',
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      head: {
        fontWeight: 600,
        backgroundColor: theme.palette.mode === 'light'
          ? theme.palette.primary.light
          : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:nth-of-type(even)': {
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.02)'
            : 'rgba(255, 255, 255, 0.02)',
        },
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light'
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(255, 255, 255, 0.04)',
        },
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '&.Mui-selected': {
          backgroundColor: theme.palette.mode === 'light'
            ? `${theme.palette.primary.light}40`
            : `${theme.palette.primary.dark}40`,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
              ? `${theme.palette.primary.light}60`
              : `${theme.palette.primary.dark}60`,
          },
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        '&.Mui-focused': {
          boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
        },
      },
      notchedOutline: {
        borderWidth: 2,
        transition: 'border-color 0.2s ease-in-out',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
      },
      filled: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        border: `2px solid ${theme.palette.background.paper}`,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        color: theme.palette.mode === 'light'
          ? theme.palette.common.white
          : theme.palette.common.black,
        fontSize: '0.75rem',
        borderRadius: 4,
        padding: '8px 12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
      },
    },
  },
});
