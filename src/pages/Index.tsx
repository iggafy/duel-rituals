
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sword, Trophy, Shield, Users, ExternalLink, MessageCircle, Award, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [duelIdInput, setDuelIdInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse the URL for duel invitation parameters
    const searchParams = new URLSearchParams(location.search);
    const inviteDuelId = searchParams.get('duelId');
    
    if (inviteDuelId) {
      // If duel ID is in URL, redirect to duel page
      navigate(`/duels/${inviteDuelId}`);
      toast({
        title: "Duel Invitation",
        description: "You've been invited to join a duel!",
        variant: "default",
        className: "bg-duel/90 text-white border-duel",
      });
    }
  }, [location, navigate]);

  const handleJoinDuel = () => {
    if (!duelIdInput.trim()) {
      toast({
        title: "Missing Duel ID",
        description: "Please enter a valid duel invitation code",
        variant: "destructive",
      });
      return;
    }

    // First check if the duel exists
    const checkDuel = async () => {
      try {
        const { data, error } = await supabase
          .from('duels')
          .select('id')
          .eq('id', duelIdInput)
          .single();

        if (error || !data) {
          toast({
            title: "Invalid Duel",
            description: "The duel invitation code you entered doesn't exist",
            variant: "destructive",
          });
          return;
        }

        // Duel exists, navigate to it
        navigate(`/duels/${duelIdInput}`);
        toast({
          title: "Duel Found",
          description: "Joining the duel...",
          variant: "default",
          className: "bg-duel-gold/90 text-white border-duel-gold",
        });
      } catch (err) {
        console.error("Error checking duel:", err);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkDuel();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-duel-dark z-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(110, 89, 165, 0.1) 0%, rgba(26, 31, 44, 0) 60%)'
            }}
          ></div>
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-duel-gold mb-4">
                Settle Scores with Honor
              </h1>
              <p className="text-xl md:text-2xl text-foreground/90 mb-8">
                Welcome to DuelOn, where intellectual battles are fought, 
                and reputations are forged through the ritualistic art of the digital duel.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-duel hover:bg-duel-light text-white text-lg py-6 px-8"
                  asChild
                >
                  <Link to="/create-duel">
                    <Sword className="mr-2 h-5 w-5" />
                    Challenge to a Duel
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10 text-lg py-6 px-8"
                  asChild
                >
                  <Link to="/duels">
                    <Users className="mr-2 h-5 w-5" />
                    View Active Duels
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Duel Section */}
        <section className="py-12 bg-duel-dark/30">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <Card className="ritual-border overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-duel-gold flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Join a Duel by Invitation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Have you received a duel invitation? Enter the duel code below to join the battle.
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter duel invitation code"
                      value={duelIdInput}
                      onChange={(e) => setDuelIdInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleJoinDuel} className="bg-duel hover:bg-duel-light">
                      Join Duel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-duel-dark/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">The Art of Digital Dueling</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card ritual-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center mb-4">
                      <Sword className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Serious Challenges</h3>
                    <p className="text-muted-foreground">
                      Issue formal challenges with clear stakes. Every duel has purpose and meaning.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card ritual-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center mb-4">
                      <Trophy className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Build Reputation</h3>
                    <p className="text-muted-foreground">
                      Victory brings honor. Build your reputation through successful duels and strategic challenges.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card ritual-border">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center mb-4">
                      <Shield className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Honor System</h3>
                    <p className="text-muted-foreground">
                      All duels follow a strict code of conduct. Win with honor, lose with dignity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section - Replaces Active Duels */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">How It Works</h2>
              <Button variant="link" className="text-duel-gold" asChild>
                <Link to="/duels">View All Duels</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="ritual-border overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center">
                      <Sword className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold">1. Issue a Challenge</h3>
                    <p className="text-muted-foreground">
                      Begin by challenging an opponent. Define the duel's terms, including type, stakes, and reason for the confrontation.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10 mt-4 w-full"
                      asChild
                    >
                      <Link to="/create-duel">
                        Challenge Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ritual-border overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold">2. Negotiate & Accept</h3>
                    <p className="text-muted-foreground">
                      The challenged party reviews the terms and can accept, negotiate, or decline. Once accepted, the duel begins.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10 mt-4 w-full"
                      asChild
                    >
                      <Link to="/duels">
                        View Pending Duels
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="ritual-border overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-duel/20 flex items-center justify-center">
                      <Award className="h-8 w-8 text-duel-gold" />
                    </div>
                    <h3 className="text-xl font-bold">3. Resolution & Verdict</h3>
                    <p className="text-muted-foreground">
                      After the duel concludes, spectators vote on the winner. The community verdict determines the outcome.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10 mt-4 w-full"
                      asChild
                    >
                      <Link to="/leaderboard">
                        View Leaderboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-duel-dark to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Prove Your Worth?</h2>
              <p className="text-xl text-foreground/80 mb-8">
                Join DuelOn today and engage in honorable intellectual combat. 
                Issue challenges, defend your reputation, and earn the respect of your peers.
              </p>
              <Button 
                className="bg-duel hover:bg-duel-light text-white text-lg py-6 px-8"
                asChild
              >
                <Link to="/create-duel">Begin Your Journey</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
