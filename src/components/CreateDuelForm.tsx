import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sword, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const duelFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  reason: z.string().min(10, {
    message: "Reason must be at least 10 characters.",
  }).max(500, {
    message: "Reason must not exceed 500 characters.",
  }),
  stakes: z.string().min(5, {
    message: "Stakes must be at least 5 characters.",
  }).max(200, {
    message: "Stakes must not exceed 200 characters.",
  }),
  opponentUsername: z.string().min(3, {
    message: "Opponent username must be at least 3 characters.",
  }),
  type: z.enum(["intellectual", "strategic", "physical"], {
    required_error: "Please select a duel type.",
  }),
  duration: z.number().min(5, {
    message: "Duration must be at least 5 minutes.",
  }).max(180, {
    message: "Duration must not exceed 180 minutes.",
  }),
});

type DuelFormValues = z.infer<typeof duelFormSchema>;

const CreateDuelForm = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<DuelFormValues>({
    resolver: zodResolver(duelFormSchema),
    defaultValues: {
      title: "",
      reason: "",
      stakes: "",
      opponentUsername: "",
      type: "intellectual",
      duration: 30,
    },
  });

  const onSubmit = async (values: DuelFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a duel.",
        variant: "duel",
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: opponentData, error: opponentError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', values.opponentUsername)
        .single();

      if (opponentError || !opponentData) {
        setError(`Opponent not found: ${values.opponentUsername}`);
        setIsSubmitting(false);
        return;
      }

      if (opponentData.id === user.id) {
        setError("You cannot challenge yourself to a duel.");
        setIsSubmitting(false);
        return;
      }

      const { data: duel, error: duelError } = await supabase
        .from('duels')
        .insert({
          title: values.title,
          reason: values.reason,
          stakes: values.stakes,
          challenger_id: user.id,
          opponent_id: opponentData.id,
          status: 'pending',
          type: values.type,
          duration: values.duration * 60,
        })
        .select()
        .single();

      if (duelError) {
        console.error('Error creating duel:', duelError);
        setError(`Failed to create duel: ${duelError.message}`);
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Duel Challenge Sent!",
        description: `You have challenged ${values.opponentUsername} to a duel. They must accept to begin.`,
        variant: "success",
      });

      form.reset();
      
      navigate(`/duels/${duel.id}`);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duel Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a name for your duel..." {...field} />
                </FormControl>
                <FormDescription>
                  A clear, concise title that describes the duel challenge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Challenge</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="State your reasons for this challenge..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Explain why you are challenging this person and what you hope to resolve.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duel Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="intellectual">Intellectual</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The type of challenge determines the nature of the contest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={5}
                      max={180}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                    />
                  </FormControl>
                  <FormDescription>
                    How long the duel will last (5-180 minutes).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="stakes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stakes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What is at stake in this duel?"
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Clearly state what the winner will gain and what the loser will forfeit.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opponentUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opponent Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter opponent's username..." {...field} />
                </FormControl>
                <FormDescription>
                  The username of the person you wish to challenge.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-duel hover:bg-duel-light"
          disabled={isSubmitting}
        >
          <Sword className="mr-2 h-5 w-5" />
          {isSubmitting ? "Sending Challenge..." : "Issue Challenge"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateDuelForm;
