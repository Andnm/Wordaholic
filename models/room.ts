export interface BaseRoom {
  room_id: string;
}

export interface CreateRoomModel {
  max_players: number;
  is_private: boolean;
  coin_per_person: number;
}

export interface UpdatePlayerTurn extends BaseRoom {
  word: string;
}

export interface UpdatePlayBotTurn {
  usedWords: string[];
  word: string;
}

export interface RoomType {
  host_id: string;
  player_list: PlayerList[];
  invite_code: string;
  max_players: number;
  is_private: boolean;
  is_playing: boolean;
  coin_per_person: number;
  leaderboard: any[];
  usedWords: string[];
  _id: string;
  players_in_match: any[];
}

export interface PlayerList {
  user_id: string;
  is_ready: boolean;
}
