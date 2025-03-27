
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  reputation: number;
  wins: number;
  losses: number;
  title?: string;
  specialties: string[];
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users }) => {
  // Get the first letters of the name for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Style for rank badges
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 text-black';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-amber-700 text-amber-50';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Duelist</TableHead>
            <TableHead className="hidden md:table-cell">Specialty</TableHead>
            <TableHead className="text-right">W/L</TableHead>
            <TableHead className="text-right">Reputation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="text-center font-medium">
                <div className="flex justify-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${getRankStyle(user.rank)}`}>
                    {user.rank}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Link to={`/profile/${user.id}`} className="flex items-center space-x-3 hover:underline">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-duel/50 text-white text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    {user.title && (
                      <div className="text-xs text-duel-gold">{user.title}</div>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {user.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge key={index} variant="outline" className="bg-duel/20 text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {user.specialties.length > 2 && (
                    <Badge variant="outline" className="bg-secondary text-xs">
                      +{user.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono">
                <span className="text-green-400">{user.wins}</span>/<span className="text-red-400">{user.losses}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Trophy className="h-3.5 w-3.5 text-duel-gold" />
                  <span className="font-semibold">{user.reputation}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
