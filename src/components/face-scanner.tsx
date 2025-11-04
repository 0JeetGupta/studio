'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Camera, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as faceapi from 'face-api.js';

export type FaceScanResult = {
  status: 'success' | 'failure';
  descriptor?: Float32Array;
  message?: string;
};

interface FaceScannerProps {
  onScanComplete: (result: FaceScanResult) => void;
  onCancel: () => void;
  mode: 'register' | 'verify';
}

export function FaceScanner({ onScanComplete, onCancel, mode }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [status, setStatus] = useState<'scanning' | 'success' | 'failure'>('scanning');
  const [feedback, setFeedback] = useState('Initializing...');
  const { toast } = useToast();

  const loadModels = useCallback(async () => {
    // The models should be in the `public/models` directory.
    const MODEL_URL = '/models';
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    } catch (error) {
      console.error("Failed to load models", error);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: "Could not load face recognition models. Please try again later."
      });
      onCancel();
    }
  }, [onCancel, toast]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraPermission(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasCameraPermission(false);
      setFeedback('Camera access is required.');
      onScanComplete({ status: 'failure', message: 'Camera permission denied.' });
    }
  }, [onScanComplete]);

  useEffect(() => {
    const initialize = async () => {
      setFeedback('Loading AI models...');
      await loadModels();
      setFeedback('Starting camera...');
      await startCamera();
      setIsInitializing(false);
      setFeedback('Position your face in the center.');
    };
    initialize();

    return () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
    }
  }, [loadModels, startCamera]);

  const handleVideoPlay = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || status !== 'scanning') {
        return clearInterval(interval);
      }

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 1) {
        clearInterval(interval);
        setStatus('success');
        setFeedback(mode === 'register' ? 'Faceprint Captured!' : 'Face Verified!');
        setTimeout(() => {
            onScanComplete({ status: 'success', descriptor: detections[0].descriptor });
        }, 1500);
      } else if (detections.length > 1) {
        setFeedback('Multiple faces detected. Please show only one face.');
      } else {
        setFeedback('No face detected. Position your face in the center.');
      }
    }, 500);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
            {mode === 'register' ? 'Register Your Face' : 'Verify Your Face'}
        </CardTitle>
        <CardDescription>{feedback}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onPlay={handleVideoPlay}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 border-primary/50 border-4 rounded-lg" style={{ clipPath: 'ellipse(35% 45% at 50% 50%)' }}/>
          {(isInitializing || status === 'scanning') && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-primary-foreground mt-2">{isInitializing ? 'Loading...' : 'Scanning...'}</p>
            </div>
          )}
          {status === 'success' && (
            <div className="absolute inset-0 bg-green-500/80 flex flex-col items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
              <p className="text-lg font-bold text-white mt-2">{mode === 'register' ? 'Registered' : 'Verified'}</p>
            </div>
          )}
          {status === 'failure' && (
            <div className="absolute inset-0 bg-destructive/80 flex flex-col items-center justify-center">
              <XCircle className="h-12 w-12 text-white" />
              <p className="text-lg font-bold text-white mt-2">Failed</p>
            </div>
          )}
        </div>
        {hasCameraPermission === false && (
          <p className="text-sm text-destructive text-center">Camera permission denied. Please enable it in your browser settings.</p>
        )}
        <Button variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}
