import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelCard from '@/components/DuelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase, logSupabaseError, setupRealtimeSubscription } from '@/integrations/supabase/client';
import { Search, LogIn, AlertCircle } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface DuelData {
  id: string;
  title: string;
  reason: string;
  stakes: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  type: 'intellectual' | 'strategic' | 'physical';
  duration: number;
  challenger_id: string;
  challenger: {
    username: string;
    avatar_url: string | null;
  };
  opponent_id: string | null;
  opponent: {
    username: string;
    avatar_url: string | null;
  } | null;
  winner_id: string | null;
  start_time: string | null;
  created_at: string;
  spectator_count: number;
}

const DuelsPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthGuard();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDuels, setActiveDuels] = useState<DuelData[]>([]);
  const [completedDuels, setCompletedDuels] = useState<DuelData[]>([]);
  const [myDuels, setMyDuels] = useState<DuelData[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const filteredActiveDuels = activeDuels.filter(duel => 
    duel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.challenger?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (duel.opponent?.username && duel.opponent.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    duel.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompletedDuels = completedDuels.filter(duel => 
    duel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.challenger?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (duel.opponent?.username && duel.opponent.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    duel.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMyDuels = myDuels.filter(duel => 
    duel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.challenger?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (duel.opponent?.username && duel.opponent.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    duel.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDuels = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch active duels (not including my duels)
      const { data: activeData, error: activeError } = await supabase
        .from('duels')
        .select(`
          id,
          title,
          reason, 
          stakes,
          status,
          type,
          duration,
          challenger_id,
          challenger:profiles!duels_challenger_id_fkey(username, avatar_url),
          opponent_id,
          opponent:profiles!duels_opponent_id_fkey(username, avatar_url),
          winner_id,
          start_time,
          created_at
        `)
        .in('status', ['active', 'pending'])
        .not('challenger_id', 'eq', user.id)
        .not('opponent_id', 'eq', user.id);
      
      if (activeError) {
        logSupabaseError(activeError, 'fetching active duels');
        throw activeError;
      }
      
      // Add spectator count to each duel
      const activeDuelsWithSpectators = await Promise.all((activeData || []).map(async (duel) => {
        const { count } = await supabase
          .from('duel_spectators')
          .select('*', { count: 'exact', head: true })
          .eq('duel_id', duel.id);
          
        return {
          ...duel,
          spectator_count: count || 0
        };
      }));
      
      setActiveDuels(activeDuelsWithSpectators as DuelData[]);
      
      // Fetch completed duels (not including my duels)
      const { data: completedData, error: completedError } = await supabase
        .from('duels')
        .select(`
          id,
          title,
          reason, 
          stakes,
          status,
          type,
          duration,
          challenger_id,
          challenger:profiles!duels_challenger_id_fkey(username, avatar_url),
          opponent_id,
          opponent:profiles!duels_opponent_id_fkey(username, avatar_url),
          winner_id,
          start_time,
          created_at
        `)
        .in('status', ['completed', 'declined'])
        .not('challenger_id', 'eq', user.id)
        .not('opponent_id', 'eq', user.id)
        .order('created_at', { ascending: false })
        .limit(9);
      
      if (completedError) {
        logSupabaseError(completedError, 'fetching completed duels');
        throw completedError;
      }
      
      const completedDuelsWithSpectators = await Promise.all((completedData || []).map(async (duel) => {
        const { count } = await supabase
          .from('duel_spectators')
          .select('*', { count: 'exact', head: true })
          .eq('duel_id', duel.id);
          
        return {
          ...duel,
          spectator_count: count || 0
        };
      }));
      
      setCompletedDuels(completedDuelsWithSpectators as DuelData[]);
      
      // Fetch my duels (including those I created or was invited to)
      const { data: myDuelsData, error: myDuelsError } = await supabase
        .from('duels')
        .select(`
          id,
          title,
          reason, 
          stakes,
          status,
          type,
          duration,
          challenger_id,
          challenger:profiles!duels_challenger_id_fkey(username, avatar_url),
          opponent_id,
          opponent:profiles!duels_opponent_id_fkey(username, avatar_url),
          winner_id,
          start_time,
          created_at
        `)
        .or(`challenger_id.eq.${user.id},opponent_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (myDuelsError) {
        logSupabaseError(myDuelsError, 'fetching my duels');
        throw myDuelsError;
      }
      
      const myDuelsWithSpectators = await Promise.all((myDuelsData || []).map(async (duel) => {
        const { count } = await supabase
          .from('duel_spectators')
          .select('*', { count: 'exact', head: true })
          .eq('duel_id', duel.id);
          
        return {
          ...duel,
          spectator_count: count || 0
        };
      }));
      
      setMyDuels(myDuelsWithSpectators as DuelData[]);
      
    } catch (err: any) {
      console.error('Error fetching duels:', err);
      setError(err.message || 'Failed to load duels');
      toast({
        title: "Error Loading Duels",
        description: "There was a problem loading the duels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDuels();
      
      // Use our new helper function for realtime subscriptions
      const duelsCleanup = setupRealtimeSubscription('duels', fetchDuels);
      const spectatorsCleanup = setupRealtimeSubscription('duel_spectators', fetchDuels);
        
      return () => {
        duelsCleanup();
        spectatorsCleanup();
      };
    }
  }, [isAuthenticated, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-t-duel-gold border-duel-dark rounded-full mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 py-8">
          <div className="container max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-lg p-8 border border-duel-gold/20 shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-duel-gold">Authentication Required</h1>
              <div className="mx-auto w-20 h-20 bg-duel/20 rounded-full flex items-center justify-center mb-6">
                <LogIn className="h-10 w-10 text-duel-gold" />
              </div>
              <p className="text-lg mb-6">
                You must be signed in to view and participate in duels.
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground mb-4">
                  Sign in to challenge opponents, spectate active duels, and build your reputation in the arena.
                </p>
                <Button asChild className="w-full bg-duel hover:bg-duel-light">
                  <Link to="/auth">Sign In or Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Duels</h1>
            <Button asChild className="bg-duel hover:bg-duel-light">
              <Link to="/create-duel">Create New Duel</Link>
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-950/50 border border-red-500/50 p-4 rounded-md mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-200">{error}</p>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={fetchDuels}>
                Retry
              </Button>
            </div>
          )}
          
          <Collapsible open={isInfoOpen} onOpenChange={setIsInfoOpen} className="mb-6">
            <div className="bg-card/40 border border-duel-gold/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-duel-gold">Getting Started</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isInfoOpen ? 'Hide' : 'Show'} Tips
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Search for duels using the search bar below</li>
                  <li>Click on a duel card to see details and participate</li>
                  <li>Use the filter badges to quickly find duels by type or status</li>
                  <li>Switch between tabs to see active/upcoming or completed duels</li>
                  <li>Check "My Duels" to see all duels you're participating in</li>
                </ul>
              </CollapsibleContent>
            </div>
          </Collapsible>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search duels by title, participants, or reason..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge 
              className="bg-blue-900/50 text-blue-200 cursor-pointer"
              onClick={() => setSearchTerm(searchTerm ? searchTerm + ' intellectual' : 'intellectual')}
            >
              Intellectual
            </Badge>
            <Badge 
              className="bg-purple-900/50 text-purple-200 cursor-pointer"
              onClick={() => setSearchTerm(searchTerm ? searchTerm + ' strategic' : 'strategic')}
            >
              Strategic
            </Badge>
            <Badge 
              className="bg-red-900/50 text-red-200 cursor-pointer"
              onClick={() => setSearchTerm(searchTerm ? searchTerm + ' physical' : 'physical')}
            >
              Physical
            </Badge>
            <Badge 
              className="bg-green-900/50 text-green-200 cursor-pointer"
              onClick={() => setSearchTerm(searchTerm ? searchTerm + ' active' : 'active')}
            >
              Active
            </Badge>
            <Badge 
              className="bg-amber-900/50 text-amber-200 cursor-pointer"
              onClick={() => setSearchTerm(searchTerm ? searchTerm + ' pending' : 'pending')}
            >
              Pending
            </Badge>
            {searchTerm && (
              <Badge 
                className="bg-destructive/80 text-destructive-foreground cursor-pointer"
                onClick={() => setSearchTerm('')}
              >
                Clear Filters
              </Badge>
            )}
          </div>
          
          <Tabs defaultValue="my-duels" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="my-duels">My Duels</TabsTrigger>
              <TabsTrigger value="active">Active & Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-duels">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-t-duel-gold border-duel-dark rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your duels...</p>
                </div>
              ) : filteredMyDuels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMyDuels.map(duel => (
                    <DuelCard 
                      key={duel.id}
                      id={duel.id}
                      title={duel.title}
                      challenger={{ 
                        name: duel.challenger?.username || 'Unknown challenger', 
                        avatar: duel.challenger?.avatar_url || undefined 
                      }}
                      challengerId={duel.challenger_id}
                      opponent={duel.opponent ? { 
                        name: duel.opponent?.username || 'Unknown opponent', 
                        avatar: duel.opponent?.avatar_url || undefined 
                      } : undefined}
                      opponentId={duel.opponent_id}
                      reason={duel.reason}
                      type={duel.type}
                      status={duel.status}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectator_count}
                      startTime={duel.start_time}
                      createdAt={duel.created_at}
                      duration={duel.duration}
                      winner={duel.winner_id}
                      highlight={duel.status === 'pending' && duel.opponent_id === user.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-6">You haven't participated in any duels yet.</p>
                  <Button asChild className="bg-duel hover:bg-duel-light">
                    <Link to="/create-duel">Create Your First Duel</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-t-duel-gold border-duel-dark rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading active duels...</p>
                </div>
              ) : filteredActiveDuels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActiveDuels.map(duel => (
                    <DuelCard 
                      key={duel.id}
                      id={duel.id}
                      title={duel.title}
                      challenger={{ 
                        name: duel.challenger?.username || 'Unknown challenger', 
                        avatar: duel.challenger?.avatar_url || undefined 
                      }}
                      challengerId={duel.challenger_id}
                      opponent={duel.opponent ? { 
                        name: duel.opponent?.username || 'Unknown opponent', 
                        avatar: duel.opponent?.avatar_url || undefined 
                      } : undefined}
                      opponentId={duel.opponent_id}
                      reason={duel.reason}
                      type={duel.type}
                      status={duel.status}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectator_count}
                      startTime={duel.start_time}
                      createdAt={duel.created_at}
                      duration={duel.duration}
                      winner={duel.winner_id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No active or upcoming duels match your search criteria.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-t-duel-gold border-duel-dark rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading completed duels...</p>
                </div>
              ) : filteredCompletedDuels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompletedDuels.map(duel => (
                    <DuelCard 
                      key={duel.id}
                      id={duel.id}
                      title={duel.title}
                      challenger={{ 
                        name: duel.challenger?.username || 'Unknown challenger', 
                        avatar: duel.challenger?.avatar_url || undefined 
                      }}
                      challengerId={duel.challenger_id}
                      opponent={duel.opponent ? { 
                        name: duel.opponent?.username || 'Unknown opponent', 
                        avatar: duel.opponent?.avatar_url || undefined 
                      } : undefined}
                      opponentId={duel.opponent_id}
                      reason={duel.reason}
                      type={duel.type}
                      status={duel.status}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectator_count}
                      startTime={duel.start_time}
                      createdAt={duel.created_at}
                      duration={duel.duration}
                      winner={duel.winner_id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No completed duels match your search criteria.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DuelsPage;
