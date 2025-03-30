
/**
 * Utils for handling profile data consistently throughout the app
 */

/**
 * Get the first letter of a username for avatar fallbacks
 */
export const getUserInitial = (username: string): string => {
  if (!username) return '?';
  return username.charAt(0).toUpperCase();
};

/**
 * Format username for display
 */
export const formatUsername = (username: string | undefined | null): string => {
  if (!username) return 'Unknown user';
  return username;
};

/**
 * Extract user profile data in a consistent format
 */
export interface UserDisplayData {
  id: string;
  name: string;
  avatar?: string;
}

export const extractUserData = (profile: any): UserDisplayData => {
  if (!profile) {
    return {
      id: 'unknown',
      name: 'Unknown user'
    };
  }
  
  return {
    id: profile.id || 'unknown',
    name: profile.username || 'Unknown user',
    avatar: profile.avatar_url
  };
};

/**
 * Create user display for duel participants
 */
export const getDuelParticipantDisplay = (
  challenger: any, 
  opponent: any, 
  winnerId?: string
): { challenger: UserDisplayData, opponent?: UserDisplayData, winner?: string } => {
  const challengerData = extractUserData(challenger);
  const opponentData = opponent ? extractUserData(opponent) : undefined;
  
  return {
    challenger: challengerData,
    opponent: opponentData,
    winner: winnerId
  };
};
