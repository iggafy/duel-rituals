
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useAuthGuard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      
      // Save the current location so we can redirect back after login
      navigate('/auth', { 
        state: { from: location.pathname }
      });
    }
  }, [user, isLoading, navigate, location]);

  return { isAuthenticated: !!user, isLoading };
};
