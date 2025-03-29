import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelTimer from '@/components/DuelTimer';
import DuelActions from '@/components/DuelActions';
import DuelComments from '@/components/DuelComments';
import DuelVoting from '@/components/DuelVoting';
import ShareDuelInvite from '@/components/ShareDuelInvite';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Sword, 
  Trophy,
  Calendar,
  Clock,
  AlertCircle,
  Users,
  Brain,
  FireExtinguisher
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Duel {
  id: string;
  title: string;
  reason: string;
  stakes: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  type: 'intellectual' | 'strategic' | 'physical';
  challenger_id: string;
  opponent_id: string | null;
  winner_id: string | null;
  duration: number;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

const DuelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [duel, setDuel] = useState<Duel | null>(null);
  const [challenger, setChallenger] = useState<Profile | null>(null);
  const [opponent, setOpponent] = useState<Profile | null>(null);
  const [winner, setWinner] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [isSpectating, setIsSpectating] = useState(false);

  const fetchDuel = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('duels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Duel not found');

      setDuel(data as Duel);

      const { data: challengerData, error: challengerError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', data.challenger_id)
        .single();

      if (challengerError) console.error('Error fetching challenger:', challengerError);
      else setChallenger(challengerData as Profile);

      if (data.opponent_id) {
        const { data: opponentData, error: opponentError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', data.opponent_id)
          .single();

        if (opponentError) console.error('Error fetching opponent:', opponentError);
        else setOpponent(opponentData as Profile);
      }

      if (data.winner_id) {
        const { data: winnerData, error: winnerError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', data.winner_id)
          .single();

        if (winnerError) console.error('Error fetching winner:', winnerError);
        else setWinner(winnerData as Profile);
      }

      const { count, error: spectatorError } = await supabase
        .from('duel_spectators')
        .select('id', { count: 'exact' })
        .eq('duel_id', id);

      if (!spectatorError && count !== null) {
        setSpectatorCount(count);
      }

      if (user) {
        const { data: spectatorData, error: userSpectatorError } = await supabase
          .from('duel_spectators')
          .select('id')
          .eq('duel_id', id)
          .eq('user_id', user.id);

        if (!userSpectatorError && spectatorData && spectatorData.length > 0) {
          setIsSpectating(true);
        }
      }

    } catch (err) {
      console.error('Error fetching duel details:', err);
      setError('Failed to load duel details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpectate = async () => {
    if (!user || !duel || isSpectating) return;

    try {
      await supabase
        .from('duel_spectators')
        .insert({
          duel_id: duel.id,
          user_id: user.id
        });

      setIsSpectating(true);
      setSpectatorCount(prev => prev + 1);
    } catch (err) {
      console.error('Error adding spectator:', err);
    }
  };

  useEffect(() => {
    fetchDuel();
  }, [id, user]);

  const isChallenger = user && duel?.challenger_id === user.id;
  const isOpponent = user && duel?.opponent_id === user.id;
  
  const formatDate = (dateString: string | null) => {
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

  const getTypeIcon = (type: 'intellectual' | 'strategic' | 'physical') => {
    switch(type) {
      case 'intellectual':
        return <Brain className="h-5 w-5 mr-2 text-blue-200" />;
      case 'strategic':
        return <Sword className="h-5 w-5 mr-2 text-purple-200" />;
      case 'physical':
        return <FireExtinguisher className="h-5 w-5 mr-2 text-red-200" />;
      default:
        return <Sword className="h-5 w-5 mr-2 text-duel-gold" />;
    }
  };

  const getTypeClass = (type: 'intellectual' | 'strategic' | 'physical') => {
    return {
      'intellectual': 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/60',
      'strategic': 'bg-purple-900/50 text-purple-200 hover:bg-purple-800/60',
      'physical': 'bg-red-900/50 text-red-200 hover:bg-red-800/60'
    }[type] || 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60';
  };

  const getStatusClass = (status: 'pending' | 'active' | 'completed' | 'declined') => {
    return {
      'pending': 'bg-amber-900/50 text-amber-200 hover:bg-amber-800/60',
      'active': 'bg-green-900/50 text-green-200 hover:bg-green-800/60',
      'completed': 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60',
      'declined': 'bg-red-900/50 text-red-200 hover:bg-red-800/60'
    }[status] || 'bg-gray-800/50 text-gray-200 hover:bg-gray-700/60';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 container py-12">
          <p className="text-center text-muted-foreground">Loading duel details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !duel) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error Loading Duel</h1>
            <p className="text-muted-foreground mb-6">{error || 'Duel not found'}</p>
            <Button asChild>
              <Link to="/duels">Return to Duels</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-duel-gold">{duel.title}</h1>
              <ShareDuelInvite duelId={duel.id} duelTitle={duel.title} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={cn("transition-colors", getTypeClass(duel.type))}>
                <span className="flex items-center">
                  {getTypeIcon(duel.type)}
                  {duel.type}
                </span>
              </Badge>
              <Badge className={cn("transition-colors", getStatusClass(duel.status))}>
                {duel.status}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="mr-4">Created: {formatDate(duel.created_at)}</span>
              
              {duel.start_time && (
                <>
                  <Clock className="h-4 w-4 mr-1 ml-4" />
                  <span>Started: {formatDate(duel.start_time)}</span>
                </>
              )}
            </div>
            
            {duel.reason && (
              <div className="bg-accent/30 p-4 rounded-md mb-6 border border-accent/10">
                <p className="text-lg italic text-foreground/80">"{duel.reason}"</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="ritual-border col-span-1 md:col-span-2">
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-duel-gold" />
                      <h2 className="text-xl font-semibold">Participants</h2>
                    </div>
                    
                    {!isChallenger && !isOpponent && user && !isSpectating && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-duel-gold/40 text-duel-gold hover:bg-duel-gold/10"
                        onClick={handleSpectate}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        Spectate
                      </Button>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{spectatorCount} spectating</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-md ${winner?.id === challenger?.id ? 'bg-duel-gold/10 border border-duel-gold/30' : 'bg-accent/20'}`}>
                      <div className="flex items-center mb-3">
                        <Avatar className="h-10 w-10 mr-3 border border-duel-gold/40">
                          <AvatarImage src={challenger?.avatar_url || undefined} alt={challenger?.username} />
                          <AvatarFallback className="bg-duel/50 text-white">
                            {challenger?.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <Link 
                              to={`/profile/${challenger?.id}`}
                              className="font-medium text-lg hover:text-duel-gold transition-colors"
                            >
                              {challenger?.username}
                            </Link>
                            {winner?.id === challenger?.id && (
                              <Trophy className="h-5 w-5 ml-2 text-duel-gold" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">Challenger</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-md ${winner?.id === opponent?.id ? 'bg-duel-gold/10 border border-duel-gold/30' : 'bg-accent/20'}`}>
                      {opponent ? (
                        <div className="flex items-center mb-3">
                          <Avatar className="h-10 w-10 mr-3 border border-duel-gold/40">
                            <AvatarImage src={opponent?.avatar_url || undefined} alt={opponent?.username} />
                            <AvatarFallback className="bg-duel/50 text-white">
                              {opponent?.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <Link 
                                to={`/profile/${opponent?.id}`}
                                className="font-medium text-lg hover:text-duel-gold transition-colors"
                              >
                                {opponent?.username}
                              </Link>
                              {winner?.id === opponent?.id && (
                                <Trophy className="h-5 w-5 ml-2 text-duel-gold" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">Opponent</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground italic">Awaiting opponent</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {duel.status === 'active' && duel.opponent_id && opponent && (
                    <div className="mt-6 pt-6 border-t border-duel-gold/10">
                      <DuelVoting
                        duelId={duel.id}
                        challengerId={duel.challenger_id}
                        opponentId={duel.opponent_id}
                        challengerName={challenger?.username || 'Challenger'}
                        opponentName={opponent?.username || 'Opponent'}
                        isParticipant={isChallenger || isOpponent}
                      />
                    </div>
                  )}
                  
                  {duel.stakes && (
                    <div className="mt-4 pt-4 border-t border-duel-gold/10">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <Sword className="h-5 w-5 mr-2 text-duel-gold" />
                        Stakes
                      </h3>
                      <p className="text-foreground/80">{duel.stakes}</p>
                    </div>
                  )}
                  
                  {(isChallenger || isOpponent) && (
                    <DuelActions 
                      duelId={duel.id}
                      duelStatus={duel.status}
                      isChallenger={isChallenger}
                      isOpponent={isOpponent}
                      opponentId={duel.opponent_id}
                      onStatusUpdate={fetchDuel}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="ritual-border">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Duel Status</h2>
                <DuelTimer 
                  duration={duel.duration} 
                  status={duel.status}
                  startTime={duel.start_time}
                  onComplete={() => {
                    if (duel.status === 'active') {
                      fetchDuel();
                    }
                  }}
                />
                
                <div className="mt-6 pt-6 border-t border-duel-gold/10">
                  <h3 className="text-lg font-semibold mb-3">Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Challenge issued:</span>
                      <span>{formatDate(duel.created_at)}</span>
                    </div>
                    
                    {duel.status !== 'pending' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {duel.status === 'declined' ? 'Challenge declined:' : 'Duel started:'}
                        </span>
                        <span>{formatDate(duel.start_time)}</span>
                      </div>
                    )}
                    
                    {duel.status === 'completed' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duel completed:</span>
                        <span>{formatDate(duel.end_time)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="ritual-border mb-8">
            <CardContent className="pt-6">
              <DuelComments duelId={duel.id} />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DuelDetailPage;
