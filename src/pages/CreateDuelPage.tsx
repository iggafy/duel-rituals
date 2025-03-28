
import React, { useEffect } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateDuelForm from '@/components/CreateDuelForm';
import { useAuthGuard } from '@/hooks/use-auth-guard';

const CreateDuelPage = () => {
  // Use the auth guard to ensure only authenticated users can access this page
  const { isAuthenticated, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavigationBar />
        <main className="flex-1 container py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="ritual-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-duel-gold">
                Issue a Challenge
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Create a formal duel challenge with clear terms and stakes
              </p>
            </CardHeader>
            <CardContent>
              <CreateDuelForm />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateDuelPage;
