"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Video, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkFrameForAnomalies } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface VideoFeedProps {
  feedName: string;
  videoSrc: string;
  initialAnomalyDetected?: boolean;
  crowdDensity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const densityValues: Record<VideoFeedProps['crowdDensity'], number> = {
  Low: 20,
  Medium: 50,
  High: 75,
  Critical: 95,
};

export function VideoFeed({ feedName, videoSrc, initialAnomalyDetected = false, crowdDensity }: VideoFeedProps) {
  const [anomaly, setAnomaly] = useState<{ detected: boolean, type: string, description: string } | null>(initialAnomalyDetected ? { detected: true, type: "Initial", description: "Anomaly detected upon load." } : null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleCanPlay = () => {
    setIsLive(true);
  };
  
  const handleOffline = () => {
    setIsLive(false);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleOffline);
        video.addEventListener('stalled', handleOffline);
    }
    return () => {
        if(video) {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleOffline);
            video.removeEventListener('stalled', handleOffline);
        }
    };
  }, []);

  const captureAndAnalyzeFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isScanning || videoRef.current.paused) return;

    setIsScanning(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUri = canvas.toDataURL('image/jpeg');
        
        const result = await checkFrameForAnomalies({ imageDataUri });

        if (result.success && result.data?.isAnomaly) {
            setAnomaly({ detected: true, type: result.data.anomalyType, description: result.data.description });
            toast({
              variant: 'destructive',
              title: `Anomaly Detected: ${result.data.anomalyType}`,
              description: `${feedName}: ${result.data.description}`,
            });
        } else if (result.success && !result.data?.isAnomaly) {
             // Optional: reset anomaly state if it's clear after a few clean checks
             // if (anomaly) {
             //   setAnomaly(null);
             // }
        } else if (!result.success) {
            console.error("Anomaly check failed:", result.message);
        }
    }
    setIsScanning(false);
  }, [isScanning, feedName, toast]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isLive) {
      intervalId = setInterval(captureAndAnalyzeFrame, 10000); // Scan every 10 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLive, captureAndAnalyzeFrame]);

  const isHighDensity = crowdDensity === 'High' || crowdDensity === 'Critical';

  return (
    <Card className="flex flex-col transform overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{feedName}</CardTitle>
          <div className="flex items-center gap-2">
            {isScanning ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-semibold text-primary">SCANNING</span>
                </>
            ) : (
                <>
                    <span className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-green-400' : 'bg-destructive'} opacity-75`}></span>
                        <span className={`relative inline-flex h-3 w-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-destructive'}`}></span>
                    </span>
                    <span className={`text-sm font-semibold ${isLive ? 'text-green-400' : 'text-destructive'}`}>
                        {isLive ? 'LIVE' : 'OFFLINE'}
                    </span>
                </>
            )}
          </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video overflow-hidden bg-muted relative">
            <video 
                ref={videoRef} 
                src={videoSrc}
                className="w-full aspect-video rounded-md" 
                autoPlay 
                muted 
                loop
                playsInline 
                crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} className="hidden" />
             {!isLive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 p-4">
                    <Video className="h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">Video feed is currently offline or unavailable.</p>
                </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 bg-muted/30 p-4">
        {anomaly?.detected && (
          <Alert variant="destructive" className="w-full animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{anomaly.type.toUpperCase()} DETECTED</AlertTitle>
            <AlertDescription>
                {anomaly.description}
            </AlertDescription>
          </Alert>
        )}
        <div className="w-full">
            <div className="mb-1 flex items-baseline justify-between">
                <p className="text-sm font-medium">Crowd Density</p>
                <p className={`text-sm font-bold ${isHighDensity ? 'text-destructive' : 'text-foreground'}`}>{crowdDensity}</p>
            </div>
            <Progress 
                value={densityValues[crowdDensity]} 
                className={isHighDensity ? '[&>div]:bg-destructive' : ''} 
            />
        </div>
      </CardFooter>
    </Card>
  );
}
