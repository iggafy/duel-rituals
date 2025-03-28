
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface DuelTimerProps {
  duration: number; // in seconds
  status: 'pending' | 'active' | 'completed';
  onComplete?: () => void;
}

const DuelTimer: React.FC<DuelTimerProps> = ({ duration, status, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(status === 'active');
  
  useEffect(() => {
    setIsRunning(status === 'active');
    if (status === 'active') {
      setTimeLeft(duration);
    }
  }, [status, duration]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            onComplete && onComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, onComplete]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getStatusText = (): string => {
    switch (status) {
      case 'pending':
        return 'Waiting for duel to begin';
      case 'active':
        return 'Duel in progress';
      case 'completed':
        return 'Duel has concluded';
      default:
        return '';
    }
  };
  
  const getStatusColor = (): string => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'active':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return '';
    }
  };
  
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
          <h3 className="text-sm font-medium">Duration</h3>
        </div>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>
      
      <Card className={`p-4 flex justify-center items-center ${status === 'completed' ? 'bg-muted' : ''}`}>
        <div className={`font-mono text-3xl ${status === 'active' ? 'text-duel-gold' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      </Card>
    </div>
  );
};

export default DuelTimer;
