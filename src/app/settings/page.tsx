
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LayoutClient } from '../layout-client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'connection-tests'), {
        status: 'success',
        testedAt: serverTimestamp(),
      });
      toast({
        title: 'Connection Successful!',
        description: 'A test document was successfully written to your Firestore database.',
      });
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to Firestore. Check your .env configuration and Firestore rules.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <LayoutClient>
      <main className="grid flex-1 items-start gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p>This is the Settings page. You can use the button below to verify your Firestore configuration.</p>
             <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Verify Firestore Connection</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Click this button to attempt to write a test document to your Firestore database.
                        This will confirm if your environment variables and Firestore rules are set up correctly.
                    </p>
                    <Button onClick={handleTestConnection} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            'Test Firestore Connection'
                        )}
                    </Button>
                </CardContent>
             </Card>
          </CardContent>
        </Card>
      </main>
    </LayoutClient>
  );
}
