
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelCard from '@/components/DuelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getActiveAndUpcomingDuels, getCompletedDuels } from '@/data/mockData';
import { Search, LogIn } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const DuelsPage = () => {
  const { isAuthenticated, isLoading } = useAuthGuard();
  const [searchTerm, setSearchTerm] = useState('');
  const activeDuels = getActiveAndUpcomingDuels();
  const completedDuels = getCompletedDuels();
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  
  // Filter duels based on search term
  const filteredActiveDuels = activeDuels.filter(duel => 
    duel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.challenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (duel.opponent && duel.opponent.toLowerCase().includes(searchTerm.toLowerCase())) ||
    duel.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCompletedDuels = completedDuels.filter(duel => 
    duel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duel.challenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (duel.opponent && duel.opponent.toLowerCase().includes(searchTerm.toLowerCase())) ||
    duel.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If loading, show a loading state
  if (isLoading) {
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
  
  // If not authenticated, show auth required message
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
  
  // Main content for authenticated users
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
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active & Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {filteredActiveDuels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActiveDuels.map(duel => (
                    <DuelCard 
                      key={duel.id}
                      id={duel.id}
                      title={duel.title}
                      challenger={{ 
                        name: duel.challenger, 
                        avatar: duel.challengerAvatar 
                      }}
                      challengerId={duel.challengerId}
                      opponent={duel.opponent ? { 
                        name: duel.opponent, 
                        avatar: duel.opponentAvatar 
                      } : undefined}
                      opponentId={duel.opponentId}
                      reason={duel.reason}
                      type={duel.type as "intellectual" | "strategic" | "physical"}
                      status={duel.status as "active" | "pending" | "completed" | "declined"}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectatorCount}
                      startTime={duel.startTime}
                      createdAt={duel.createdAt}
                      duration={duel.duration}
                      winner={duel.winner}
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
              {filteredCompletedDuels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompletedDuels.map(duel => (
                    <DuelCard 
                      key={duel.id}
                      id={duel.id}
                      title={duel.title}
                      challenger={{ 
                        name: duel.challenger, 
                        avatar: duel.challengerAvatar 
                      }}
                      challengerId={duel.challengerId}
                      opponent={duel.opponent ? { 
                        name: duel.opponent, 
                        avatar: duel.opponentAvatar 
                      } : undefined}
                      opponentId={duel.opponentId}
                      reason={duel.reason}
                      type={duel.type as "intellectual" | "strategic" | "physical"}
                      status={duel.status as "active" | "pending" | "completed" | "declined"}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectatorCount}
                      startTime={duel.startTime}
                      createdAt={duel.createdAt}
                      duration={duel.duration}
                      winner={duel.winner}
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
