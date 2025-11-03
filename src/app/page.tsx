'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { tests, badges, leaderboardData, BadgeData } from '@/lib/data';
import { Header } from '@/components/header';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

function TestGrid({ isLoggedIn, isLoading }: { isLoggedIn: boolean, isLoading: boolean }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleTestClick = (testId: string) => {
    if (!isLoggedIn) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to start an assessment.',
        variant: 'destructive',
        action: (
           <Button onClick={() => router.push('/login')}>Login</Button>
        ),
      });
    } else {
      router.push(`/tests/${testId}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
             <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-headline">Start Your Assessment</CardTitle>
        <CardDescription>
          {isLoggedIn
            ? 'Record your performance in the prescribed fitness tests.'
            : 'Log in to start your assessment and track your performance.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium font-headline">
                {test.name}
              </CardTitle>
              <test.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {test.description}
              </p>
              <Button onClick={() => handleTestClick(test.id)} size="sm" className="w-full">
                  Start Test <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function MyBadges() {
  const earnedBadges = badges.slice(0, 4); // Simulate earned badges
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">My Badges</CardTitle>
        <CardDescription>
          Celebrate your achievements and milestones.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {earnedBadges.map((badge: BadgeData) => (
          <div key={badge.id} className="flex flex-col items-center gap-2">
            <Image
              src={badge.image}
              alt={badge.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-accent"
              data-ai-hint="medal"
            />
            <p className="text-sm font-semibold">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Leaderboard() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="font-headline">Leaderboard</CardTitle>
          <CardDescription>See how you rank among peers.</CardDescription>
        </div>
        <Trophy className="h-8 w-8 text-accent" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Athlete</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow key={entry.rank} className={cn(entry.name === 'You' && 'bg-secondary')}>
                <TableCell className="font-medium">{entry.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold font-headline">
              {isLoggedIn ? `Welcome, ${user?.displayName || 'Athlete'}!` : 'Welcome, Athlete!'}
            </h1>
            <p className="text-muted-foreground">
              Your journey to greatness starts here. Assess your skills, track your progress, and get discovered.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestGrid isLoggedIn={isLoggedIn} isLoading={loading} />
            <MyBadges />
            <Leaderboard />
          </div>
        </div>
      </main>
    </>
  );
}
