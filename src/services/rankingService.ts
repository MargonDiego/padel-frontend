import apiClient from './apiClient';
import type { ApiResponse } from '../types/models';

interface Player {
  id: number;
  userRoleId: number;
  userStatusId: number;
  username: string;
  name: string;
  photo: string | null;
  email: string;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  playerLevel: string | null;
  dominantHand: string | null;
  experienceYears: number | null;
  heightCm: number | null;
  weightKg: number | null;
  city: string | null;
  country: string | null;
  playingPosition: string | null;
  favoriteRacket: string | null;
}

export interface RankingPlayer {
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
  winRatio: string;
  rankingPoints: number;
  lastMatchDate: string | null;
  createdAt: string;
  updatedAt: string;
  player: Player;
}

interface Team {
  id: number;
  name: string;
  description: string;
  player1Id: number;
  player2Id: number;
  teamPhoto: string | null;
  createdAt: string;
  updatedAt: string;
  player1: Player;
  player2: Player;
}

export interface RankingTeam {
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
  winRatio: string;
  rankingPoints: number;
  bestTournamentResult: string | null;
  lastMatchDate: string | null;
  createdAt: string;
  updatedAt: string;
  team: Team;
}

export const rankingService = {
  // Obtener ranking de jugadores
  getPlayerRankings: async (page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<RankingPlayer[]>>(`/rankings/players?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener ranking de equipos
  getTeamRankings: async (page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<RankingTeam[]>>(`/rankings/teams?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener estadísticas de un jugador específico
  getPlayerStats: async (playerId: number) => {
    const response = await apiClient.get<ApiResponse<RankingPlayer>>(`/stats/players/${playerId}`);
    return response.data;
  },

  // Obtener estadísticas de un equipo específico
  getTeamStats: async (teamId: number) => {
    const response = await apiClient.get<ApiResponse<RankingTeam>>(`/stats/teams/${teamId}`);
    return response.data;
  },
};

export default rankingService;
