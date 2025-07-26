
'use client';

import * as React from 'react';
import { findMissingPerson, FindMissingPersonOutput } from '@/ai/flows/find-missing-person';
import { addLostAndFoundCase } from '@/services/lost-and-found';
import { uploadFile } from '@/services/storage';
import type { Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSearch, Bot, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Badge } from '../ui/badge';

interface LostAndFoundCardProps {
  role: Role;
}

export function LostAndFoundCard({ role }: LostAndFoundCardProps) {
  const [personPhoto, setPersonPhoto] = React.useState<File | null>(null);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<FindMissingPersonOutput | null>(null);
  const [personPhotoPreview, setPersonPhotoPreview] = React.useState<string | null>(null);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const { toast } = useToast();
  const isAdmin = role === 'Administrator';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'photo' | 'video') => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        if (fileType === 'photo') {
          setPersonPhoto(selectedFile);
          setPersonPhotoPreview(dataUrl);
        } else {
          setVideoFile(selectedFile);
          setVideoPreview(dataUrl);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalysis = async () => {
    if (!personPhoto || !videoFile || !isAdmin) return;
    setLoading(true);
    setResult(null);

    try {
      const photoReader = new FileReader();
      photoReader.readAsDataURL(personPhoto);
      photoReader.onload = async () => {
        const videoReader = new FileReader();
        videoReader.readAsDataURL(videoFile);
        videoReader.onload = async () => {
          try {
            const photoDataUri = photoReader.result as string;
            const videoDataUri = videoReader.result as string;
            const analysisResult = await findMissingPerson({ photoDataUri, videoDataUri });
            setResult(analysisResult);

            // Upload files and save case
            const photoUrl = await uploadFile(personPhoto, 'lost-and-found/photos');
            const videoUrl = await uploadFile(videoFile, 'lost-and-found/videos');
            await addLostAndFoundCase(photoUrl, videoUrl, analysisResult);

            toast({
              title: 'Search Complete',
              description: 'The search results and files have been saved.',
            });

          } catch (error) {
            console.error('Error during analysis or storage:', error);
            toast({
              title: 'An Error Occurred',
              description: 'Could not perform the analysis or save the case. Please check the console.',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        }
      }
    } catch(e) {
        console.error('Error reading files', e);
        toast({
            title: 'File Read Error',
            description: 'Could not read the selected files.',
            variant: 'destructive',
        });
        setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSearch className="size-5" /> AI-Powered Lost &amp; Found</CardTitle>
        <CardDescription>Upload a photo and a video to find a missing person.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="person-photo">Photo of Missing Person</Label>
                <Input
                  id="person-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  disabled={!isAdmin || loading}
                  className="file:text-primary file:font-semibold"
                />
                {personPhotoPreview && (
                    <div className="mt-2 w-full aspect-square rounded-md overflow-hidden border relative">
                        <Image src={personPhotoPreview} alt="Missing person preview" layout="fill" objectFit="cover" />
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="video-feed">Video Feed to Scan</Label>
                <Input
                  id="video-feed"
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  disabled={!isAdmin || loading}
                  className="file:text-primary file:font-semibold"
                />
                 {videoPreview && !result && !loading && (
                  <div className="mt-2 w-full aspect-video rounded-md overflow-hidden border">
                      <video src={videoPreview} controls className="w-full h-full object-cover" />
                  </div>
                )}
            </div>
        </div>

        {loading && (
          <div className="space-y-4 pt-4 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing video... This may take a moment.</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-4 animate-in fade-in duration-500">
            <div>
              <h4 className="font-semibold text-lg mb-2">Analysis Result</h4>
              {result.personFound ? (
                 <Badge variant="default" className="text-base"><CheckCircle className="mr-2 h-5 w-5" /> Person Found</Badge>
              ) : (
                 <Badge variant="destructive" className="text-base"><XCircle className="mr-2 h-5 w-5" /> Person Not Found</Badge>
              )}
            </div>
            {result.personFound && result.timestamp && (
              <div>
                <h4 className="font-semibold text-sm mb-1">Timestamp</h4>
                <p className="text-sm text-muted-foreground">Person was spotted at approximately <span className="font-bold text-primary">{result.timestamp}</span> in the video.</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm mb-1">Details</h4>
              <p className="text-sm text-muted-foreground">{result.details}</p>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={!personPhoto || !videoFile || !isAdmin || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Bot className="mr-2 h-4 w-4" />
              Find Person
            </>
          )}
        </Button>
        {!isAdmin && <p className="ml-4 text-xs text-muted-foreground">Administrator role required.</p>}
      </CardFooter>
    </Card>
  );
}
