
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface DuelTimerProps {
  duration: number; // duration in minutes
  status: 'pending' | 'active' | 'completed' | 'declined';
  startTime?: string | null;
  onComplete?: () => void;
}

const DuelTimer: React.FC<DuelTimerProps> = ({ 
  duration, 
  status, 
  startTime = null,
  onComplete 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(duration * 60); // Convert to seconds
  const [progress, setProgress] = useState<number>(100);
  
  useEffect(() => {
    // Only run timer for active duels
    if (status !== 'active') return;
    
    const totalDuration = duration * 60; // Convert to seconds
    let startedAt: Date;
    
    // If startTime is provided, calculate remaining time based on that
    if (startTime) {
      startedAt = new Date(startTime);
      const elapsedSeconds = Math.floor((Date.now() - startedAt.getTime()) / 1000);
      const remaining = Math.max(0, totalDuration - elapsedSeconds);
      
      setTimeRemaining(remaining);
      setProgress(Math.max(0, Math.floor((remaining / totalDuration) * 100)));
      
      // If already completed based on time, call onComplete
      if (remaining <= 0 && onComplete) {
        onComplete();
        return;
      }
    }
    
    // Update timer every second
    const intervalId = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        setProgress(Math.max(0, Math.floor((newTime / totalDuration) * 100)));
        
        // If timer reaches 0, call onComplete callback
        if (newTime === 0 && onComplete) {
          onComplete();
          clearInterval(intervalId);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [duration, status, startTime, onComplete]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderStatus = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center justify-center p-6">
            <Badge variant="outline" className="text-amber-400 border-amber-400/50 py-2 px-3">
              <Clock className="mr-2 h-4 w-4" />
              Awaiting Acceptance
            </Badge>
          </div>
        );
      case 'active':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time Remaining</span>
              <span className={`font-mono text-lg ${progress < 20 ? 'text-red-400' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center justify-center p-6">
            <Badge variant="outline" className="text-green-400 border-green-400/50 py-2 px-3">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Duel Completed
            </Badge>
          </div>
        );
      case 'declined':
        return (
          <div className="flex items-center justify-center p-6">
            <Badge variant="outline" className="text-red-400 border-red-400/50 py-2 px-3">
              <XCircle className="mr-2 h-4 w-4" />
              Challenge Declined
            </Badge>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-accent/20 rounded-md p-4">
      {renderStatus()}
    </div>
  );
};

export default DuelTimer;
