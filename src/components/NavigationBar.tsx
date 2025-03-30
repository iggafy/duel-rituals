
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import {
  Bell,
  Home,
  LogOut,
  Menu,
  Shield,
  Swords,
  Trophy,
  User,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useMobile } from '@/hooks/use-mobile';

const NavigationBar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingDuels, setPendingDuels] = useState<any[]>([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch pending duels where the current user is the opponent
  const fetchPendingDuels = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('duels')
        .select(`
          id, 
          title,
          challenger_id,
          profiles:challenger_id (username)
        `)
        .eq('opponent_id', user.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      setPendingDuels(data || []);
      setHasNotifications(data && data.length > 0);
    } catch (err) {
      console.error('Error fetching pending duels:', err);
    }
  };
  
  useEffect(() => {
    fetchPendingDuels();
    
    // Set up subscription for real-time updates on duels
    if (user) {
      const pendingDuelsChannel = supabase
        .channel('pending-duels')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'duels',
          filter: `opponent_id=eq.${user.id}`
        }, () => {
          fetchPendingDuels();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(pendingDuelsChannel);
      };
    }
  }, [user]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/duels', label: 'Duels', icon: <Swords className="h-4 w-4 mr-2" /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4 mr-2" /> },
  ];

  const NavItem = ({ path, label, icon, onClick }: { path: string; label: string; icon: React.ReactNode; onClick?: () => void }) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'bg-duel/90 text-white'
            : 'hover:bg-duel/20 text-foreground/70 hover:text-foreground'
        )
      }
      onClick={onClick}
    >
      {icon}
      {label}
    </NavLink>
  );

  // Render notification content
  const renderNotifications = () => {
    if (pendingDuels.length === 0) {
      return (
        <div className="py-4 text-center text-muted-foreground">
          No pending challenges
        </div>
      );
    }
    
    return (
      <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto">
        {pendingDuels.map(duel => (
          <div key={duel.id} className="p-3 hover:bg-accent/40 rounded-md">
            <div className="font-medium">{duel.title}</div>
            <div className="text-sm text-muted-foreground mb-2">
              From: {duel.profiles?.username || 'Unknown user'}
            </div>
            <Button 
              size="sm" 
              variant="default" 
              className="w-full bg-duel hover:bg-duel-light"
              onClick={() => {
                setShowNotifications(false);
                window.location.href = `/duels/${duel.id}`;
              }}
            >
              View Challenge
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center mr-6">
            <Shield className="h-8 w-8 text-duel-gold mr-2" />
            <span className="text-2xl font-bold tracking-tight">Duels</span>
          </NavLink>

          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
              {user && (
                <NavItem 
                  path="/create-duel" 
                  label="Create Duel" 
                  icon={<Swords className="h-4 w-4 mr-2" />} 
                />
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {user ? (
            <>
              {!isMobile && (
                <Popover open={showNotifications} onOpenChange={setShowNotifications}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="relative mr-2"
                    >
                      <Bell className="h-5 w-5" />
                      {hasNotifications && (
                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs bg-red-500">
                          {pendingDuels.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-2 border-b">
                      <h3 className="font-medium">Duel Challenges</h3>
                    </div>
                    {renderNotifications()}
                  </PopoverContent>
                </Popover>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0 flex justify-center">
                    <Avatar className="h-8 w-8 border border-duel-gold/40">
                      <AvatarImage
                        src={profile?.avatarUrl || undefined}
                        alt={profile?.username || "User"}
                      />
                      <AvatarFallback className="bg-duel/50 text-white">
                        {profile?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile?.username || 'User'}</p>
                      {hasNotifications && isMobile && (
                        <div className="text-red-500 text-sm flex items-center gap-1 mt-1">
                          <Bell className="h-3 w-3" />
                          <span>{pendingDuels.length} pending challenges</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                  {isMobile && hasNotifications && (
                    <DropdownMenuItem asChild>
                      <div className="cursor-pointer" onClick={() => {
                        if (pendingDuels.length === 1) {
                          window.location.href = `/duels/${pendingDuels[0].id}`;
                        } else {
                          window.location.href = '/duels';
                        }
                      }}>
                        <Bell className="h-4 w-4 mr-2 text-red-500" />
                        <span>View Challenges ({pendingDuels.length})</span>
                      </div>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer focus:text-red-500"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-duel hover:bg-duel-light">
              <NavLink to="/auth">Sign In</NavLink>
            </Button>
          )}

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="md:hidden container pb-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} {...item} onClick={closeMobileMenu} />
            ))}
            {user && (
              <NavItem 
                path="/create-duel" 
                label="Create Duel" 
                icon={<Swords className="h-4 w-4 mr-2" />} 
                onClick={closeMobileMenu}
              />
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationBar;
