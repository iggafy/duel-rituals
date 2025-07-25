
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareToProfileProps {
  duelId: string;
  duelTitle: string;
}

const ShareToProfile = ({ duelId, duelTitle }: ShareToProfileProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleShareToProfile = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to share duels to your profile",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      // Create a featured_duels table entry instead of using bio
      const { error } = await supabase
        .from('featured_duels')
        .upsert({ 
          user_id: user.id,
          duel_id: duelId,
          duel_title: duelTitle,
          featured_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Duel Shared!",
        description: "This duel has been featured on your profile",
        variant: "default",
        className: "bg-duel/90 text-white border-duel",
      });
    } catch (err) {
      console.error("Error sharing to profile:", err);
      toast({
        title: "Share Failed",
        description: "Could not share this duel to your profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="border-duel-gold/40 text-duel-gold hover:bg-duel-gold/10"
      onClick={handleShareToProfile}
    >
      <BadgeCheck className="h-4 w-4 mr-2" />
      Feature on Profile
    </Button>
  );
};

export default ShareToProfile;
