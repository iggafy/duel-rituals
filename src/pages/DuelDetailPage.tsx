
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import DuelTimer from '@/components/DuelTimer';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { getDuel, getUser } from '@/data/mockData';
import { toast } from '@/components/ui/use-toast';
import { Sword, Trophy, Clock, Users, Heart, MessageSquare } from 'lucide-react';

const DuelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const duel = id ? getDuel(id) : undefined;
  
  const [userVote, setUserVote] = useState<'challenger' | 'opponent' | null>(null);
  const [challengerVotes, setChallengerVotes] = useState(duel?.votes?.challengerVotes || 0);
  const [opponentVotes, setOpponentVotes] = useState(duel?.votes?.opponentVotes || 0);
  const [duelStatus, setDuelStatus] = useState(duel?.status || 'pending');
  const [isSpectating, setIsSpectating] = useState(false);
  
  const challenger = duel?.challengerId ? getUser(duel.challengerId) : undefined;
  const opponent = duel?.opponentId ? getUser(duel.opponentId) : undefined;
  
  const totalVotes = challengerVotes + opponentVotes;
  const challengerVotePercentage = totalVotes > 0 ? (challengerVotes / totalVotes) * 100 : 0;
  
  useEffect(() => {
    if (duel) {
      setChallengerVotes(duel.votes?.challengerVotes || 0);
      setOpponentVotes(duel.votes?.opponentVotes || 0);
      setDuelStatus(duel.status);
    }
  }, [duel]);

  if (!duel) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Duel Not Found</h1>
            <p className="text-muted-foreground mb-6">The duel you are looking for does not exist.</p>
            <Button asChild>
              <Link to="/duels">View All Duels</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleVote = (vote: 'challenger' | 'opponent') => {
    if (duelStatus !== 'active') {
      toast({
        title: "Voting not available",
        description: duelStatus === 'pending' 
          ? "This duel has not started yet."
          : "This duel has already concluded.",
        variant: "destructive"
      });
      return;
    }
    
    if (userVote === vote) {
      toast({
        title: "Already voted",
        description: "You have already cast your vote for this participant.",
        variant: "destructive"
      });
      return;
    }
    
    // If changing vote, subtract from previous choice
    if (userVote) {
      if (userVote === 'challenger') {
        setChallengerVotes(prev => prev - 1);
      } else {
        setOpponentVotes(prev => prev - 1);
      }
    }
    
    // Add vote to chosen participant
    if (vote === 'challenger') {
      setChallengerVotes(prev => prev + 1);
    } else {
      setOpponentVotes(prev => prev + 1);
    }
    
    setUserVote(vote);
    
    toast({
      title: "Vote cast",
      description: `You have voted for ${vote === 'challenger' ? duel.challenger : duel.opponent}.`,
    });
  };
  
  const handleSpectate = () => {
    setIsSpectating(!isSpectating);
    
    if (!isSpectating) {
      toast({
        title: "Now spectating",
        description: "You are now spectating this duel. You'll receive notifications of significant events.",
      });
    } else {
      toast({
        title: "Stopped spectating",
        description: "You are no longer spectating this duel.",
      });
    }
  };
  
  const handleTimerComplete = () => {
    if (duelStatus === 'active') {
      setDuelStatus('completed');
      
      // Determine winner
      const winner = challengerVotes > opponentVotes ? duel.challenger : duel.opponent;
      
      toast({
        title: "Duel Concluded",
        description: `The duel has ended. ${winner} has emerged victorious!`,
      });
    }
  };
  
  // Get type color for badge
  const duelTypeColors = {
    intellectual: 'bg-blue-900/50 text-blue-200',
    strategic: 'bg-purple-900/50 text-purple-200',
    physical: 'bg-red-900/50 text-red-200'
  };

  // Get status color for badge
  const statusColors = {
    pending: 'bg-amber-900/50 text-amber-200',
    active: 'bg-green-900/50 text-green-200',
    completed: 'bg-gray-800/50 text-gray-200'
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-6">
            <Link to="/duels" className="text-duel-gold hover:underline">
              &larr; Back to Duels
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Duel Info Column */}
            <div className="lg:col-span-2">
              <Card className="ritual-border">
                <CardHeader>
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
                    <div>
                      <CardTitle className="text-2xl text-duel-gold mb-1">{duel.title}</CardTitle>
                      <CardDescription>Created on {duel.createdAt}</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={duelTypeColors[duel.type]}>{duel.type}</Badge>
                      <Badge className={statusColors[duelStatus]}>{duelStatus}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Reason for Duel</h3>
                    <p className="text-muted-foreground">{duel.reason}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Stakes</h3>
                    <p className="text-muted-foreground">{duel.stakes}</p>
                  </div>
                  
                  <Separator />
                  
                  <DuelTimer 
                    duration={duel.duration} 
                    status={duelStatus as 'pending' | 'active' | 'completed'} 
                    onComplete={handleTimerComplete}
                  />
                  
                  <div className="pt-2">
                    <h3 className="font-semibold mb-4">Arguments</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-secondary rounded-md">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2 border border-duel-gold/40">
                            <AvatarImage src={duel.challengerAvatar} alt={duel.challenger} />
                            <AvatarFallback className="bg-duel/50 text-white">
                              {duel.challenger.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{duel.challenger}'s Position</span>
                        </div>
                        <p className="text-foreground/90">
                          {duel.arguments?.challenger || "This participant has not stated their argument yet."}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-secondary rounded-md">
                        <div className="flex items-center mb-2">
                          <Avatar className="h-8 w-8 mr-2 border border-duel-gold/40">
                            <AvatarImage src={duel.opponentAvatar} alt={duel.opponent || "Opponent"} />
                            <AvatarFallback className="bg-duel/50 text-white">
                              {duel.opponent ? duel.opponent.charAt(0) : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {duel.opponent 
                              ? `${duel.opponent}'s Position` 
                              : "Awaiting Opponent"}
                          </span>
                        </div>
                        <p className="text-foreground/90">
                          {duel.arguments?.opponent || "This participant has not stated their argument yet."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {duelStatus === 'completed' && duel.winner && (
                    <div className="py-4">
                      <h3 className="font-semibold mb-3">Outcome</h3>
                      <div className="p-4 bg-duel/20 border border-duel-gold/30 rounded-md">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-duel-gold mr-2" />
                          <span className="font-medium text-duel-gold">
                            {duel.winner} has emerged victorious in this duel.
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground">
                          The community has determined the outcome through their votes. This result is now recorded in both participants' histories.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Participants and Voting Column */}
            <div>
              <div className="space-y-6">
                {/* Participants */}
                <Card className="ritual-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Duelists</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Challenger</h4>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border border-duel-gold/40">
                          <AvatarImage src={duel.challengerAvatar} alt={duel.challenger} />
                          <AvatarFallback className="bg-duel/50 text-white">
                            {duel.challenger.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link 
                            to={`/profile/${duel.challengerId}`} 
                            className="font-semibold hover:text-duel-gold hover:underline"
                          >
                            {duel.challenger}
                          </Link>
                          {challenger && 
                            <div className="text-xs text-muted-foreground">
                              Reputation: {challenger.reputation}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Opponent</h4>
                      {duel.opponent ? (
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 border border-duel-gold/40">
                            <AvatarImage src={duel.opponentAvatar} alt={duel.opponent} />
                            <AvatarFallback className="bg-duel/50 text-white">
                              {duel.opponent.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link 
                              to={`/profile/${duel.opponentId}`} 
                              className="font-semibold hover:text-duel-gold hover:underline"
                            >
                              {duel.opponent}
                            </Link>
                            {opponent && 
                              <div className="text-xs text-muted-foreground">
                                Reputation: {opponent.reputation}
                              </div>
                            }
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-muted rounded-md text-center">
                          <span className="text-muted-foreground">Awaiting challenger response...</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Voting */}
                <Card className="ritual-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Cast Your Vote</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{duel.challenger}</span>
                          <span>{challengerVotes} votes</span>
                        </div>
                        <Progress value={challengerVotePercentage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{duel.opponent || "Opponent"}</span>
                          <span>{opponentVotes} votes</span>
                        </div>
                        <Progress value={100 - challengerVotePercentage} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant={userVote === 'challenger' ? 'default' : 'outline'}
                        className={userVote === 'challenger' ? 'bg-duel text-white' : 'border-duel/50 text-foreground'}
                        onClick={() => handleVote('challenger')}
                        disabled={duelStatus !== 'active'}
                        size="sm"
                      >
                        Vote for {duel.challenger}
                      </Button>
                      <Button 
                        variant={userVote === 'opponent' ? 'default' : 'outline'}
                        className={userVote === 'opponent' ? 'bg-duel text-white' : 'border-duel/50 text-foreground'}
                        onClick={() => handleVote('opponent')}
                        disabled={duelStatus !== 'active' || !duel.opponent}
                        size="sm"
                      >
                        Vote for {duel.opponent || "Opponent"}
                      </Button>
                    </div>
                    
                    {duelStatus !== 'active' && (
                      <p className="text-xs text-muted-foreground text-center">
                        {duelStatus === 'pending' 
                          ? "Voting will be available once the duel begins."
                          : "Voting has concluded for this duel."}
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Spectator Actions */}
                <Card className="ritual-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Spectator Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{duel.spectatorCount} spectators</span>
                        </span>
                        <Button 
                          variant={isSpectating ? "default" : "outline"}
                          className={isSpectating 
                            ? "bg-duel text-white h-8" 
                            : "border-duel/50 text-foreground h-8"}
                          size="sm"
                          onClick={handleSpectate}
                        >
                          {isSpectating ? "Spectating" : "Spectate"}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="h-9 border-muted-foreground/30"
                          size="sm"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-xs">Support</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="h-9 border-muted-foreground/30"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span className="text-xs">Comment</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DuelDetailPage;
