'use client';

import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, UserCheck, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FaceScanner, type FaceScanResult } from '@/components/face-scanner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFaceRegistered, setIsFaceRegistered] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if(user) {
      const storedFaceData = localStorage.getItem('faceprint');
      setIsFaceRegistered(!!storedFaceData);
    }
  }, [user, loading, router]);
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        toast({
            title: 'Settings Saved',
            description: 'Your changes have been saved successfully.',
        });
        setIsSaving(false);
    }, 1500);
  };
  
  const handleScanComplete = (result: FaceScanResult) => {
    setIsCameraOpen(false);
    if(result.status === 'success' && result.descriptor) {
        localStorage.setItem('faceprint', JSON.stringify(Array.from(result.descriptor)));
        setIsFaceRegistered(true);
        toast({
            title: "Face Registered!",
            description: "Your faceprint has been saved securely in your browser."
        });
    } else {
        toast({
            variant: "destructive",
            title: "Scan Failed",
            description: result.message || "Could not register your face. Please try again."
        });
    }
  }

  const handleRemoveFaceprint = () => {
    localStorage.removeItem('faceprint');
    setIsFaceRegistered(false);
    toast({
        title: "Faceprint Removed",
        description: "Your registered face data has been deleted."
    })
  }

  if (loading || !user) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-10 w-full" />
               </div>
                <div className="space-y-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-10 w-full" />
               </div>
               <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (isCameraOpen) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <FaceScanner 
                onScanComplete={handleScanComplete}
                onCancel={() => setIsCameraOpen(false)}
                mode="register"
            />
        </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
           <Button asChild variant="ghost" className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          <h1 className="text-3xl font-bold font-headline mb-6">Settings</h1>
          <div className="space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and password.</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.displayName || ''} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" type="password" placeholder="Enter a new password" />
                    </div>
                    <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                    </Button>
                </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Face Verification</CardTitle>
                    <CardDescription>Register your face to enable secure, password-less verification.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isFaceRegistered ? (
                        <div className="flex items-center gap-4 p-4 rounded-md bg-green-500/10 border border-green-500/20">
                            <UserCheck className="h-8 w-8 text-green-500" />
                            <div>
                                <h3 className="font-semibold text-green-400">Faceprint is Registered</h3>
                                <p className="text-sm text-muted-foreground">You can now use face verification on the login screen.</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">You have not registered your face yet. Register now to add an extra layer of security.</p>
                    )}
                </CardContent>
                <CardFooter>
                    {isFaceRegistered ? (
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Faceprint
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will delete your registered faceprint. You will need to register your face again to use this feature.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleRemoveFaceprint}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Button onClick={() => setIsCameraOpen(true)}>Register Face</Button>
                    )}
                </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}