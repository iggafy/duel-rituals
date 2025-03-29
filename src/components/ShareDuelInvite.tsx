
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Link, Copy, Check, Twitter, Facebook, Mail } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ShareDuelInviteProps {
  duelId: string;
  duelTitle: string;
}

const ShareDuelInvite = ({ duelId, duelTitle }: ShareDuelInviteProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/duels/${duelId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Duel invitation link has been copied to clipboard.",
        variant: "default",
        className: "bg-duel-gold/90 text-white border-duel-gold",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Copy failed",
        description: "Could not copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareViaNetwork = async (network: string) => {
    let shareLink = '';
    const encodedTitle = encodeURIComponent(`Join my duel: ${duelTitle}`);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    switch (network) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`Check out this duel: ${shareUrl}`)}`;
        break;
      default:
        shareLink = '';
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
      toast({
        title: `Shared via ${network}!`,
        description: "Duel invitation has been shared.",
        variant: "default",
        className: "bg-duel/90 text-white border-duel",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-duel-gold/40 text-duel-gold hover:bg-duel-gold/10"
        >
          <Link className="h-4 w-4 mr-2" />
          Share Duel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Share Duel Invitation</h3>
          <p className="text-sm text-muted-foreground">
            Share this link to invite others to view or participate in this duel.
          </p>
          
          <div className="flex space-x-2">
            <Input 
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={copyToClipboard} 
              variant="outline"
              className={copied ? "text-green-500 border-green-500/30" : ""}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareViaNetwork('twitter')}
              className="flex items-center text-[#1DA1F2]"
            >
              <Twitter className="h-4 w-4 mr-1" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareViaNetwork('facebook')}
              className="flex items-center text-[#4267B2]"
            >
              <Facebook className="h-4 w-4 mr-1" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareViaNetwork('email')}
              className="flex items-center"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareDuelInvite;
