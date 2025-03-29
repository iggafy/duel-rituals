
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface DuelBreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const DuelBreadcrumb = ({ items }: DuelBreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      <Link 
        to="/" 
        className="flex items-center hover:text-duel-gold transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-duel-gold transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DuelBreadcrumb;
