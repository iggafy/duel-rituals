
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sword, Users, Clock, Trophy, FireExtinguisher, Brain } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DuelCardProps {
  id: string;
  title: string;
  type: "intellectual" | "strategic" | "physical";
  status: "active" | "pending" | "completed" | "declined";
  challenger: { name: string; avatar?: string };
  challengerId?: string;
  opponent?: { name: string; avatar?: string };
  opponentId?: string;
  reason?: string;
  stakes?: string;
  duration?: number;
  spectatorCount: number;
  startTime?: string;
  createdAt?: string;
  winner?: string;
  highlight?: boolean; // Added highlight prop
}

const DuelCard: React.FC<DuelCardProps> = ({
  id,
  title,
  type,
  status,
  challenger,
  challengerId,
  opponent,
  opponentId,
  reason,
  stakes,
  duration = 600, // Default 10 minutes if not provided
  spectatorCount,
  startTime,
  createdAt,
  winner,
  highlight = false // Default to false
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const typeColor = {
    'intellectual': 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60',
    'strategic': 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/60',
    'physical': 'bg-red-900/50 text-red-200 hover:bg-red-800/60'
  }[type] || 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60';

  const statusColor = {
    'pending': 'bg-amber-900/50 text-amber-200 hover:bg-amber-800/60',
    'active': 'bg-green-900/50 text-green-200 hover:bg-green-800/60',
    'completed': 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60',
    'declined': 'bg-red-900/50 text-red-200 hover:bg-red-800/60'
  }[status] || 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60';

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'No date provided';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getTypeIcon = () => {
    switch(type) {
      case 'intellectual':
        return <Brain className="h-4 w-4 mr-1 text-blue-200" />;
      case 'strategic':
        return <Sword className="h-4 w-4 mr-1 text-purple-200" />; // Changed from ChessKnight to Sword for strategic
      case 'physical':
        return <FireExtinguisher className="h-4 w-4 mr-1 text-red-200" />;
      default:
        return <Sword className="h-4 w-4 mr-1 text-duel-gold" />;
    }
  };

  return (
    <Card className={cn(
      "ritual-border overflow-hidden hover:bg-accent/5 transition-colors group",
      highlight && "border-amber-500/50 bg-amber-950/10"
    )}>
      <Link to={`/duels/${id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-xl text-duel-gold line-clamp-1 group-hover:text-duel-gold/80 transition-colors">
              {title}
            </CardTitle>
            <div className="flex flex-wrap gap-2 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={cn("transition-colors cursor-help", typeColor)}>
                      <span className="flex items-center">
                        {getTypeIcon()}
                        {type}
                      </span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{type === 'intellectual' ? 'Battle of wits and knowledge' : 
                       type === 'strategic' ? 'Test of planning and foresight' : 
                       'Contest of physical skill'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={cn("transition-colors cursor-help", statusColor)}>{status}</Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{status === 'pending' ? 'Awaiting acceptance' : 
                       status === 'active' ? 'Currently in progress' : 
                       status === 'completed' ? 'Duel has concluded' : 
                       'Challenge was declined'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Created {formatDate(createdAt || '')}
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          {reason && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 italic">
              "{reason}"
            </p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 border border-duel-gold/40 transition-all group-hover:border-duel-gold/60">
                <AvatarImage src={challenger.avatar} alt={challenger.name} />
                <AvatarFallback className="bg-duel/50 text-white">
                  {challenger.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium group-hover:text-duel-gold/80 transition-colors">
                {challenger.name}
                {winner === challengerId && (
                  <Trophy className="h-4 w-4 inline-block ml-1 text-duel-gold" />
                )}
              </span>
            </div>
            
            <div className="text-muted-foreground mx-4 font-bold">vs</div>
            
            {opponent ? (
              <div className="flex items-center">
                <span className="font-medium group-hover:text-duel-gold/80 transition-colors">
                  {opponent.name}
                  {winner === opponentId && (
                    <Trophy className="h-4 w-4 inline-block ml-1 text-duel-gold" />
                  )}
                </span>
                <Avatar className="h-8 w-8 ml-2 border border-duel-gold/40 transition-all group-hover:border-duel-gold/60">
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
          
          {stakes && (
            <div className="mt-3 pt-3 border-t border-duel-gold/10">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-duel-gold/90">Stakes:</span> {stakes}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center group-hover:text-foreground/80 transition-colors">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration ? formatDuration(duration) : 'N/A'}</span>
            </div>
            
            <div className="flex items-center">
              <Sword className="h-4 w-4 mx-1 text-duel-gold group-hover:scale-110 transition-transform" />
            </div>
            
            <div className="flex items-center group-hover:text-foreground/80 transition-colors">
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
