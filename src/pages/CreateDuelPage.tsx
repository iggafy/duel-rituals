
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Sword, Info } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CreateDuelPage = () => {
  // Auth guard will redirect if not authenticated
  const { isAuthenticated, isLoading } = useAuthGuard();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [stakes, setStakes] = useState('');
  const [opponent, setOpponent] = useState('');
  const [type, setType] = useState<'intellectual' | 'strategic' | 'physical'>('intellectual');
  const [duration, setDuration] = useState(300); // 5 minutes (in seconds) by default
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const handleNext = () => {
    if (currentStep === 1) {
      if (!title || !reason) {
        toast({
          title: "Missing Information",
          description: "Please provide a title and reason for the duel.",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!stakes || !type) {
        toast({
          title: "Missing Information",
          description: "Please specify the stakes and type of duel.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate final step
    if (!opponent) {
      toast({
        title: "Missing Information",
        description: "Please specify an opponent for the duel.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Find opponent by username
      const { data: opponentData, error: opponentError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', opponent)
        .single();
        
      if (opponentError || !opponentData) {
        toast({
          title: "Opponent Not Found",
          description: "The username you entered doesn't exist.",
          variant: "destructive"
        });
        return;
      }
      
      // Create duel
      const { data, error } = await supabase
        .from('duels')
        .insert({
          title,
          reason,
          stakes,
          type,
          status: 'pending',
          duration,
          challenger_id: user?.id,
          opponent_id: opponentData.id,
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating duel:', error);
        toast({
          title: "Error",
          description: "There was an error creating the duel. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Duel Created",
        description: "Your duel invitation has been sent to the opponent.",
      });
      
      // Navigate to duels page
      navigate('/duels');
    } catch (error) {
      console.error('Error in duel creation:', error);
      toast({
        title: "Error",
        description: "There was an error creating the duel. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getFormProgress = () => {
    return (currentStep / totalSteps) * 100;
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Show loading or nothing if not authenticated
  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-duel"></div>
    </div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Initiate a Duel</h1>
            <p className="text-muted-foreground">
              Challenge an opponent to a formal duel to settle disputes, prove superiority, or establish honor.
            </p>
          </div>
          
          <Card className="ritual-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Duel Proposal</CardTitle>
                  <CardDescription>Step {currentStep} of {totalSteps}</CardDescription>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-duel/20">
                  <Sword className="h-5 w-5 text-duel-gold" />
                </div>
              </div>
              <div className="w-full bg-secondary h-1 mt-4">
                <div 
                  className="h-full bg-duel" 
                  style={{ width: `${getFormProgress()}%` }}
                ></div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title of the Duel</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. The Great Debate on Classical Literature" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for the Duel</Label>
                      <Textarea 
                        id="reason" 
                        placeholder="Explain why this duel is necessary and what you hope to establish or resolve..." 
                        rows={5}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="stakes">Stakes of the Duel</Label>
                      <Textarea 
                        id="stakes" 
                        placeholder="What does the winner gain? What must the loser concede?" 
                        rows={3}
                        value={stakes}
                        onChange={(e) => setStakes(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: "Loser must publicly acknowledge the winner's superiority in this subject."
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Type of Duel</Label>
                      <RadioGroup 
                        value={type} 
                        onValueChange={(value) => setType(value as 'intellectual' | 'strategic' | 'physical')}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className={`flex flex-col items-center border rounded-md p-4 cursor-pointer
                          ${type === 'intellectual' ? 'border-duel-gold/60 bg-duel/10' : 'border-border'}
                        `}>
                          <RadioGroupItem value="intellectual" id="intellectual" className="sr-only" />
                          <Label 
                            htmlFor="intellectual" 
                            className="cursor-pointer font-semibold text-center flex-1 flex flex-col items-center justify-center"
                          >
                            <div className="text-blue-400 mb-2">Intellectual</div>
                            <p className="text-xs text-muted-foreground font-normal">
                              Debates, arguments, and intellectual contests
                            </p>
                          </Label>
                        </div>
                        
                        <div className={`flex flex-col items-center border rounded-md p-4 cursor-pointer
                          ${type === 'strategic' ? 'border-duel-gold/60 bg-duel/10' : 'border-border'}
                        `}>
                          <RadioGroupItem value="strategic" id="strategic" className="sr-only" />
                          <Label 
                            htmlFor="strategic" 
                            className="cursor-pointer font-semibold text-center flex-1 flex flex-col items-center justify-center"
                          >
                            <div className="text-purple-400 mb-2">Strategic</div>
                            <p className="text-xs text-muted-foreground font-normal">
                              Games of strategy, puzzles, and tactical challenges
                            </p>
                          </Label>
                        </div>
                        
                        <div className={`flex flex-col items-center border rounded-md p-4 cursor-pointer
                          ${type === 'physical' ? 'border-duel-gold/60 bg-duel/10' : 'border-border'}
                        `}>
                          <RadioGroupItem value="physical" id="physical" className="sr-only" />
                          <Label 
                            htmlFor="physical" 
                            className="cursor-pointer font-semibold text-center flex-1 flex flex-col items-center justify-center"
                          >
                            <div className="text-red-400 mb-2">Physical</div>
                            <p className="text-xs text-muted-foreground font-normal">
                              Quick reaction tests and coordination challenges
                            </p>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Duel Duration</Label>
                        <span className="font-mono text-muted-foreground">
                          {formatDuration(duration)}
                        </span>
                      </div>
                      <Slider
                        min={60}
                        max={900}
                        step={30}
                        value={[duration]}
                        onValueChange={(value) => setDuration(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 minute</span>
                        <span>15 minutes</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="opponent">Opponent Username</Label>
                      <Input 
                        id="opponent" 
                        placeholder="Enter the username of your intended opponent" 
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-muted/30 border border-border rounded-md p-4">
                      <div className="flex">
                        <Info className="h-5 w-5 text-duel-gold mr-2 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium mb-1">Important Note</p>
                          <p className="text-muted-foreground">
                            By initiating this duel, you agree to follow the DuelOn code of conduct. 
                            All duels are binding, and the outcome will affect your reputation. Duels cannot be 
                            canceled once accepted by your opponent.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="font-medium">Duel Summary</Label>
                        <div className="bg-secondary rounded-md p-4 space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-muted-foreground">Title:</div>
                            <div className="col-span-2">{title}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-muted-foreground">Type:</div>
                            <div className="col-span-2 capitalize">{type}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-muted-foreground">Duration:</div>
                            <div className="col-span-2">{formatDuration(duration)}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-muted-foreground">Stakes:</div>
                            <div className="col-span-2">{stakes}</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-muted-foreground">Opponent:</div>
                            <div className="col-span-2">{opponent}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  {currentStep > 1 ? (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < totalSteps ? (
                    <Button 
                      type="button" 
                      onClick={handleNext}
                      className="bg-duel hover:bg-duel-light"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      className="bg-duel hover:bg-duel-light"
                    >
                      <Sword className="mr-2 h-4 w-4" />
                      Issue Challenge
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateDuelPage;
