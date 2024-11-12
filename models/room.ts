export interface BaseRoom {
  room_id: string;
}

export interface ParamInviteCode {
  invite_code: string;
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
  host_id: UserType;
  player_list: PlayerType[];
  invite_code: string;
  max_players: number;
  is_private: boolean;
  is_playing: boolean;
  coin_per_person: number;
  leaderboard: string[];
  usedWords: string[];
  _id: string;
  players_in_match: PlayerInMatchType[];
  current_word?: string;
}

export interface PlayerType {
  _id: UserType;
  user_id: UserType;
  is_ready: boolean;
}

export interface PlayerInMatchType {
  is_playing: boolean;
  no: number;
  user_id: UserType;
}

export interface UserType {
  _id: string;
  avatar: string;
  stamina: number;
  coin: number;
  fullname: string;
  email: string;
}


export interface Definition {
  definition: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface PhoneticItem {
  text: string;
  audio: string;
}

export interface MeaningWord {
  meanings: Meaning[];
  phonetic: string;
  phonetics: PhoneticItem[];
}