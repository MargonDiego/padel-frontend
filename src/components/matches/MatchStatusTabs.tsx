import React from 'react';
import {
  Box,
  Tabs,
  Tab
} from '@mui/material';

interface MatchStatusTabsProps {
  value: number;
  onChange: (value: number) => void;
}

const MatchStatusTabs: React.FC<MatchStatusTabsProps> = ({ value, onChange }) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs 
        value={value} 
        onChange={handleChange} 
        aria-label="estado de partidos"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Todos" />
        <Tab label="Próximos" />
        <Tab label="En progreso" />
        <Tab label="Finalizados" />
      </Tabs>
    </Box>
  );
};

export default MatchStatusTabs;
