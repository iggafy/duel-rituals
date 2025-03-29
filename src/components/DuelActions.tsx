
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Check, 
  X, 
  Flag,
  AlertTriangle,
  Share,
  Trophy
} from 'lucide-react';
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
import ShareDuelInvite from './ShareDuelInvite';

interface DuelActionsProps {
  duelId: string;
  duelStatus: 'pending' | 'active' | 'completed' | 'declined';
  isChallenger: boolean;
  isOpponent: boolean;
  opponentId: string | null;
  onStatusUpdate: () => void;
}

const DuelActions = ({
  duelId,
  duelStatus,
  isChallenger,
  isOpponent,
  opponentId,
  onStatusUpdate
}: DuelActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptDuel = async () => {
    if (!isOpponent || duelStatus !== 'pending') return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('duels')
        .update({
          status: 'active',
          start_time: now
        })
        .eq('id', duelId);
      
      if (error) throw error;
      
      toast({
        title: "Duel Accepted!",
        description: "The duel has begun. May the best duelist win!",
        variant: "success",
      });
      
      onStatusUpdate();
    } catch (err) {
      console.error('Error accepting duel:', err);
      toast({
        title: "Failed to accept duel",
        description: "There was an error accepting the duel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeclineDuel = async () => {
    if (!isOpponent || duelStatus !== 'pending') return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('duels')
        .update({
          status: 'declined',
          start_time: now // Using start_time to record when it was declined
        })
        .eq('id', duelId);
      
      if (error) throw error;
      
      toast({
        title: "Duel Declined",
        description: "You have declined the duel challenge.",
        variant: "info",
      });
      
      onStatusUpdate();
    } catch (err) {
      console.error('Error declining duel:', err);
      toast({
        title: "Failed to decline duel",
        description: "There was an error declining the duel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompleteDuel = async (winnerId: string) => {
    if (duelStatus !== 'active') return;
    if (!isChallenger && !isOpponent) return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('duels')
        .update({
          status: 'completed',
          end_time: now,
          winner_id: winnerId
        })
        .eq('id', duelId);
      
      if (error) throw error;
      
      toast({
        title: "Duel Completed!",
        description: "The duel has been marked as completed.",
        variant: "success",
      });
      
      onStatusUpdate();
    } catch (err) {
      console.error('Error completing duel:', err);
      toast({
        title: "Failed to complete duel",
        description: "There was an error completing the duel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (duelStatus === 'pending' && isOpponent) {
    return (
      <div className="flex justify-between mt-6 pt-6 border-t border-duel-gold/10">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Duel Challenge
        </h3>
        
        <div className="space-x-3">
          <Button 
            variant="outline" 
            className="border-red-500/30 text-red-500 hover:bg-red-900/10 hover:text-red-400"
            disabled={isLoading}
            onClick={handleDeclineDuel}
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
          
          <Button 
            className="bg-green-700 hover:bg-green-600 text-white"
            disabled={isLoading}
            onClick={handleAcceptDuel}
          >
            <Check className="mr-2 h-4 w-4" />
            Accept Challenge
          </Button>
        </div>
      </div>
    );
  }
  
  if (duelStatus === 'active' && (isChallenger || isOpponent)) {
    // Determine opposing duelist ID
    const opposingDuelistId = isChallenger ? opponentId : null; // If not challenger, then user is opponent
    const currentUserId = isChallenger ? null : opponentId; // If challenger, then current user is challenger
    
    return (
      <div className="mt-6 pt-6 border-t border-duel-gold/10">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Flag className="h-5 w-5 mr-2 text-duel-gold" />
            Declare Outcome
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {/* Declare opponent as winner */}
            {opposingDuelistId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-duel-gold/30 text-duel-gold hover:bg-duel-gold/10"
                    disabled={isLoading}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Declare Opponent Victor
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Concede Defeat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to declare your opponent as the winner of this duel. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCompleteDuel(opposingDuelistId)}
                      className="bg-duel hover:bg-duel-light"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            {/* Declare self as winner */}
            {currentUserId && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="border-green-700/30 text-green-500 hover:bg-green-900/10"
                    disabled={isLoading}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Claim Victory
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Claim Victory?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to declare yourself as the winner of this duel. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCompleteDuel(currentUserId)}
                      className="bg-green-700 hover:bg-green-600"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default DuelActions;
