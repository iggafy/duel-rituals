
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sword, Users, Clock } from 'lucide-react';

interface DuelCardProps {
  id: string;
  title: string;
  type: 'intellectual' | 'strategic' | 'physical';
  status: 'pending' | 'active' | 'completed' | 'declined';
  challenger: {
    name: string;
    avatar?: string;
  };
  opponent?: {
    name: string;
    avatar?: string;
  };
  duration: number;
  spectatorCount: number;
  createdAt: string;
}

const DuelCard: React.FC<DuelCardProps> = ({
  id,
  title,
  type,
  status,
  challenger,
  opponent,
  duration,
  spectatorCount,
  createdAt
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const typeColor = {
    'intellectual': 'bg-blue-900/50 text-blue-200',
    'strategic': 'bg-purple-900/50 text-purple-200',
    'physical': 'bg-red-900/50 text-red-200'
  }[type];

  const statusColor = {
    'pending': 'bg-amber-900/50 text-amber-200',
    'active': 'bg-green-900/50 text-green-200',
    'completed': 'bg-gray-800/50 text-gray-200',
    'declined': 'bg-red-900/50 text-red-200'
  }[status];

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="ritual-border overflow-hidden hover:bg-accent/5 transition-colors">
      <Link to={`/duels/${id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-xl text-duel-gold line-clamp-1">{title}</CardTitle>
            <div className="flex flex-wrap gap-2 ml-2">
              <Badge className={typeColor}>{type}</Badge>
              <Badge className={statusColor}>{status}</Badge>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Created {formatDate(createdAt)}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border border-duel-gold/40">
                <AvatarImage src={challenger.avatar} alt={challenger.name} />
                <AvatarFallback className="bg-duel/50 text-white">
                  {challenger.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{challenger.name}</span>
            </div>
            
            <div className="text-muted-foreground mx-4">vs</div>
            
            {opponent ? (
              <div className="flex items-center">
                <span className="font-medium">{opponent.name}</span>
                <Avatar className="h-8 w-8 ml-2 border border-duel-gold/40">
                  <AvatarImage src={opponent.avatar} alt={opponent.name} />
                  <AvatarFallback className="bg-duel/50 text-white">
                    {opponent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="text-muted-foreground italic">Awaiting opponent</div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDuration(duration)}</span>
            </div>
            
            <div className="flex items-center">
              <Sword className="h-4 w-4 mx-1 text-duel-gold" />
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{spectatorCount} watching</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default DuelCard;
