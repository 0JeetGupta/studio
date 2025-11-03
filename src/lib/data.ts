import {
  PersonStanding,
  Footprints,
  Repeat,
  Trophy,
  Medal,
  Dumbbell,
  Zap,
  Star,
  Wind,
  Crown,
  LineChart,
  type LucideIcon,
  Flame,
  ArrowUpFromDot,
  HeartPulse,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export type Test = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const tests: Test[] = [
  {
    id: 'push-ups',
    name: 'Push-ups',
    description: 'Test your upper body strength.',
    icon: Flame,
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    description: 'Assess your back and bicep strength.',
    icon: ArrowUpFromDot,
  },
    {
    id: 'squats',
    name: 'Squats',
    description: 'Measure your lower body strength.',
    icon: Dumbbell,
  },
  {
    id: 'skipping',
    name: 'Skipping',
    description: 'Evaluate your coordination and stamina.',
    icon: HeartPulse,
  },
  {
    id: 'vertical-jump',
    name: 'Vertical Jump',
    description: 'Measure your explosive leg power.',
    icon: PersonStanding,
  },
  {
    id: 'shuttle-run',
    name: 'Shuttle Run',
    description: 'Test your agility and speed.',
    icon: Footprints,
  },
  {
    id: 'sit-ups',
    name: 'Sit-ups',
    description: 'Assess your abdominal strength.',
    icon: Repeat,
  },
  {
    id: 'endurance-run',
    name: 'Endurance Run',
    description: 'Evaluate your cardiovascular fitness.',
    icon: Wind,
  },
];

export type Benchmark = {
  [key: string]: {
    unit: string;
    levels: {
      beginner: number;
      intermediate: number;
      advanced: number;
      elite: number;
    };
  };
};

export const benchmarks: Benchmark = {
  'push-ups': {
    unit: 'reps',
    levels: { beginner: 10, intermediate: 25, advanced: 40, elite: 50 },
  },
  'pull-ups': {
    unit: 'reps',
    levels: { beginner: 1, intermediate: 5, advanced: 10, elite: 20 },
  },
  'squats': {
    unit: 'reps',
    levels: { beginner: 20, intermediate: 40, advanced: 60, elite: 100 },
  },
  'skipping': {
    unit: 'reps',
    levels: { beginner: 50, intermediate: 100, advanced: 200, elite: 300 },
  },
  'sit-ups': {
    unit: 'reps',
    levels: {
      beginner: 15,
      intermediate: 30,
      advanced: 45,
      elite: 60,
    },
  },
  'vertical-jump': {
    unit: 'cm',
    levels: {
      beginner: 20,
      intermediate: 40,
      advanced: 60,
      elite: 80,
    },
  },
  'shuttle-run': {
    unit: 's',
    levels: {
      elite: 9,
      advanced: 10,
      intermediate: 11,
      beginner: 12,
    },
  },
  'endurance-run': {
    unit: 'm',
    levels: {
      beginner: 1600,
      intermediate: 2400,
      advanced: 3200,
      elite: 5000,
    },
  },
};

export type BadgeData = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

export const badges: BadgeData[] = [
  {
    id: 'jump-starter',
    name: 'Jump Starter',
    description: 'Completed your first vertical jump test.',
    icon: Star,
    image: PlaceHolderImages.find(img => img.id === 'badge-jump-1')?.imageUrl || '',
  },
  {
    id: 'endurance-rookie',
    name: 'Endurance Rookie',
    description: 'Completed your first endurance run.',
    icon: Star,
    image: PlaceHolderImages.find(img => img.id === 'badge-endurance-1')?.imageUrl || '',
  },
  {
    id: 'sit-up-pro',
    name: 'Sit-up Pro',
    description: 'Achieved 50 sit-ups in a single test.',
    icon: Medal,
    image: PlaceHolderImages.find(img => img.id === 'badge-situp-1')?.imageUrl || '',
  },
  {
    id: 'agility-master',
    name: 'Agility Master',
    description: 'Top score in the shuttle run.',
    icon: Trophy,
    image: PlaceHolderImages.find(img => img.id === 'badge-run-2')?.imageUrl || '',
  },
    {
    id: 'power-jumper',
    name: 'Power Jumper',
    description: 'Reached elite level in vertical jump.',
    icon: Zap,
    image: PlaceHolderImages.find(img => img.id === 'badge-jump-2')?.imageUrl || '',
  },
  {
    id: 'core-champion',
    name: 'Core Champion',
    description: 'Mastered the sit-up challenge.',
    icon: Dumbbell,
    image: PlaceHolderImages.find(img => img.id === 'badge-run-1')?.imageUrl || '',
  },
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  level: 'Rookie' | 'Intermediate' | 'Pro' | 'Master' | 'Grandmaster';
};

export const cityLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Ravi Kumar', score: 4850, avatar: 'https://picsum.photos/seed/L1/40/40', level: 'Pro' },
  { rank: 2, name: 'Priya Sharma', score: 4720, avatar: 'https://picsum.photos/seed/L2/40/40', level: 'Pro' },
  { rank: 3, name: 'Amit Singh', score: 4680, avatar: 'https://picsum.photos/seed/L3/40/40', level: 'Pro' },
  { rank: 4, name: 'Anjali Das', score: 4510, avatar: 'https://picsum.photos/seed/L4/40/40', level: 'Intermediate' },
  { rank: 5, name: 'You', score: 4490, avatar: 'https://picsum.photos/seed/You/40/40', level: 'Intermediate' },
  { rank: 6, name: 'Sanjay Verma', score: 4300, avatar: 'https://picsum.photos/seed/L5/40/40', level: 'Rookie' },
];

export const stateLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Vikram Rathore', score: 9800, avatar: 'https://picsum.photos/seed/S1/40/40', level: 'Master' },
  { rank: 2, name: 'Ravi Kumar', score: 9650, avatar: 'https://picsum.photos/seed/L1/40/40', level: 'Master' },
  { rank: 3, name: 'Priya Sharma', score: 9500, avatar: 'https://picsum.photos/seed/L2/40/40', level: 'Pro' },
  { rank: 4, name: 'Amit Singh', score: 9210, avatar: 'https://picsum.photos/seed/L3/40/40', level: 'Pro' },
  { rank: 5, name: 'Neha Reddy', score: 9150, avatar: 'https://picsum.photos/seed/S2/40/40', level: 'Pro' },
];

export const nationalLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Arjun Desai', score: 15500, avatar: 'https://picsum.photos/seed/N1/40/40', level: 'Grandmaster' },
  { rank: 2, name: 'Vikram Rathore', score: 15200, avatar: 'https://picsum.photos/seed/S1/40/40', level: 'Grandmaster' },
  { rank: 3, name: 'Ravi Kumar', score: 14900, avatar: 'https://picsum.photos/seed/L1/40/40', level: 'Master' },
  { rank: 4, name: 'Meera Nair', score: 14750, avatar: 'https://picsum.photos/seed/N2/40/40', level: 'Master' },
  { rank: 5, name: 'Aditya Rao', score: 14600, avatar: 'https://picsum.photos/seed/N3/40/40', level: 'Master' },
];

export const progressData = [
    { month: "January", score: 3200 },
    { month: "February", score: 3500 },
    { month: "March", score: 3400 },
    { month: "April", score: 3800 },
    { month: "May", score: 4100 },
    { month: "June", score: 4490 },
];


export function getTestById(id: string | undefined): Test | undefined {
  if (!id) return undefined;
  return tests.find(test => test.id === id);
}
