
import React from 'react';
import { Link } from 'react-router-dom';
import { Sword } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-duel-gold/20 bg-duel-dark py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sword className="text-duel-gold h-5 w-5" />
              <span className="text-xl font-semibold text-duel-gold">DuelOn</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              DuelOn is the premier platform for intellectual, strategic, and skill-based duels. 
              Challenge others, build your reputation, and climb the ranks of the dueling elite.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-duel-gold">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/duels" className="text-muted-foreground hover:text-duel-gold">
                  Active Duels
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-duel-gold">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/create-duel" className="text-muted-foreground hover:text-duel-gold">
                  Create Duel
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-duel-gold">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-duel-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-duel-gold">
                  Code of Conduct
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-duel-gold">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DuelOn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
