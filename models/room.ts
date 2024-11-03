export interface BaseRoom {
  room_id: string;
}

export interface CreateRoomModel {
  max_players: number;
  is_private: boolean;
  coin_per_person: number;
}

export interface ParamJoinRoom extends BaseRoom {
  invite_code: string;
}

export interface ParamLeaveRoom extends BaseRoom {}

export interface ParamKickPlayer extends BaseRoom {
  user_id: string;
}

export interface UpdatePlayerTurn extends BaseRoom {
  word: string;
}

export interface UpdatePlayBotTurn {
  usedWords: string[];
  word: string;
}
