
'use client';

import * as React from 'react';
import { analyzeVideoForSafetyHazards, AnalyzeVideoForSafetyHazardsOutput } from '@/ai/flows/analyze-video-for-safety-hazards';
import { addVideoInsight } from '@/services/video-insights';
import { uploadFile } from '@/services/storage';
import type { Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Bot, AlertTriangle, ShieldCheck, Flame, Wind, Siren, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

interface CrowdInsightsCardProps {
  role: Role;
}

export function CrowdInsightsCard({ role }: CrowdInsightsCardProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalyzeVideoForSafetyHazardsOutput | null>(null);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isAdmin = role === 'Administrator';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalysis = async () => {
    if (!file || !isAdmin) return;
    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const videoDataUri = reader.result as string;
        const analysisResult = await analyzeVideoForSafetyHazards({ videoDataUri });
        setResult(analysisResult);
        
        // Upload video and save results
        const videoUrl = await uploadFile(file, 'video-insights');
        await addVideoInsight(videoUrl, analysisResult);

        toast({
            title: 'Analysis Complete',
            description: 'Video insights have been saved to the database.',
        });

      } catch (error) {
        console.error('Error during analysis or storage:', error);
        toast({
          title: 'An Error Occurred',
          description: 'Could not analyze the video or save the results. Please check the console.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        title: 'File Read Error',
        description: 'Could not read the selected file.',
        variant: 'destructive',
      });
      setLoading(false);
    };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="size-5" /> Crowd Insights & Anomaly Detection</CardTitle>
        <CardDescription>Upload video to analyze crowd behavior and detect anomalies like smoke, fire, or panic.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
            <Label htmlFor="video-upload">Video File</Label>
            <Input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={!isAdmin || loading}
              className="file:text-primary file:font-semibold"
            />
        </div>
        
        {videoPreview && !result && !loading && (
          <div className="w-full aspect-video rounded-md overflow-hidden border">
              <video src={videoPreview} controls className="w-full h-full object-cover" />
          </div>
        )}
        
        {loading && (
          <div className="space-y-4 pt-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-500">
            <div>
                <h4 className="font-semibold text-sm mb-2">Analysis Summary</h4>
                 <div className="flex flex-wrap gap-2">
                    {result.safetyAnalysis.hazardDetected ? (
                        <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Hazard Detected</Badge>
                    ) : (
                        <Badge variant="default"><ShieldCheck className="mr-1 h-3 w-3" /> No Hazard Detected</Badge>
                    )}
                    {result.safetyAnalysis.smokeDetected && (
                        <Badge variant="destructive"><Wind className="mr-1 h-3 w-3" /> Smoke Detected</Badge>
                    )}
                     {result.safetyAnalysis.fireDetected && (
                        <Badge variant="destructive"><Flame className="mr-1 h-3 w-3" /> Fire Detected</Badge>
                    )}
                     {result.safetyAnalysis.panicDetected && (
                        <Badge variant="destructive"><Siren className="mr-1 h-3 w-3" /> Panic Detected</Badge>
                    )}
                 </div>
            </div>

            {result.safetyAnalysis.hazardDetected && (
              <>
                {result.safetyAnalysis.timestamp && (
                    <div>
                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-1.5"><Clock className="size-4" /> Timestamp</h4>
                        <p className="text-sm text-muted-foreground">Hazard first detected at approximately <span className="font-bold text-primary">{result.safetyAnalysis.timestamp}</span>.</p>
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-sm mb-1">Hazard Description</h4>
                    <p className="text-sm text-muted-foreground">{result.safetyAnalysis.hazardDescription}</p>
                </div>
              </>
            )}
            <div>
              <h4 className="font-semibold text-sm mb-1">Crowd Density</h4>
              <p className="text-sm text-muted-foreground">{result.safetyAnalysis.crowdDensity}</p>
            </div>
             <div>
              <h4 className="font-semibold text-sm mb-1">Unusual Events</h4>
              <p className="text-sm text-muted-foreground">{result.safetyAnalysis.unusualEvents}</p>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={!file || !isAdmin || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Analyze Video
            </>
          )}
        </Button>
        {!isAdmin && <p className="ml-4 text-xs text-muted-foreground">Administrator role required.</p>}
      </CardFooter>
    </Card>
  );
}
