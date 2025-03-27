
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DuelTimerProps {
  duration: number; // in seconds
  status: 'pending' | 'active' | 'completed';
  onComplete?: () => void;
}

const DuelTimer: React.FC<DuelTimerProps> = ({ 
  duration, 
  status,
  onComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(status === 'active');
  
  useEffect(() => {
    setIsRunning(status === 'active');
    
    if (status === 'active') {
      setTimeLeft(duration);
    }
  }, [status, duration]);
  
  useEffect(() => {
    let timer: number;
    
    if (isRunning && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, timeLeft, onComplete]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressValue = ((duration - timeLeft) / duration) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Duel Timer</span>
        <div className="flex items-center space-x-2">
          {status === 'pending' && (
            <Badge variant="outline" className="bg-amber-900/30 text-amber-200 border-amber-500/50">
              Awaiting Start
            </Badge>
          )}
          {status === 'active' && (
            <Badge variant="outline" className="bg-green-900/30 text-green-200 border-green-500/50 animate-pulse-subtle">
              In Progress
            </Badge>
          )}
          {status === 'completed' && (
            <Badge variant="outline" className="bg-gray-800/30 text-gray-200 border-gray-500/50">
              Completed
            </Badge>
          )}
          <span className="font-mono text-lg">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <Progress 
        value={progressValue} 
        className="h-2 bg-secondary"
        indicatorClassName={
          status === 'completed' 
            ? "bg-muted-foreground" 
            : timeLeft < 30 
              ? "bg-duel-red" 
              : "bg-duel"
        }
      />
    </div>
  );
};

export default DuelTimer;
