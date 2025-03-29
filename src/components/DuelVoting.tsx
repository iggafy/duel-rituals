
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ThumbsUp } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
}

interface DuelVotingProps {
  duelId: string;
  challengerId: string;
  opponentId: string | null;
  challengerName: string;
  opponentName?: string;
  isParticipant: boolean;
}

const DuelVoting: React.FC<DuelVotingProps> = ({
  duelId,
  challengerId,
  opponentId,
  challengerName,
  opponentName,
  isParticipant
}) => {
  const { user } = useAuth();
  const [challengerVotes, setChallengerVotes] = useState(0);
  const [opponentVotes, setOpponentVotes] = useState(0);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  const fetchVotes = async () => {
    try {
      setIsLoading(true);

      // Fetch vote counts
      const { data: voteData, error: voteError } = await supabase
        .from('duel_votes')
        .select('vote_for_id')
        .eq('duel_id', duelId);

      if (voteError) throw voteError;

      // Count votes for each participant
      const challengerCount = voteData.filter(v => v.vote_for_id === challengerId).length;
      const opponentCount = voteData.filter(v => v.vote_for_id === opponentId).length;
      
      setChallengerVotes(challengerCount);
      setOpponentVotes(opponentCount);

      // Check if the current user has voted
      if (user) {
        const { data: userVoteData, error: userVoteError } = await supabase
          .from('duel_votes')
          .select('vote_for_id')
          .eq('duel_id', duelId)
          .eq('voter_id', user.id)
          .maybeSingle();

        if (!userVoteError && userVoteData) {
          setUserVote(userVoteData.vote_for_id);
        }
      }
    } catch (err) {
      console.error('Error fetching votes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteForId: string) => {
    if (!user || isParticipant) return;
    
    try {
      setIsVoting(true);

      // If the user has already voted for this person, remove the vote
      if (userVote === voteForId) {
        // Remove vote
        const { error: deleteError } = await supabase
          .from('duel_votes')
          .delete()
          .eq('duel_id', duelId)
          .eq('voter_id', user.id);

        if (deleteError) throw deleteError;

        setUserVote(null);
        
        // Update vote counts
        if (voteForId === challengerId) {
          setChallengerVotes(prev => Math.max(0, prev - 1));
        } else {
          setOpponentVotes(prev => Math.max(0, prev - 1));
        }
        
        toast({
          title: "Vote Removed",
          description: "Your vote has been removed.",
        });
      } 
      // If voting for a different participant, update the vote
      else {
        // If already voted for the other person, remove that vote first
        if (userVote) {
          const { error: deleteError } = await supabase
            .from('duel_votes')
            .delete()
            .eq('duel_id', duelId)
            .eq('voter_id', user.id);

          if (deleteError) throw deleteError;
          
          // Decrement count for the person they un-voted for
          if (userVote === challengerId) {
            setChallengerVotes(prev => Math.max(0, prev - 1));
          } else {
            setOpponentVotes(prev => Math.max(0, prev - 1));
          }
        }

        // Cast new vote
        const { error: insertError } = await supabase
          .from('duel_votes')
          .insert({
            duel_id: duelId,
            voter_id: user.id,
            vote_for_id: voteForId
          });

        if (insertError) throw insertError;

        setUserVote(voteForId);
        
        // Update vote counts
        if (voteForId === challengerId) {
          setChallengerVotes(prev => prev + 1);
        } else {
          setOpponentVotes(prev => prev + 1);
        }
        
        toast({
          title: "Vote Cast",
          description: `You've voted for ${voteForId === challengerId ? challengerName : opponentName}.`,
        });
      }
    } catch (err) {
      console.error('Error casting vote:', err);
      toast({
        title: "Error",
        description: "There was a problem processing your vote.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (duelId && (challengerId || opponentId)) {
      fetchVotes();
    }
  }, [duelId, challengerId, opponentId, user]);

  if (!opponentId || !opponentName) {
    return null; // Don't show voting until both participants are available
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Audience Support</h3>
      
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading votes...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <div className="mb-1">
              <span className="text-2xl font-bold">{challengerVotes}</span>
              <span className="text-xs ml-1 text-muted-foreground">votes</span>
            </div>
            <Button
              variant={userVote === challengerId ? "default" : "outline"}
              size="sm"
              className={userVote === challengerId ? "bg-duel hover:bg-duel-light" : ""}
              onClick={() => handleVote(challengerId)}
              disabled={isVoting || isParticipant || !user}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {challengerName}
            </Button>
          </div>
          
          <div className="text-center space-y-2">
            <div className="mb-1">
              <span className="text-2xl font-bold">{opponentVotes}</span>
              <span className="text-xs ml-1 text-muted-foreground">votes</span>
            </div>
            <Button
              variant={userVote === opponentId ? "default" : "outline"}
              size="sm"
              className={userVote === opponentId ? "bg-duel hover:bg-duel-light" : ""}
              onClick={() => handleVote(opponentId)}
              disabled={isVoting || isParticipant || !user}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {opponentName}
            </Button>
          </div>
        </div>
      )}
      
      {!user && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Sign in to vote for your favorite contestant
        </p>
      )}
      
      {isParticipant && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Participants cannot vote in their own duel
        </p>
      )}
    </div>
  );
};

export default DuelVoting;
