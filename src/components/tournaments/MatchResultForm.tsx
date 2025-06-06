import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import type { Match } from '../../types/models';

interface MatchResultFormProps {
  open: boolean;
  match: Match | null;
  onClose: () => void;
  onSubmit: (matchId: number, scoreTeam1: number, scoreTeam2: number, setResults: {team1: number, team2: number}[], winnerId: number | null, status: string) => void;
}

const MatchResultForm: React.FC<MatchResultFormProps> = ({
  open,
  match,
  onClose,
  onSubmit
}) => {
  // Estado para manejar los sets
  const [sets, setSets] = useState<{team1: string, team2: string}[]>([{ team1: '', team2: '' }]);
  const [scoreTeam1, setScoreTeam1] = useState(0);
  const [scoreTeam2, setScoreTeam2] = useState(0);
  const [matchStatus, setMatchStatus] = useState<'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('in_progress');
  const [validationError, setValidationError] = useState('');

  // Cargar datos existentes cuando se abre el diálogo
  useEffect(() => {
    if (match && open) {
      setValidationError('');
      
      // Establecer el estado actual del partido
      if (match.status) {
        setMatchStatus(match.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled');
      } else {
        setMatchStatus('in_progress');
      }
      
      // Si el partido ya tiene resultados, cargarlos
      if (match.setResults && match.scoreTeam1 !== undefined && match.scoreTeam2 !== undefined) {
        try {
          const parsedSets = JSON.parse(match.setResults as string);
          if (Array.isArray(parsedSets)) {
            // Convertir los resultados a formato de string para los campos
            setSets(parsedSets.map(set => ({
              team1: set.team1.toString(),
              team2: set.team2.toString()
            })));
            setScoreTeam1(match.scoreTeam1);
            setScoreTeam2(match.scoreTeam2);
          }
        } catch (e) {
          // Si hay error al parsear, iniciar con un set vacío
          setSets([{ team1: '', team2: '' }]);
          setScoreTeam1(0);
          setScoreTeam2(0);
        }
      } else {
        // Iniciar con un set vacío
        setSets([{ team1: '', team2: '' }]);
        setScoreTeam1(0);
        setScoreTeam2(0);
      }
    }
  }, [match, open]);

  // Añadir un nuevo set vacío
  const handleAddSet = () => {
    setSets([...sets, { team1: '', team2: '' }]);
  };

  // Eliminar un set
  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      const newSets = [...sets];
      newSets.splice(index, 1);
      setSets(newSets);
    }
  };

  // Actualizar valor de un set
  const handleSetChange = (index: number, team: 'team1' | 'team2', value: string) => {
    // Solo permitir números
    if (value !== '' && !/^\d+$/.test(value)) return;
    
    const newSets = [...sets];
    newSets[index][team] = value;
    setSets(newSets);
  };

  // Calcular resultados globales basados en los sets
  useEffect(() => {
    if (sets.length === 0) return;
    
    let team1Sets = 0;
    let team2Sets = 0;
    
    // Contar sets ganados por cada equipo
    sets.forEach(set => {
      if (set.team1 !== '' && set.team2 !== '') {
        const score1 = parseInt(set.team1);
        const score2 = parseInt(set.team2);
        
        if (score1 > score2) team1Sets++;
        else if (score2 > score1) team2Sets++;
      }
    });
    
    // Establecer el número de sets ganados por cada equipo
    setScoreTeam1(team1Sets);
    setScoreTeam2(team2Sets);
  }, [sets]);

  // Determinar el ID del equipo ganador basado en los resultados
  const determineWinnerId = (): number | null => {
    if (!match) return null;
    
    // El equipo con más sets ganados es el ganador
    if (scoreTeam1 > scoreTeam2 && match.team1) {
      return match.team1.id;
    } else if (scoreTeam2 > scoreTeam1 && match.team2) {
      return match.team2.id;
    }
    
    return null;
  };
  
  // Manejar cambio de estado del partido
  const handleStatusChange = (event: SelectChangeEvent) => {
    setMatchStatus(event.target.value as 'scheduled' | 'in_progress' | 'completed' | 'cancelled');
  };

  // Validar y enviar resultado
  const handleSubmit = () => {
    if (!match) return;
    
    // Validar que todos los sets tengan valores válidos
    const validSets = sets.filter(set => set.team1 !== '' && set.team2 !== '');
    
    if (validSets.length === 0 && matchStatus !== 'scheduled' && matchStatus !== 'cancelled') {
      setValidationError('Debe ingresar al menos un set con resultados válidos');
      return;
    }
    
    // Convertir los sets a formato numérico para la API
    const formattedSets = validSets.map(set => ({
      team1: parseInt(set.team1),
      team2: parseInt(set.team2)
    }));
    
    // Determinar ganador según el estado del partido
    let winnerId: number | null = null;
    
    if (matchStatus === 'completed') {
      // Validar que al menos un equipo tenga mayoría de sets ganados
      if (scoreTeam1 === scoreTeam2) {
        setValidationError('Para un partido completado, debe haber un ganador claro (un equipo debe ganar más sets)');
        return;
      }
      
      // Determinar automáticamente el ganador
      winnerId = determineWinnerId();
      
      if (!winnerId) {
        setValidationError('No se pudo determinar un ganador. Verifica que ambos equipos tengan IDs válidos.');
        return;
      }
    }
    
    // Enviar todos los datos del resultado
    onSubmit(
      match.id,
      scoreTeam1,
      scoreTeam2,
      formattedSets,
      winnerId,
      matchStatus
    );
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Registrar Resultado</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Información de equipos */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                {match?.team1?.name || 'Equipo 1'}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                {match?.team2?.name || 'Equipo 2'}
              </Typography>
            </Grid>
          </Grid>
          
          {/* Estado del partido */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="match-status-label">Estado del partido</InputLabel>
            <Select
              labelId="match-status-label"
              value={matchStatus}
              label="Estado del partido"
              onChange={handleStatusChange}
            >
              <MenuItem value="scheduled">Programado</MenuItem>
              <MenuItem value="in_progress">En progreso</MenuItem>
              <MenuItem value="completed">Completado</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
            <FormHelperText>
              Selecciona el estado actual del partido
            </FormHelperText>
          </FormControl>
          
          {/* Resultado global calculado */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6" align="center">
              Resultado Global: {scoreTeam1} - {scoreTeam2}
            </Typography>
            {scoreTeam1 !== scoreTeam2 && (
              <Typography variant="body2" align="center" sx={{ mt: 1 }} color={scoreTeam1 > scoreTeam2 ? 'primary.main' : 'secondary.main'} fontWeight="medium">
                Ganador: {scoreTeam1 > scoreTeam2 ? match?.team1?.name || 'Equipo 1' : match?.team2?.name || 'Equipo 2'}
              </Typography>
            )}
            <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>
              (Se calcula automáticamente en base a los sets ganados por cada equipo)
            </Typography>
          </Box>
          
          {/* Lista de sets */}
          <Typography variant="subtitle1" gutterBottom>Sets:</Typography>
          <List disablePadding>
            {sets.map((set, index) => (
              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={5}>
                    <TextField
                      label={`Set ${index + 1}: ${match?.team1?.name || 'Equipo 1'}`}
                      fullWidth
                      size="small"
                      value={set.team1}
                      onChange={(e) => handleSetChange(index, 'team1', e.target.value)}
                      inputProps={{ inputMode: 'numeric' }}
                    />
                  </Grid>
                  <Grid size={5}>
                    <TextField
                      label={`Set ${index + 1}: ${match?.team2?.name || 'Equipo 2'}`}
                      fullWidth
                      size="small"
                      value={set.team2}
                      onChange={(e) => handleSetChange(index, 'team2', e.target.value)}
                      inputProps={{ inputMode: 'numeric' }}
                    />
                  </Grid>
                  <Grid size={2}>
                    <IconButton 
                      onClick={() => handleRemoveSet(index)}
                      disabled={sets.length <= 1}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          
          {/* Botón para añadir set */}
          <Button 
            variant="outlined" 
            onClick={handleAddSet} 
            fullWidth 
            sx={{ mt: 2, mb: 2 }}
            startIcon={<AddCircleIcon />}
          >
            Añadir Set
          </Button>
          
          {/* Mensaje de error de validación */}
          {validationError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {validationError}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={matchStatus === 'scheduled' && sets.some(set => set.team1 !== '' || set.team2 !== '')}
        >
          {matchStatus === 'completed' ? 'Completar partido' : 
           matchStatus === 'in_progress' ? 'Actualizar progreso' : 
           matchStatus === 'cancelled' ? 'Cancelar partido' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchResultForm;
