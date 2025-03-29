import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DuelVotingProps {
  duelId: string;
  challengerId: string;
  opponentId: string;
  challengerName: string;
  opponentName: string;
  isParticipant: boolean;
}

const DuelVoting = ({
  duelId,
  challengerId,
  opponentId,
  challengerName,
  opponentName,
  isParticipant
}: DuelVotingProps) => {
  const { user } = useAuth();
  const [votes, setVotes] = useState<{ [key: string]: number }>({
    [challengerId]: 0,
    [opponentId]: 0
  });
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);

  const totalVotes = votes[challengerId] + votes[opponentId];
  const challengerPercentage = totalVotes > 0 
    ? Math.round((votes[challengerId] / totalVotes) * 100) 
    : 50;
  const opponentPercentage = 100 - challengerPercentage;

  const fetchVotes = async () => {
    try {
      setIsLoadingVotes(true);
      
      // Get all votes for this duel
      const { data: votesData, error: votesError } = await supabase
        .from('duel_votes')
        .select('vote_for_id')
        .eq('duel_id', duelId);
      
      if (votesError) throw votesError;
      
      // Count votes
      const voteCounts = {
        [challengerId]: 0,
        [opponentId]: 0
      };
      
      votesData.forEach(vote => {
        if (vote.vote_for_id === challengerId || vote.vote_for_id === opponentId) {
          voteCounts[vote.vote_for_id]++;
        }
      });
      
      setVotes(voteCounts);
      
      // Check if user has voted
      if (user) {
        const { data: userVoteData, error: userVoteError } = await supabase
          .from('duel_votes')
          .select('vote_for_id')
          .eq('duel_id', duelId)
          .eq('voter_id', user.id)
          .maybeSingle();
        
        if (userVoteError) throw userVoteError;
        
        if (userVoteData) {
          setUserVote(userVoteData.vote_for_id);
        }
      }
    } catch (err) {
      console.error('Error fetching votes:', err);
    } finally {
      setIsLoadingVotes(false);
    }
  };

  const handleVote = async (voteForId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to vote.",
        variant: "duel",
      });
      return;
    }
    
    if (isParticipant) {
      toast({
        title: "Cannot vote",
        description: "You cannot vote in your own duel.",
        variant: "info",
      });
      return;
    }
    
    if (userVote === voteForId) {
      toast({
        title: "Already voted",
        description: "You have already voted for this duelist.",
        variant: "info",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // If user already voted, update their vote
      if (userVote) {
        const { error } = await supabase
          .from('duel_votes')
          .update({ vote_for_id: voteForId })
          .eq('duel_id', duelId)
          .eq('voter_id', user.id);
        
        if (error) throw error;
      } else {
        // Otherwise create a new vote
        const { error } = await supabase
          .from('duel_votes')
          .insert({
            duel_id: duelId,
            voter_id: user.id,
            vote_for_id: voteForId
          });
        
        if (error) throw error;
      }
      
      toast({
        title: "Vote recorded",
        description: "Your vote has been recorded successfully.",
        variant: "success",
      });
      
      // Update state
      setUserVote(voteForId);
      const name = voteForId === challengerId ? challengerName : opponentName;
      
      // Re-fetch votes to update counts
      fetchVotes();
      
    } catch (err) {
      console.error('Error voting:', err);
      toast({
        title: "Failed to vote",
        description: "There was an error recording your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Subscribe to real-time updates for votes
  useEffect(() => {
    fetchVotes();
    
    const channel = supabase
      .channel('duel-votes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'duel_votes',
        filter: `duel_id=eq.${duelId}`
      }, () => {
        fetchVotes();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [duelId, user]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Public Opinion</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{challengerName}</span>
            <span>{votes[challengerId]} votes</span>
          </div>
          <Progress value={challengerPercentage} className="h-2 bg-muted" />
          <Button
            variant="outline"
            size="sm"
            className={`w-full mt-1 ${userVote === challengerId ? 'border-duel-gold text-duel-gold bg-duel-gold/10' : ''}`}
            disabled={isLoading || isLoadingVotes || isParticipant || !user}
            onClick={() => handleVote(challengerId)}
          >
            {userVote === challengerId ? 'Voted' : 'Vote'}
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{opponentName}</span>
            <span>{votes[opponentId]} votes</span>
          </div>
          <Progress value={opponentPercentage} className="h-2 bg-muted" />
          <Button
            variant="outline"
            size="sm"
            className={`w-full mt-1 ${userVote === opponentId ? 'border-duel-gold text-duel-gold bg-duel-gold/10' : ''}`}
            disabled={isLoading || isLoadingVotes || isParticipant || !user}
            onClick={() => handleVote(opponentId)}
          >
            {userVote === opponentId ? 'Voted' : 'Vote'}
          </Button>
        </div>
        
        {!user && (
          <p className="text-xs text-muted-foreground text-center">
            Sign in to vote for your favorite duelist!
          </p>
        )}
        
        {isParticipant && (
          <p className="text-xs text-muted-foreground text-center">
            You cannot vote in your own duel.
          </p>
        )}
      </div>
    </div>
  );
};

export default DuelVoting;
