
-- Create the duel_votes table for storing audience votes
CREATE TABLE IF NOT EXISTS duel_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id UUID NOT NULL REFERENCES duels(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_for_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(duel_id, voter_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE duel_votes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to view all votes
CREATE POLICY "Anyone can view votes" 
  ON duel_votes 
  FOR SELECT 
  USING (true);

-- Create policy to allow users to cast their own votes
CREATE POLICY "Users can cast their own votes" 
  ON duel_votes 
  FOR INSERT 
  WITH CHECK (auth.uid() = voter_id);

-- Create policy to allow users to update their own votes
CREATE POLICY "Users can update their own votes" 
  ON duel_votes 
  FOR UPDATE 
  USING (auth.uid() = voter_id);

-- Create policy to allow users to delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON duel_votes 
  FOR DELETE 
  USING (auth.uid() = voter_id);

-- Add indexes for faster vote retrieval
CREATE INDEX duel_votes_duel_id_idx ON duel_votes(duel_id);
CREATE INDEX duel_votes_voter_id_idx ON duel_votes(voter_id);
CREATE INDEX duel_votes_vote_for_id_idx ON duel_votes(vote_for_id);
