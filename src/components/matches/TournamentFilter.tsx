import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
// Usar la forma correcta de importar el tipo
import type { SelectChangeEvent } from '@mui/material/Select';

interface TournamentFilterProps {
  tournaments: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
}

const TournamentFilter: React.FC<TournamentFilterProps> = ({ tournaments, value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="tournament-filter-label">Filtrar por Torneo</InputLabel>
      <Select
        labelId="tournament-filter-label"
        value={value}
        label="Filtrar por Torneo"
        onChange={handleChange}
      >
        <MenuItem value="">Todos los torneos</MenuItem>
        {tournaments.map((tournament) => (
          <MenuItem key={tournament.id} value={tournament.id.toString()}>
            {tournament.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TournamentFilter;
