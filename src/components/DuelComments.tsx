
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: Profile;
}

interface DuelCommentsProps {
  duelId: string;
}

const DuelComments: React.FC<DuelCommentsProps> = ({ duelId }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch comments with profiles via join
      const { data: commentData, error: commentError } = await supabase
        .from('duel_comments')
        .select(`
          id, 
          content, 
          created_at, 
          user_id, 
          profiles:user_id (id, username, avatar_url)
        `)
        .eq('duel_id', duelId)
        .order('created_at', { ascending: false });

      if (commentError) throw commentError;

      // Format comments with user profile data
      const formattedComments = commentData.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user_id: comment.user_id,
        user: comment.profiles
      }));

      setComments(formattedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!user || !commentText.trim()) return;

    try {
      setIsSending(true);

      const { data, error: insertError } = await supabase
        .from('duel_comments')
        .insert({
          duel_id: duelId,
          user_id: user.id,
          content: commentText.trim()
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Add new comment to the list with the current user's profile
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        user_id: data.user_id,
        user: profile
      };

      setComments([newComment, ...comments]);
      setCommentText('');
      
      toast({
        title: "Comment Posted",
        description: "Your comment has been added to the duel.",
      });
    } catch (err) {
      console.error('Error posting comment:', err);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [duelId]);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      return 'recently';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-duel-gold" />
        <h2 className="text-xl font-semibold">Discussion</h2>
      </div>

      {/* Comment form for authenticated users */}
      {user ? (
        <div className="space-y-3">
          <Textarea
            placeholder="Add your comment to the duel..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePostComment}
              disabled={!commentText.trim() || isSending}
              className="bg-duel hover:bg-duel-light"
            >
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-accent/20 p-4 rounded-md text-center">
          <p className="text-muted-foreground">Sign in to join the discussion</p>
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4 pt-4 border-t border-duel-gold/10">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading comments...</p>
        ) : error ? (
          <div className="text-center text-red-400 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-accent/20 rounded-md">
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-3 border border-duel-gold/40">
                  <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.username} />
                  <AvatarFallback className="bg-duel/50 text-white">
                    {comment.user?.username.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <Link
                      to={`/profile/${comment.user_id}`}
                      className="font-medium hover:text-duel-gold transition-colors"
                    >
                      {comment.user?.username || 'Unknown User'}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-foreground/80">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DuelComments;
