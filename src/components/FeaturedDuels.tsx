
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sword, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeaturedDuel } from '@/types/database.types';
import { format } from 'date-fns';

interface FeaturedDuelsProps {
  userId: string;
}

const FeaturedDuels: React.FC<FeaturedDuelsProps> = ({ userId }) => {
  const { data: featuredDuels, isLoading, error } = useQuery({
    queryKey: ['featuredDuels', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_duels')
        .select('*')
        .eq('user_id', userId)
        .order('featured_at', { ascending: false });
      
      if (error) throw error;
      return data as FeaturedDuel[];
    }
  });

  if (isLoading) {
    return (
      <Card className="ritual-border">
        <CardHeader>
          <CardTitle>Featured Duels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading featured duels...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('Error loading featured duels:', error);
    return (
      <Card className="ritual-border">
        <CardHeader>
          <CardTitle>Featured Duels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Error loading featured duels. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!featuredDuels || featuredDuels.length === 0) {
    return (
      <Card className="ritual-border">
        <CardHeader>
          <CardTitle>Featured Duels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No featured duels yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="ritual-border">
      <CardHeader>
        <CardTitle>Featured Duels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {featuredDuels.map((duel) => (
            <Card key={duel.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Sword className="h-4 w-4 text-duel-gold" />
                    <Link 
                      to={`/duels/${duel.duel_id}`}
                      className="font-semibold hover:text-duel-gold hover:underline"
                    >
                      {duel.duel_title}
                    </Link>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Featured on {format(new Date(duel.featured_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                      className="border-duel/40 text-duel hover:bg-duel/10"
                    >
                      <Link to={`/duels/${duel.duel_id}`}>
                        View Duel
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedDuels;
