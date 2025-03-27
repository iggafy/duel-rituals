
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sword, Trophy, User, Clock } from 'lucide-react';

const NavigationBar = () => {
  return (
    <nav className="border-b border-duel-gold/20 bg-duel-dark">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <Sword className="text-duel-gold h-6 w-6" />
          <span className="text-2xl font-semibold text-duel-gold">DuelOn</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-duel-gold transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/duels" 
            className="text-foreground/80 hover:text-duel-gold transition-colors duration-200"
          >
            Active Duels
          </Link>
          <Link 
            to="/leaderboard" 
            className="text-foreground/80 hover:text-duel-gold transition-colors duration-200"
          >
            Leaderboard
          </Link>
          <Link 
            to="/profile" 
            className="text-foreground/80 hover:text-duel-gold transition-colors duration-200"
          >
            My Profile
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10"
            asChild
          >
            <Link to="/create-duel">Initiate Duel</Link>
          </Button>
          <Button 
            className="bg-duel hover:bg-duel-light text-white"
            asChild
          >
            <Link to="/profile">
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
