
-- Create the duel_comments table for storing user comments on duels
CREATE TABLE IF NOT EXISTS duel_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id UUID NOT NULL REFERENCES duels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE duel_comments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to view all comments
CREATE POLICY "Anyone can view comments" 
  ON duel_comments 
  FOR SELECT 
  USING (true);

-- Create policy to allow users to create their own comments
CREATE POLICY "Users can create their own comments" 
  ON duel_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own comments
CREATE POLICY "Users can update their own comments" 
  ON duel_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" 
  ON duel_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add an index for faster comment retrieval
CREATE INDEX duel_comments_duel_id_idx ON duel_comments(duel_id);
CREATE INDEX duel_comments_user_id_idx ON duel_comments(user_id);
