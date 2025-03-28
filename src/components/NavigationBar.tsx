
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sword, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavigationBar = () => {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

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
          {user && (
            <Link 
              to="/profile" 
              className="text-foreground/80 hover:text-duel-gold transition-colors duration-200"
            >
              My Profile
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10"
                asChild
              >
                <Link to="/create-duel">Initiate Duel</Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || user.email} />
                      <AvatarFallback className="bg-duel text-white">
                        {profile?.username ? profile.username.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-duel-gold/60 text-duel-gold hover:bg-duel-gold/10"
                asChild
              >
                <Link to="/auth">Login</Link>
              </Button>
              <Button 
                className="bg-duel hover:bg-duel-light text-white"
                asChild
              >
                <Link to="/auth">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
