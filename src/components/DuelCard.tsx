
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sword, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DuelCardProps {
  id: string;
  title: string;
  challenger: string;
  challengerId: string;
  opponent?: string;
  opponentId?: string;
  reason: string;
  type: 'intellectual' | 'strategic' | 'physical';
  status: 'pending' | 'active' | 'completed';
  stakes: string;
  spectatorCount: number;
  startTime?: string;
  winner?: string;
}

const DuelCard: React.FC<DuelCardProps> = ({
  id,
  title,
  challenger,
  opponent,
  reason,
  type,
  status,
  stakes,
  spectatorCount,
  startTime
}) => {
  const duelTypeColors = {
    intellectual: 'bg-blue-900/50 text-blue-200',
    strategic: 'bg-purple-900/50 text-purple-200',
    physical: 'bg-red-900/50 text-red-200'
  };

  const statusColors = {
    pending: 'bg-amber-900/50 text-amber-200',
    active: 'bg-green-900/50 text-green-200',
    completed: 'bg-gray-800/50 text-gray-200'
  };

  return (
    <Card className="ritual-border bg-card hover:shadow-md hover:shadow-duel-gold/10 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-duel-gold">{title}</CardTitle>
          <div className="flex space-x-2">
            <Badge className={duelTypeColors[type]}>{type}</Badge>
            <Badge className={statusColors[status]}>{status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Sword className="h-4 w-4 mr-1 text-duel-red" />
              <span>Challenger: <span className="font-semibold text-duel-light">{challenger}</span></span>
            </div>
            <div className="flex items-center text-sm">
              <span>Opponent: <span className="font-semibold text-duel-light">{opponent || 'Awaiting Response'}</span></span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Stakes: </span> 
            {stakes}
          </div>
          
          <div className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-medium text-foreground">Reason: </span> 
            {reason}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-3 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>{spectatorCount} spectators</span>
          </div>
          {startTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{startTime}</span>
            </div>
          )}
        </div>
        <Button 
          variant="link" 
          className="p-0 text-duel-gold hover:text-duel-light"
          asChild
        >
          <Link to={`/duels/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DuelCard;
