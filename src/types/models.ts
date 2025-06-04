export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;         // Agregado campo de teléfono
  userRoleId: number;
  userStatusId: number;
  playerLevel?: string;   // En la API se llama 'level'
  dominantHand?: string;  // En la API se llama 'playing_hand'
  experienceYears?: number; // En la API se llama 'experience_years'
  heightCm?: number;      // En la API se llama 'height_cm'
  weightKg?: number;      // En la API se llama 'weight_kg'
  city?: string;
  country?: string;
  playingPosition?: string; // En la API se llama 'playing_position'
  favoriteRacket?: string;  // En la API se llama 'favorite_racket'
  photo?: string;
  userRole?: UserRole;
  userStatus?: UserStatus;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserStatus {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  player1Id: number;
  player2Id: number;
  player1?: User;
  player2?: User;
  tournaments?: Tournament[];
  seed?: number; // Semilla asignada en un torneo
}

export interface Tournament {
  id: number;
  name: string;
  description?: string;
  organizerId: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'open' | 'in_progress' | 'completed';
  format: 'elimination' | 'round_robin';
  maxTeams?: number;
  location?: string;
  organizer?: User;
  teams?: Team[];
  matches?: Match[];
}

export interface Match {
  id: number;
  tournamentId: number;
  round: number;
  matchNumber: number;
  team1Id: number;
  team2Id: number;
  status: 'pending' | 'in_progress' | 'completed'; // Cambiado a 'pending' para coincidir con la API
  scheduledAt?: string;
  completedAt?: string;
  team1Score?: number;
  team2Score?: number;
  // Alias para compatibilidad con la interfaz de usuario
  scoreTeam1?: number;
  scoreTeam2?: number;
  winnerId?: number;
  nextMatchId?: number;
  team1?: Team;
  team2?: Team;
  tournament?: Tournament;
  winner?: Team;
  // setResults puede ser un string (formato JSON) o un array de objetos dependiendo del endpoint
  setResults?: string | {team1: number, team2: number}[];
}

export interface SetResult {
  id: number;
  matchId: number;
  setNumber: number;
  team1Score: number;
  team2Score: number;
}

export interface PlayerStat {
  id: number;
  playerId: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsPlayed: number;
  setsWon: number;
  setsLost: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  winRatio: string | number; // Puede venir como string desde la API
  rankingPoints: number;
  lastMatchDate?: string;    // Fecha del último partido
  createdAt?: string;
  updatedAt?: string;
  player?: User;
}

export interface TeamStat {
  id: number;
  teamId: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  setsPlayed: number;
  setsWon: number;
  setsLost: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  winRatio: number;
  rankingPoints: number;
  bestTournamentResult?: string;
  team?: Team;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  data: T[];
}
