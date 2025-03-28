
export const users = [
  {
    id: 'user1',
    name: 'Alexander Hamilton',
    username: 'a_ham',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    reputation: 850,
    wins: 42,
    losses: 12,
    specialties: ['Debate', 'Political Theory', 'Economics'],
    title: 'Master Debater'
  },
  {
    id: 'user2',
    name: 'Aaron Burr',
    username: 'a_burr',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron',
    reputation: 750,
    wins: 38,
    losses: 15,
    specialties: ['Law', 'Politics', 'Dueling'],
    title: 'The Gentleman'
  },
  {
    id: 'user3',
    name: 'Thomas Jefferson',
    username: 't_jeff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    reputation: 920,
    wins: 53,
    losses: 8,
    specialties: ['Philosophy', 'Architecture', 'Writing'],
    title: 'The Sage'
  }
];

export const duels = [
  {
    id: 'duel1',
    title: 'The Great Debate on Constitutional Interpretation',
    reason: 'To settle the dispute over the extent of federal government powers under the Constitution.',
    stakes: 'The loser must publicly acknowledge the winner\'s superior understanding of the Constitution.',
    type: 'intellectual',
    status: 'active',
    duration: 600, // 10 minutes
    challenger: 'Alexander Hamilton',
    challengerId: 'user1',
    challengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    opponent: 'Thomas Jefferson',
    opponentId: 'user3',
    opponentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    createdAt: '2023-11-15T14:30:00Z',
    spectatorCount: 57,
    votes: {
      challengerVotes: 24,
      opponentVotes: 31
    },
    arguments: {
      challenger: 'The Constitution clearly grants the federal government extensive powers to ensure a strong, unified nation. Its elastic clause provides flexibility to address new challenges.',
      opponent: 'The Constitution is a limiting document, designed to restrain federal power. States retain all powers not explicitly granted to the federal government.'
    }
  },
  {
    id: 'duel2',
    title: 'Chess Match: The Battle of Wits',
    reason: 'To determine who possesses superior strategic thinking skills.',
    stakes: 'The winner gains bragging rights and the loser must study the winner\'s chess playbook for a month.',
    type: 'strategic',
    status: 'pending',
    duration: 1800, // 30 minutes
    challenger: 'Aaron Burr',
    challengerId: 'user2',
    challengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron',
    opponent: 'Alexander Hamilton',
    opponentId: 'user1',
    opponentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    createdAt: '2023-11-18T09:45:00Z',
    spectatorCount: 24,
    votes: {
      challengerVotes: 12,
      opponentVotes: 15
    }
  },
  {
    id: 'duel3',
    title: 'The Typing Speed Challenge',
    reason: 'To determine who has the fastest typing skills for document preparation.',
    stakes: 'The loser must serve as the winner\'s secretary for one week.',
    type: 'physical',
    status: 'completed',
    duration: 300, // 5 minutes
    challenger: 'Thomas Jefferson',
    challengerId: 'user3',
    challengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    opponent: 'Aaron Burr',
    opponentId: 'user2',
    opponentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aaron',
    winner: 'Thomas Jefferson',
    createdAt: '2023-11-10T16:20:00Z',
    spectatorCount: 42,
    votes: {
      challengerVotes: 28,
      opponentVotes: 17
    },
    arguments: {
      challenger: 'My experience drafting the Declaration of Independence has honed my typing speed to perfection.',
      opponent: 'My methodical approach allows for speed without sacrificing accuracy.'
    }
  },
  {
    id: 'duel4',
    title: 'Financial Policy Showdown',
    reason: 'To resolve our disagreement on the national banking system.',
    stakes: 'The loser must publicly endorse the winner\'s financial plan.',
    type: 'intellectual',
    status: 'pending',
    duration: 900, // 15 minutes
    challenger: 'Alexander Hamilton',
    challengerId: 'user1',
    challengerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    createdAt: '2023-11-19T11:30:00Z',
    spectatorCount: 5,
    votes: {
      challengerVotes: 0,
      opponentVotes: 0
    }
  }
];

// Helper functions to get data
export const getDuel = (id: string) => {
  return duels.find(duel => duel.id === id);
};

export const getUser = (id: string) => {
  return users.find(user => user.id === id);
};
