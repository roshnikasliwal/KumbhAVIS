"use client";

import { useState } from 'react';
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getMapImprovementSuggestions, type SuggestionResult } from '@/app/actions';

export function MapView() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuggestImprovements = async () => {
    setIsLoading(true);
    setResult(null);
    setIsDialogOpen(true);
    const suggestionResult = await getMapImprovementSuggestions({
        eventDescription: "Kumbh Mela, a massive religious pilgrimage and festival in India.",
        currentMapFeatures: "The map currently displays the main bathing ghats, major roads, medical aid stations, police outposts, and main entry/exit points for the festival area."
    });
    setResult(suggestionResult);
    setIsLoading(false);
  };
  
  return (
    <>
      <Card className="flex h-full flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
        <CardHeader>
          <CardTitle>Geographic Visualization</CardTitle>
          <CardDescription>Real-time overview of the event area.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="aspect-[16/10] h-full w-full overflow-hidden rounded-lg border">
            <Image
              src="https://placehold.co/1920x1080"
              alt="Interactive Map"
              width={1920}
              height={1080}
              data-ai-hint="city aerial map"
              className="h-full w-full object-cover"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSuggestImprovements} disabled={isLoading} size="lg">
            {isLoading && !result ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            {isLoading && !result ? "Analyzing..." : "AI-Powered Map Suggestions"}
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                {result?.success ? "AI Map Improvement Suggestions" : "Generating Suggestions..."}
            </AlertDialogTitle>
            <div className="max-h-[60vh] overflow-y-auto py-4 pr-4">
              <AlertDialogDescription asChild>
                <div className="whitespace-pre-wrap font-sans text-base text-foreground/90">
                  {isLoading ? 
                    <div className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Thinking...</div> 
                    : result?.message || "No suggestions available."}
                </div>
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
