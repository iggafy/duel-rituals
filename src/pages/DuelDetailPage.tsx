import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelTimer from '@/components/DuelTimer';
import DuelActions from '@/components/DuelActions';
import DuelComments from '@/components/DuelComments';
import DuelVoting from '@/components/DuelVoting';
import ShareDuelInvite from '@/components/ShareDuelInvite';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, logSupabaseError, setupRealtimeSubscription } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Shield, 
  Sword, 
  Trophy,
  Calendar,
  Clock,
  AlertCircle,
  Users,
  Brain,
  FireExtinguisher,
  RefreshCw,
  CheckCircle
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justAccepted = searchParams.get('accepted') === 'true';
  const { user } = useAuth();
  const [duel, setDuel] = useState<Duel | null>(null);
  const [challenger, setChallenger] = useState<Profile | null>(null);
  const [opponent, setOpponent] = useState<Profile | null>(null);
  const [winner, setWinner] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spectatorCount, setSpectatorCount] = useState(0);
  const [isSpectating, setIsSpectating] = useState(false);
  const [forceReload, setForceReload] = useState(0);
  const [showAcceptanceNotice, setShowAcceptanceNotice] = useState(false);

  useEffect(() => {
    if (justAccepted) {
      setShowAcceptanceNotice(true);
      setTimeout(() => {
        navigate(`/duels/${id}`, { replace: true });
        setTimeout(() => {
          setShowAcceptanceNotice(false);
        }, 3000);
      }, 100);
    }
  }, [justAccepted, id, navigate]);

  const fetchDuel = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching duel with ID:", id);
      
      const { data, error } = await supabase
        .from('duels')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logSupabaseError(error, 'fetching duel details');
        throw error;
      }
      
      if (!data) {
        console.error("No duel found with ID:", id);
        throw new Error('Duel not found');
      }

      console.log("Fetched duel data:", data);
      setDuel(data as Duel);

      await Promise.all([
        fetchChallengerProfile(data.challenger_id),
        data.opponent_id ? fetchOpponentProfile(data.opponent_id) : Promise.resolve(),
        data.winner_id ? fetchWinnerProfile(data.winner_id) : Promise.resolve(),
        fetchSpectatorCount(data.id),
        user ? checkUserIsSpectating(data.id, user.id) : Promise.resolve()
      ]);

    } catch (err: any) {
      console.error('Error fetching duel details:', err);
      setError(err.message || 'Failed to load duel details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchChallengerProfile = async (challengerId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', challengerId)
      .single();

    if (error) {
      console.error('Error fetching challenger:', error);
      logSupabaseError(error, 'fetching challenger profile');
    } else {
      console.log("Fetched challenger data:", data);
      setChallenger(data as Profile);
    }
  };

  const fetchOpponentProfile = async (opponentId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', opponentId)
      .single();

    if (error) {
      console.error('Error fetching opponent:', error);
      logSupabaseError(error, 'fetching opponent profile');
    } else {
      console.log("Fetched opponent data:", data);
      setOpponent(data as Profile);
    }
  };

  const fetchWinnerProfile = async (winnerId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', winnerId)
      .single();

    if (error) {
      console.error('Error fetching winner:', error);
      logSupabaseError(error, 'fetching winner profile');
    } else {
      console.log("Fetched winner data:", data);
      setWinner(data as Profile);
    }
  };

  const fetchSpectatorCount = async (duelId: string) => {
    const { count, error } = await supabase
      .from('duel_spectators')
      .select('id', { count: 'exact' })
      .eq('duel_id', duelId);

    if (!error && count !== null) {
      setSpectatorCount(count);
    }
  };

  const checkUserIsSpectating = async (duelId: string, userId: string) => {
    const { data, error } = await supabase
      .from('duel_spectators')
      .select('id')
      .eq('duel_id', duelId)
      .eq('user_id', userId);

    if (!error && data && data.length > 0) {
      setIsSpectating(true);
    } else {
      setIsSpectating(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setForceReload(prev => prev + 1);
  };

  const handleStatusUpdate = () => {
    console.log("Status update triggered, refreshing duel data");
    setForceReload(prev => prev + 1);
  };

  const handleSpectate = async () => {
    if (!user || !duel || isSpectating) return;

    try {
      const { error } = await supabase
        .from('duel_spectators')
        .insert({
          duel_id: duel.id,
          user_id: user.id
        });
        
      if (error) throw error;

      setIsSpectating(true);
      setSpectatorCount(prev => prev + 1);
      
      toast({
        title: "Now Spectating",
        description: "You are now spectating this duel.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error adding spectator:', err);
      toast({
        title: "Error",
        description: "Could not add you as a spectator. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDuel();
    
    if (id) {
      console.log(`Setting up realtime subscription for duel ${id}`);
      
      const duelCleanup = setupRealtimeSubscription('duels', () => {
        console.log('Duel updated, refreshing data');
        fetchDuel();
      });
      
      const commentsCleanup = setupRealtimeSubscription('duel_comments', () => {
        console.log('Duel comments updated');
      });
      
      const votesCleanup = setupRealtimeSubscription('duel_votes', () => {
        console.log('Duel votes updated');
      });
      
      const spectatorsCleanup = setupRealtimeSubscription('duel_spectators', () => {
        console.log('Duel spectators updated');
        if (id) {
          fetchSpectatorCount(id);
        }
      });
      
      return () => {
        duelCleanup();
        commentsCleanup();
        votesCleanup();
        spectatorsCleanup();
      };
    }
  }, [id, user, forceReload]);

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
        {showAcceptanceNotice && (
          <div className="bg-green-950/50 border border-green-500/50 p-4 rounded-md mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-200">Duel accepted! The battle has begun. Good luck, duelist!</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-duel-gold">{duel.title}</h1>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-duel-gold/40 text-duel-gold hover:bg-duel-gold/10"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <ShareDuelInvite duelId={duel.id} duelTitle={duel.title} />
              </div>
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
                      onStatusUpdate={handleStatusUpdate}
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
