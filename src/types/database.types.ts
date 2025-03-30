
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
  bio?: string;
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

// New types for unified profile handling
export type MockUser = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  reputation: number;
  wins: number;
  losses: number;
  specialties: string[];
  title?: string;
  bio?: string;
};

export type UnifiedProfile = {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  reputation: number;
  winsCount: number;
  lossesCount: number;
  totalDuels: number;
  specialties?: string[];
  title?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
};

// Helper functions to convert between types
export function toUnifiedProfile(source: Profile | MockUser): UnifiedProfile {
  if ('username' in source && 'created_at' in source) {
    // It's a Supabase Profile
    const profile = source as Profile;
    return {
      id: profile.id,
      displayName: profile.username,
      username: profile.username,
      avatarUrl: profile.avatar_url || '',
      reputation: profile.reputation || 0,
      winsCount: profile.duels_won || 0,
      lossesCount: profile.duels_lost || 0,
      totalDuels: (profile.duels_won || 0) + (profile.duels_lost || 0),
      bio: profile.bio,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    };
  } else {
    // It's a MockUser
    const user = source as MockUser;
    return {
      id: user.id,
      displayName: user.name,
      username: user.username,
      avatarUrl: user.avatar,
      reputation: user.reputation,
      winsCount: user.wins,
      lossesCount: user.losses,
      totalDuels: user.wins + user.losses,
      specialties: user.specialties,
      title: user.title,
      bio: user.bio
    };
  }
}
