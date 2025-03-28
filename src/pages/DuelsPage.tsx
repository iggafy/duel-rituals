
import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelCard from '@/components/DuelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getActiveAndUpcomingDuels, getCompletedDuels } from '@/data/mockData';
import { Search } from 'lucide-react';

const DuelsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const activeDuels = getActiveAndUpcomingDuels();
  const completedDuels = getCompletedDuels();
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Duels</h1>
          
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
                      challenger={duel.challenger}
                      challengerAvatar={duel.challengerAvatar}
                      opponent={duel.opponent}
                      opponentAvatar={duel.opponentAvatar}
                      reason={duel.reason}
                      type={duel.type}
                      status={duel.status}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectatorCount}
                      startTime={duel.startTime}
                      createdAt={duel.createdAt}
                      duration={duel.duration}
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
                      challenger={duel.challenger}
                      challengerAvatar={duel.challengerAvatar}
                      opponent={duel.opponent}
                      opponentAvatar={duel.opponentAvatar}
                      reason={duel.reason}
                      type={duel.type}
                      status={duel.status}
                      stakes={duel.stakes}
                      spectatorCount={duel.spectatorCount}
                      startTime={duel.startTime}
                      createdAt={duel.createdAt}
                      duration={duel.duration}
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
