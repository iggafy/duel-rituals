export interface User {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  wins: number;
  losses: number;
  specialties: string[];
  title?: string;
  bio?: string;
}

export interface Duel {
  id: string;
  title: string;
  challengerId: string;
  challenger: string;
  challengerAvatar?: string;
  opponentId?: string;
  opponent?: string;
  opponentAvatar?: string;
  reason: string;
  type: 'intellectual' | 'strategic' | 'physical';
  status: 'pending' | 'active' | 'completed';
  stakes: string;
  spectatorCount: number;
  startTime?: string;
  duration: number; // in seconds
  winner?: string;
  winnerId?: string;
  votes?: {
    challengerVotes: number;
    opponentVotes: number;
  };
  arguments?: {
    challenger: string;
    opponent?: string;
  };
  createdAt: string;
}

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alexander Blackwood",
    avatar: "/placeholder.svg",
    reputation: 850,
    wins: 27,
    losses: 3,
    specialties: ["Debate", "Logic", "Classical Literature"],
    title: "Master of Logic",
    bio: "A skilled debater with an unmatched understanding of classical literature and logical reasoning. Known for dismantling opponents' arguments with surgical precision."
  },
  {
    id: "user-2",
    name: "Victoria Sterling",
    avatar: "/placeholder.svg",
    reputation: 760,
    wins: 23,
    losses: 5,
    specialties: ["Philosophy", "Ethics", "Mathematical Reasoning"],
    title: "Ethical Duelist",
    bio: "An expert in philosophical discourse with a focus on ethical considerations. Always fights fair, but never backs down from a challenge."
  },
  {
    id: "user-3",
    name: "Marcus Aurelius",
    avatar: "/placeholder.svg",
    reputation: 920,
    wins: 31,
    losses: 2,
    specialties: ["Strategy", "History", "Political Theory"],
    title: "The Strategist",
    bio: "An undefeated master of strategic duels who approaches each contest with meticulous planning and historical knowledge."
  },
  {
    id: "user-4",
    name: "Eleanor Hawthorne",
    avatar: "/placeholder.svg",
    reputation: 680,
    wins: 19,
    losses: 4,
    specialties: ["Quick Wit", "Linguistics", "Modern Literature"],
    title: "Wordsmith",
    bio: "A literary expert with an exceptional command of language and quick wit, turning every duel into a masterful display of linguistic prowess."
  },
  {
    id: "user-5",
    name: "Jonathan Zhao",
    avatar: "/placeholder.svg",
    reputation: 580,
    wins: 16,
    losses: 7,
    specialties: ["Technology", "Science", "Innovation"],
    title: "Tech Duelist",
    bio: "A rising star in technical debates, challenging established ideas with cutting-edge knowledge of science and innovation."
  },
  {
    id: "user-6",
    name: "Isabella Montague",
    avatar: "/placeholder.svg",
    reputation: 820,
    wins: 24,
    losses: 4,
    specialties: ["Art History", "Cultural Analysis", "Creativity"],
    title: "Cultural Savant",
    bio: "A master of cultural discourse, connecting historical contexts with modern interpretations to create compelling and unbeatable arguments."
  },
  {
    id: "user-7",
    name: "Sebastian Knight",
    avatar: "/placeholder.svg",
    reputation: 710,
    wins: 20,
    losses: 6,
    specialties: ["Chess Strategy", "Game Theory", "Mathematical Puzzles"],
    title: "Gambit Master",
    bio: "Renowned for his chess-like approach to duels, planning several moves ahead and maneuvering opponents into intellectual checkmates."
  },
  {
    id: "user-8",
    name: "Olivia Chen",
    avatar: "/placeholder.svg",
    reputation: 630,
    wins: 17,
    losses: 5,
    specialties: ["Psychology", "Behavioral Analysis", "Rhetoric"],
    title: "Mind Reader",
    bio: "A psychological duelist who analyzes opponents' argument patterns and anticipates their moves, turning their strengths into weaknesses."
  }
];

export const mockDuels: Duel[] = [
  {
    id: "duel-1",
    title: "The Classical Principles Debate",
    challengerId: "user-1",
    challenger: "Alexander Blackwood",
    challengerAvatar: "/placeholder.svg",
    opponentId: "user-6",
    opponent: "Isabella Montague",
    opponentAvatar: "/placeholder.svg",
    reason: "To settle whether aesthetic principles in classical literature have meaningful application in modern artistic expression.",
    type: "intellectual",
    status: "active",
    stakes: "The loser must publicly acknowledge the superior interpretation and provide a written analysis supporting the winner's position.",
    spectatorCount: 148,
    startTime: "2023-09-15 14:00",
    duration: 300, // 5 minutes
    arguments: {
      challenger: "Classical principles of narrative and form provide the foundation for all meaningful artistic expression. Modern works that abandon these principles sacrifice depth for novelty.",
      opponent: "Modern artistic expression has evolved beyond classical constraints, creating new forms of depth and meaning that classical frameworks cannot adequately evaluate or contain."
    },
    createdAt: "2023-09-10 09:15"
  },
  {
    id: "duel-2",
    title: "Strategic Chess Battle",
    challengerId: "user-7",
    challenger: "Sebastian Knight",
    challengerAvatar: "/placeholder.svg",
    opponentId: "user-3",
    opponent: "Marcus Aurelius",
    opponentAvatar: "/placeholder.svg",
    reason: "To determine who possesses superior strategic thinking in complex, time-constrained scenarios.",
    type: "strategic",
    status: "completed",
    stakes: "The winner earns the title of 'Grand Strategist' for the next month on their profile, while the loser must analyze the winning strategy in detail.",
    spectatorCount: 237,
    startTime: "2023-09-12 16:30",
    duration: 600, // 10 minutes
    winner: "Marcus Aurelius",
    winnerId: "user-3",
    votes: {
      challengerVotes: 87,
      opponentVotes: 150
    },
    createdAt: "2023-09-05 11:30"
  },
  {
    id: "duel-3",
    title: "Ethical Dilemmas in Modern Technology",
    challengerId: "user-2",
    challenger: "Victoria Sterling",
    challengerAvatar: "/placeholder.svg",
    opponentId: "user-5",
    opponent: "Jonathan Zhao",
    opponentAvatar: "/placeholder.svg",
    reason: "To resolve whether technological advancement should proceed without ethical constraints.",
    type: "intellectual",
    status: "pending",
    stakes: "The winner's position will be featured in the monthly DuelOn journal, with the loser required to present a counter-argument.",
    spectatorCount: 89,
    startTime: "2023-09-18 15:00",
    duration: 480, // 8 minutes
    createdAt: "2023-09-14 13:45"
  },
  {
    id: "duel-4",
    title: "Literary Wordplay Challenge",
    challengerId: "user-4",
    challenger: "Eleanor Hawthorne",
    challengerAvatar: "/placeholder.svg",
    opponentId: "user-8",
    opponent: "Olivia Chen",
    opponentAvatar: "/placeholder.svg",
    reason: "To determine whose linguistic prowess and quick wit reigns supreme in rapid literary analysis.",
    type: "physical",
    status: "completed",
    stakes: "The loser must compose a sonnet praising the winner's verbal agility and literary insight.",
    spectatorCount: 176,
    startTime: "2023-09-11 17:00",
    duration: 240, // 4 minutes
    winner: "Eleanor Hawthorne",
    winnerId: "user-4",
    votes: {
      challengerVotes: 123,
      opponentVotes: 53
    },
    createdAt: "2023-09-07 10:20"
  },
  {
    id: "duel-5",
    title: "The Great Political Theory Showdown",
    challengerId: "user-3",
    challenger: "Marcus Aurelius",
    challengerAvatar: "/placeholder.svg",
    opponentId: "user-1",
    opponent: "Alexander Blackwood",
    opponentAvatar: "/placeholder.svg",
    reason: "To establish which political philosophy better addresses modern societal challenges.",
    type: "intellectual",
    status: "pending",
    stakes: "The winner gains 50 reputation points, and the loser must study the winner's recommended political texts for one month.",
    spectatorCount: 201,
    startTime: "2023-09-20 13:00",
    duration: 360, // 6 minutes
    createdAt: "2023-09-15 16:10"
  }
];

export const getUser = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const getDuel = (duelId: string): Duel | undefined => {
  return mockDuels.find(duel => duel.id === duelId);
};

export const getActiveAndUpcomingDuels = (): Duel[] => {
  return mockDuels.filter(duel => duel.status === 'active' || duel.status === 'pending')
    .sort((a, b) => {
      // Active duels first
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // Then by start time
      if (a.startTime && b.startTime) {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      return 0;
    });
};

export const getCompletedDuels = (): Duel[] => {
  return mockDuels.filter(duel => duel.status === 'completed')
    .sort((a, b) => {
      // Most recent first
      if (a.startTime && b.startTime) {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      return 0;
    });
};

export const getLeaderboard = () => {
  return [...mockUsers].sort((a, b) => b.reputation - a.reputation)
    .map((user, index) => ({ ...user, rank: index + 1 }));
};

export const getUserDuels = (userId: string): Duel[] => {
  return mockDuels.filter(
    duel => duel.challengerId === userId || duel.opponentId === userId
  ).sort((a, b) => {
    // Sort by status first (active, pending, completed)
    const statusOrder = { active: 0, pending: 1, completed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Then by start time
    if (a.startTime && b.startTime) {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    return 0;
  });
};
