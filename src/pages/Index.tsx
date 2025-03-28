
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sword, Trophy, Shield, Users } from 'lucide-react';
import DuelCard from '@/components/DuelCard';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { getActiveAndUpcomingDuels } from '@/data/mockData';

const Index = () => {
  const activeDuels = getActiveAndUpcomingDuels().slice(0, 3);

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
                    Initiate a Duel
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
        
        {/* Active Duels Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Active Duels</h2>
              <Button variant="link" className="text-duel-gold" asChild>
                <Link to="/duels">View All Duels</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  duration={duel.duration}
                  winner={duel.winner}
                />
              ))}
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
