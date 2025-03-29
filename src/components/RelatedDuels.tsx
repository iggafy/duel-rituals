
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Sword, Users } from 'lucide-react';

interface RelatedDuel {
  id: string;
  title: string;
  type: string;
  participants: number;
}

interface RelatedDuelsProps {
  duelId: string;
  duelType?: string;
}

const RelatedDuels = ({ duelId, duelType }: RelatedDuelsProps) => {
  // This is a placeholder for actual related duels functionality
  // In a real implementation, you'd fetch related duels from the database
  const relatedDuels: RelatedDuel[] = [
    {
      id: "duel-123",
      title: "Chess Championship Showdown",
      type: "intellectual",
      participants: 2
    },
    {
      id: "duel-456",
      title: "Debate on Economic Policy",
      type: "intellectual",
      participants: 4
    },
    {
      id: "duel-789",
      title: "Tactical Strategy Contest",
      type: "strategic",
      participants: 2
    }
  ].filter(duel => duel.id !== duelId);

  if (relatedDuels.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Related Duels</h3>
      <div className="space-y-3">
        {relatedDuels.map(duel => (
          <Link to={`/duels/${duel.id}`} key={duel.id}>
            <Card className="hover:bg-card/60 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-duel/10 flex items-center justify-center mr-3">
                      <Sword className="h-4 w-4 text-duel-gold" />
                    </div>
                    <span className="text-sm font-medium">{duel.title}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{duel.participants}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedDuels;
