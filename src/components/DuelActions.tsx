
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Sword, X, Crown } from 'lucide-react';

interface DuelActionsProps {
  duelId: string;
  duelStatus: 'pending' | 'active' | 'completed' | 'declined';
  isChallenger: boolean;
  isOpponent: boolean;
  opponentId: string | null;
  onStatusUpdate: () => void;
}

const DuelActions: React.FC<DuelActionsProps> = ({ 
  duelId, 
  duelStatus, 
  isChallenger, 
  isOpponent,
  opponentId,
  onStatusUpdate
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleAcceptChallenge = async () => {
    if (!isOpponent || duelStatus !== 'pending') return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('duels')
        .update({ 
          status: 'active',
          start_time: new Date().toISOString()
        })
        .eq('id', duelId);

      if (error) throw error;
      
      toast({
        title: "Challenge Accepted!",
        description: "The duel has begun. May the best contestant win!",
      });
      
      onStatusUpdate();
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast({
        title: "Error",
        description: "Failed to accept the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineChallenge = async () => {
    if (!isOpponent || duelStatus !== 'pending') return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('duels')
        .update({ status: 'declined' })
        .eq('id', duelId);

      if (error) throw error;
      
      toast({
        title: "Challenge Declined",
        description: "You have declined this duel challenge.",
      });
      
      onStatusUpdate();
    } catch (error) {
      console.error('Error declining challenge:', error);
      toast({
        title: "Error",
        description: "Failed to decline the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteDuel = async (winnerId: string) => {
    if (duelStatus !== 'active' || (!isChallenger && !isOpponent)) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('duels')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString(),
          winner_id: winnerId
        })
        .eq('id', duelId);

      if (error) throw error;
      
      const winnerIsUser = winnerId === user.id;
      
      toast({
        title: "Duel Completed",
        description: winnerIsUser 
          ? "Congratulations on your victory!" 
          : "The duel has been completed. Honor in defeat.",
      });
      
      onStatusUpdate();
    } catch (error) {
      console.error('Error completing duel:', error);
      toast({
        title: "Error",
        description: "Failed to complete the duel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelChallenge = async () => {
    if (!isChallenger || duelStatus !== 'pending') return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('duels')
        .delete()
        .eq('id', duelId);

      if (error) throw error;
      
      toast({
        title: "Challenge Cancelled",
        description: "You have cancelled this duel challenge.",
      });
      
      navigate('/duels');
    } catch (error) {
      console.error('Error cancelling challenge:', error);
      toast({
        title: "Error",
        description: "Failed to cancel the challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renders action buttons based on duel status and user role
  const renderActions = () => {
    // For pending duels
    if (duelStatus === 'pending') {
      if (isOpponent) {
        return (
          <div className="flex gap-4">
            <Button 
              className="flex-1 bg-duel hover:bg-duel-light" 
              onClick={handleAcceptChallenge}
              disabled={isSubmitting}
            >
              <Sword className="mr-2 h-5 w-5" />
              Accept Challenge
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-5 w-5" />
                  Decline
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Decline Challenge</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to decline this duel challenge? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={handleDeclineChallenge}
                  >
                    Decline Challenge
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      }
      
      if (isChallenger) {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                disabled={isSubmitting}
              >
                <X className="mr-2 h-5 w-5" />
                Cancel Challenge
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Challenge</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this duel challenge? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleCancelChallenge}
                >
                  Cancel Challenge
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      }
    }
    
    // For active duels
    if (duelStatus === 'active' && (isChallenger || isOpponent)) {
      const currentOpponentId = isChallenger ? opponentId : null;
      const userId = user.id;
      
      return (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">Declare the outcome of this duel:</p>
          
          <div className="flex gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="flex-1 bg-duel-gold hover:bg-duel-gold/80 text-black"
                  disabled={isSubmitting}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  I Won
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Declare Victory</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you declaring yourself the winner of this duel? This should be agreed upon by both participants.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-duel-gold hover:bg-duel-gold/80 text-black"
                    onClick={() => handleCompleteDuel(userId)}
                  >
                    Declare Victory
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Opponent Won
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Concede Defeat</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you conceding defeat in this duel? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleCompleteDuel(currentOpponentId || '')}
                  >
                    Concede Defeat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="mt-6 border-t border-duel-gold/20 pt-6">
      {renderActions()}
    </div>
  );
};

export default DuelActions;
