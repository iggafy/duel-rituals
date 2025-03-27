
import React from 'react';
import { Link } from 'react-router-dom';
import { Sword } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-duel-gold/20 bg-duel-dark py-8 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Sword className="text-duel-gold h-6 w-6 mr-2" />
            <span className="text-xl font-semibold text-duel-gold">DuelOn</span>
          </div>
          
          <div className="flex space-x-8 mb-4 md:mb-0">
            <Link to="/about" className="text-foreground/70 hover:text-duel-gold transition-colors">
              About
            </Link>
            <Link to="/terms" className="text-foreground/70 hover:text-duel-gold transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-foreground/70 hover:text-duel-gold transition-colors">
              Privacy
            </Link>
            <Link to="/help" className="text-foreground/70 hover:text-duel-gold transition-colors">
              Help
            </Link>
          </div>
          
          <div className="text-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} DuelOn. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
