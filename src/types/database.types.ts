
export type Profile = {
  id: string;
  username: string;
  avatar_url?: string;
  reputation: number;
  duels_won: number;
  duels_lost: number;
  duels_participated: number;
  created_at: string;
  updated_at: string;
};

export type Duel = {
  id: string;
  title: string;
  reason: string;
  stakes: string;
  type: 'intellectual' | 'strategic' | 'physical';
  status: 'pending' | 'active' | 'completed' | 'declined';
  duration: number;
  challenger_id: string;
  opponent_id?: string;
  winner_id?: string;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
};

export type FeaturedDuel = {
  id: string;
  user_id: string;
  duel_id: string;
  duel_title: string;
  featured_at: string;
};

export type DuelVote = {
  id: string;
  duel_id: string;
  voter_id: string;
  vote_for_id: string;
  created_at: string;
};

export type DuelSpectator = {
  id: string;
  duel_id: string;
  user_id: string;
  joined_at: string;
};

export type DuelComment = {
  id: string;
  duel_id: string;
  user_id: string;
  content: string;
  created_at: string;
};
