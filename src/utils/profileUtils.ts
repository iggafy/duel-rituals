
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

/**
 * Helper function to check if a duel status is valid 
 * and different from the current status
 */
export const isDuelStatusChanged = (
  oldStatus: string | null | undefined,
  newStatus: string | null | undefined
): boolean => {
  if (!oldStatus || !newStatus) return false;
  return oldStatus !== newStatus;
};

/**
 * Helper function to format date strings consistently
 */
export const formatDuelDate = (dateString: string | null): string => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
