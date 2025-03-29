
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Sword, Shield, User } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import DuelCard from '@/components/DuelCard';
import FeaturedDuels from '@/components/FeaturedDuels';
import { getUser, getUserDuels } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database.types';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, profile: currentUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // First try to get profile from Supabase, then fall back to mock data
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['profile', id || currentUser?.id],
    queryFn: async () => {
      const userId = id || currentUser?.id;
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // Fall back to mock data
        return id ? getUser(id) : getUser("user1");
      }
      
      return data as Profile;
    },
    enabled: !!id || !!currentUser?.id
  });

  // Fall back to mock data if no profile is found
  const user = userProfile || (id ? getUser(id) : getUser("user1"));
  const userDuels = user ? getUserDuels(user.id) : [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Loading Profile...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">The profile you are looking for does not exist.</p>
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get the first letters of the name for the avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Calculate reputation level
  const getReputationLevel = (rep: number) => {
    if (!rep) return 'Novice';
    if (rep >= 1000) return 'Legendary';
    if (rep >= 750) return 'Honored';
    if (rep >= 500) return 'Respected';
    if (rep >= 250) return 'Recognized';
    if (rep >= 100) return 'Known';
    return 'Novice';
  };
  
  const activeDuels = userDuels.filter(duel => duel.status === 'active' || duel.status === 'pending');
  const completedDuels = userDuels.filter(duel => duel.status === 'completed');
  const winCount = userProfile?.duels_won || completedDuels.filter(duel => 
    duel.winner === user.name
  ).length;
  
  const isCurrentUserProfile = currentUser && (id === currentUser.id || (!id && currentUserProfile));
  const displayUserId = userProfile?.id || id || currentUser?.id || "user1";
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="ritual-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 border-2 border-duel-gold/40 mb-4">
                      <AvatarImage src={userProfile?.avatar_url || user.avatar} alt={userProfile?.username || user.name} />
                      <AvatarFallback className="bg-duel text-white text-xl">
                        {getInitials(userProfile?.username || user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{userProfile?.username || user.name}</h1>
                    {user.title && <p className="text-duel-gold">{user.title}</p>}
                    <div className="flex items-center mt-2">
                      <Trophy className="h-4 w-4 text-duel-gold mr-1" />
                      <span className="text-sm font-medium">
                        {getReputationLevel(userProfile?.reputation || user.reputation)} • {userProfile?.reputation || user.reputation} Rep
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    <div className="bg-secondary p-2 rounded-md">
                      <div className="text-sm text-muted-foreground">Duels</div>
                      <div className="font-bold">
                        {userProfile ? 
                          ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0)) : 
                          (user.wins + user.losses)}
                      </div>
                    </div>
                    <div className="bg-secondary p-2 rounded-md">
                      <div className="text-sm text-muted-foreground">Wins</div>
                      <div className="font-bold text-green-400">
                        {userProfile?.duels_won || user.wins}
                      </div>
                    </div>
                    <div className="bg-secondary p-2 rounded-md">
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="font-bold">
                        {userProfile ? 
                          ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0) > 0 
                            ? Math.round(((userProfile.duels_won || 0) / ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0))) * 100) 
                            : 0) : 
                          (user.wins + user.losses > 0 
                            ? Math.round((user.wins / (user.wins + user.losses)) * 100) 
                            : 0)}%
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties?.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-duel/30 text-foreground">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Notable Achievements</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Trophy className="h-4 w-4 text-duel-gold mr-2 mt-0.5" />
                          <span>Won {userProfile?.duels_won || winCount} duels</span>
                        </li>
                        <li className="flex items-start">
                          <Shield className="h-4 w-4 text-duel-gold mr-2 mt-0.5" />
                          <span>Maintained a {userProfile ? 
                            ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0) > 0 
                              ? Math.round(((userProfile.duels_won || 0) / ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0))) * 100) 
                              : 0) : 
                            (user.wins + user.losses > 0 
                              ? Math.round((user.wins / (user.wins + user.losses)) * 100) 
                              : 0)}% win rate</span>
                        </li>
                        <li className="flex items-start">
                          <Sword className="h-4 w-4 text-duel-gold mr-2 mt-0.5" />
                          <span>Participated in {userProfile ? 
                            ((userProfile.duels_won || 0) + (userProfile.duels_lost || 0)) : 
                            (user.wins + user.losses)} duels</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-center">
                    <Button 
                      className="w-full bg-duel hover:bg-duel-light text-white"
                      onClick={() => {
                        if (isCurrentUserProfile) {
                          // Edit profile functionality would go here
                          alert('Edit profile functionality coming soon');
                        } else {
                          navigate('/create-duel', { 
                            state: { opponentId: displayUserId } 
                          });
                        }
                      }}
                    >
                      {isCurrentUserProfile ? (
                        <>
                          <User className="mr-2 h-4 w-4" />
                          Edit Profile
                        </>
                      ) : (
                        <>
                          <Sword className="mr-2 h-4 w-4" />
                          Challenge to Duel
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="duels">Duels</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-8">
                    <Card className="ritual-border">
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{userProfile?.bio || user.bio || "This duelist has not provided a biography."}</p>
                      </CardContent>
                    </Card>
                    
                    {/* Featured Duels Section */}
                    <FeaturedDuels userId={displayUserId} />
                    
                    <Card className="ritual-border">
                      <CardHeader>
                        <CardTitle>Recent Duels</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {userDuels.length > 0 ? (
                          <div className="space-y-4">
                            {userDuels.slice(0, 3).map(duel => (
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
                                winner={duel.winner}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            This duelist has not participated in any duels yet.
                          </div>
                        )}
                        
                        {userDuels.length > 3 && (
                          <div className="mt-4 text-center">
                            <Button 
                              variant="link" 
                              className="text-duel-gold"
                              onClick={() => setActiveTab('duels')}
                            >
                              View All Duels
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="duels">
                  <Card className="ritual-border">
                    <CardHeader>
                      <CardTitle>Active & Upcoming Duels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeDuels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeDuels.map(duel => (
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
                              winner={duel.winner}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No active or upcoming duels.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="ritual-border mt-8">
                    <CardHeader>
                      <CardTitle>Completed Duels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {completedDuels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {completedDuels.map(duel => (
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
                              winner={duel.winner}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No completed duels.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card className="ritual-border">
                    <CardHeader>
                      <CardTitle>Duel History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userDuels.length > 0 ? (
                        <div className="space-y-4">
                          {userDuels.map(duel => (
                            <Card key={duel.id} className="border-border">
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                  <div>
                                    <Link 
                                      to={`/duels/${duel.id}`}
                                      className="font-semibold hover:text-duel-gold hover:underline"
                                    >
                                      {duel.title}
                                    </Link>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {duel.startTime || duel.createdAt}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge className={
                                        duel.type === 'intellectual' 
                                          ? 'bg-blue-900/50 text-blue-200' 
                                          : duel.type === 'strategic' 
                                            ? 'bg-purple-900/50 text-purple-200' 
                                            : 'bg-red-900/50 text-red-200'
                                      }>
                                        {duel.type}
                                      </Badge>
                                      <Badge className={
                                        duel.status === 'active' 
                                          ? 'bg-green-900/50 text-green-200' 
                                          : duel.status === 'pending' 
                                            ? 'bg-amber-900/50 text-amber-200' 
                                            : 'bg-gray-800/50 text-gray-200'
                                      }>
                                        {duel.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Challenger:</span> {duel.challenger}
                                    </div>
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Opponent:</span> {duel.opponent || "None"}
                                    </div>
                                    {duel.status === 'completed' && (
                                      <div className="text-sm mt-2">
                                        <span className="text-muted-foreground">Winner:</span>{' '}
                                        <span className="text-duel-gold font-medium">{duel.winner || "Undecided"}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No duel history available.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
