
import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import LeaderboardTable from '@/components/LeaderboardTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Search } from 'lucide-react';
import { getLeaderboard } from '@/data/mockData';
import { LeaderboardUser } from '@/components/LeaderboardTable';

const LeaderboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get the leaderboard data - this already includes rank information
  const leaderboardUsers = getLeaderboard() as LeaderboardUser[];
  
  // Filter users based on search term
  const filteredUsers = leaderboardUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.title && user.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-duel-gold mr-2" />
              <span className="text-duel-gold font-medium">Top Duelists</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="ritual-border">
                <CardHeader>
                  <CardTitle className="text-lg">Search Duelists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name, title, specialty..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {searchTerm && (
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="ghost" 
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => setSearchTerm('')}
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="ritual-border">
                <CardHeader>
                  <CardTitle className="text-lg">Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Debate')}
                    >
                      Debate
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Logic')}
                    >
                      Logic
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Philosophy')}
                    >
                      Philosophy
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Strategy')}
                    >
                      Strategy
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Chess')}
                    >
                      Chess
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Literature')}
                    >
                      Literature
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('History')}
                    >
                      History
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-duel/20 transition-colors"
                      onClick={() => setSearchTerm('Science')}
                    >
                      Science
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ritual-border">
                <CardHeader>
                  <CardTitle className="text-lg">Leaderboard Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Rankings are determined by reputation points earned through honorable duels. 
                    Victory in high-stakes duels yields greater reputation benefits.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-start">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>1st place is the ultimate champion</span>
                    </li>
                    <li className="flex items-start">
                      <Trophy className="h-4 w-4 text-gray-300 mr-2 mt-0.5" />
                      <span>2nd place shows exceptional prowess</span>
                    </li>
                    <li className="flex items-start">
                      <Trophy className="h-4 w-4 text-amber-700 mr-2 mt-0.5" />
                      <span>3rd place demonstrates remarkable skill</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Leaderboard */}
            <div className="lg:col-span-3">
              <Card className="ritual-border">
                <CardHeader className="pb-3">
                  <CardTitle>Top Duelists</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredUsers.length > 0 ? (
                    <LeaderboardTable users={filteredUsers} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No duelists match your search criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
