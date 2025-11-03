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
import { tests, badges, cityLeaderboardData, stateLeaderboardData, nationalLeaderboardData, BadgeData, LeaderboardEntry, progressData } from '@/lib/data';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Trophy, Crown, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, XAxis, Line, ComposedChart } from 'recharts';

function TestGrid() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
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

  if (loading) {
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
    <Card className="col-span-1 md:col-span-2 lg:col-span-3 dashboard-card">
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
  const earnedBadges = badges.slice(0, 3); // Simulate earned badges
  return (
    <Card className="col-span-1 md:col-span-2 dashboard-card">
      <CardHeader>
        <CardTitle className="font-headline">My Badges</CardTitle>
        <CardDescription>
          Celebrate your achievements and milestones.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 text-center">
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

function ProgressReport() {
    const chartConfig = {
    score: {
      label: 'Overall Score',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="col-span-1 dashboard-card">
        <CardHeader>
             <div className="flex items-center gap-2">
                <LineChart className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">Progress Report</CardTitle>
            </div>
            <CardDescription>Your overall performance trend over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <ComposedChart data={progressData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="score" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}

function LeaderboardTable({ data }: { data: LeaderboardEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Rank</TableHead>
          <TableHead>Athlete</TableHead>
          <TableHead>Level</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
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
            <TableCell>{entry.level}</TableCell>
            <TableCell className="text-right">{entry.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Leaderboard() {
  return (
    <Card className="col-span-1 md:col-span-3 dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="font-headline">Leaderboard</CardTitle>
          <CardDescription>See how you rank against the competition.</CardDescription>
        </div>
        <Trophy className="h-8 w-8 text-accent" />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="city">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="city">City</TabsTrigger>
            <TabsTrigger value="state">State</TabsTrigger>
            <TabsTrigger value="national">National</TabsTrigger>
          </TabsList>
          <TabsContent value="city">
            <LeaderboardTable data={cityLeaderboardData} />
          </TabsContent>
          <TabsContent value="state">
            <LeaderboardTable data={stateLeaderboardData} />
          </TabsContent>
          <TabsContent value="national">
            <LeaderboardTable data={nationalLeaderboardData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function RankingSystemExplanation() {
  return (
    <Card className="col-span-1 md:col-span-2 dashboard-card">
      <CardHeader>
         <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Ranking System</CardTitle>
          </div>
        <CardDescription>Understand the path to becoming a top athlete.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
          <div>
            <h4 className="font-semibold">City Level</h4>
            <p className="text-muted-foreground">Compete against athletes in your city. Finish in the Top 3 to get promoted to the State Level and earn the 'Pro' title.</p>
          </div>
        </div>
         <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
          <div>
            <h4 className="font-semibold">State Level</h4>
            <p className="text-muted-foreground">Prove you're among the best in the state. Top performers at this level are recognized as 'Master' athletes and advance to the National stage.</p>
          </div>
        </div>
         <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
          <div>
            <h4 className="font-semibold">National Level</h4>
            <p className="text-muted-foreground">The ultimate challenge. Compete with the nation's elite to achieve the prestigious 'Grandmaster' rank.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  const isLoggedIn = !loading && !!user;
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-card', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power3.out',
      });
      gsap.from('.welcome-text', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power3.out',
      })
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);


  return (
    <>
      <Header />
      <main ref={mainRef} className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="space-y-4 mb-8 welcome-text">
            <h1 className="text-3xl font-bold font-headline">
              {isLoggedIn ? `Welcome, ${user?.displayName || 'Athlete'}!` : 'Welcome to Khel Khoj!'}
            </h1>
            <p className="text-muted-foreground">
              {isLoggedIn
                ? 'Your journey to greatness starts here. Assess your skills, track your progress, and get discovered.'
                : 'The AI-Powered Mobile Platform for Democratizing Sports Talent Assessment. Log in to get started.'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestGrid />
            <div className="md:col-span-2 grid gap-6">
                <MyBadges />
                <RankingSystemExplanation />
            </div>
            <div className="md:col-span-1">
                <ProgressReport />
            </div>
            <Leaderboard />
          </div>
        </div>
      </main>
    </>
  );
}
