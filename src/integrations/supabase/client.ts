
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xuomjtvocloviqxtqvuf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1b21qdHZvY2xvdmlxeHRxdnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDg4NDAsImV4cCI6MjA1ODcyNDg0MH0.QKbFIkDwc6fk6vrTfoILQm_Q2Ivuyi95MK00UW2Qk34";

// Create the Supabase client with optimized realtime functionality
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    realtime: {
      params: {
        eventsPerSecond: 20 // Increased from 10 to improve responsiveness
      }
    },
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'x-application-name': 'DuelOn' // Adding application identifier
      }
    }
  }
);

// Helper function to log errors in a structured way
export const logSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  if (error?.message) {
    console.error('Message:', error.message);
  }
  if (error?.details) {
    console.error('Details:', error.details);
  }
  return error;
};

// Helper function for setting up realtime subscriptions
export const setupRealtimeSubscription = (
  tableName: string, 
  callback: () => void,
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) => {
  console.log(`Setting up realtime subscription for ${tableName}, event: ${eventType}`);
  
  // Create a channel with the correct event type configuration
  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes', 
      { 
        event: eventType,
        schema: 'public',
        table: tableName
      } as any, // Type assertion to resolve TypeScript error
      (payload) => {
        console.log(`Realtime update received for ${tableName}:`, payload);
        callback();
      }
    )
    .subscribe((status) => {
      console.log(`Realtime subscription status for ${tableName}:`, status);
    });
  
  return () => {
    console.log(`Removing realtime subscription for ${tableName}`);
    supabase.removeChannel(channel);
  };
};
