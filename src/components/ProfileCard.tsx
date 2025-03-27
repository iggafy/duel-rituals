
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Sword, Shield } from 'lucide-react';

export interface ProfileCardProps {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  wins: number;
  losses: number;
  specialties: string[];
  title?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatar,
  reputation,
  wins,
  losses,
  specialties,
  title
}) => {
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;
  
  // Get the first letters of the name for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Calculate reputation level
  const getReputationLevel = (rep: number) => {
    if (rep >= 1000) return 'Legendary';
    if (rep >= 750) return 'Honored';
    if (rep >= 500) return 'Respected';
    if (rep >= 250) return 'Recognized';
    if (rep >= 100) return 'Known';
    return 'Novice';
  };

  return (
    <Card className="ritual-border overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16 border-2 border-duel-gold/40">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-duel text-white text-lg">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          {title && <p className="text-sm text-duel-gold">{title}</p>}
          <div className="flex items-center mt-1">
            <Trophy className="h-4 w-4 text-duel-gold mr-1" />
            <span className="text-sm font-medium">
              {getReputationLevel(reputation)} • {reputation} Rep
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-secondary p-2 rounded-md">
            <div className="text-sm text-muted-foreground">Duels</div>
            <div className="font-bold">{wins + losses}</div>
          </div>
          <div className="bg-secondary p-2 rounded-md">
            <div className="text-sm text-muted-foreground">Wins</div>
            <div className="font-bold text-green-400">{wins}</div>
          </div>
          <div className="bg-secondary p-2 rounded-md">
            <div className="text-sm text-muted-foreground">Win Rate</div>
            <div className="font-bold">{winRate}%</div>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="text-sm font-medium mb-2">Specialties:</div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="bg-duel/30 text-foreground">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
