
'use client';

import { useState } from 'react';
import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/header';
import { Loader2, Sparkles, Bot, Pizza, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAiRecommendations } from './actions';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import type { GenerateRecommendationsInput, GenerateRecommendationsOutput } from '@/ai/flows/generate-recommendations';

// We define the form values type here on the client
type RecommendationFormValues = {
  age: number;
  weight: number;
  height: number;
  goal: 'lose_weight' | 'bulk_up' | 'get_fit';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  medical?: string;
  photo?: FileList;
};

// This is the results component. It doesn't need to import any server types.
function RecommendationResults({ results }: { results: GenerateRecommendationsOutput | null }) {
  if (!results) {
    return null;
  }
  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" />
          <CardTitle className="font-headline">
            Your Personal AI Recommendations
          </CardTitle>
        </div>
        <CardDescription>
          Here is a personalized fitness and diet plan generated just for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 font-headline">
            <Dumbbell className="h-5 w-5 text-primary" />
            Workout Plan
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-foreground prose-h3:mt-6 prose-h4:mt-4 prose-ul:my-3 prose-li:my-1">
            <ReactMarkdown>{results.workoutPlan}</ReactMarkdown>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2 font-headline">
            <Pizza className="h-5 w-5 text-primary" />
            Diet & Nutrition
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-foreground prose-h3:mt-6 prose-h4:mt-4 prose-ul:my-3 prose-li:my-1">
             <ReactMarkdown>{results.dietPlan}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<GenerateRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    defaultValues: {
      goal: 'get_fit',
      activityLevel: 'moderately_active',
      medical: '',
    },
  });

  const photoRef = form.register('photo');

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit: SubmitHandler<RecommendationFormValues> = async (values) => {
    setIsLoading(true);
    setRecommendations(null);

    if (!values.age || !values.weight || !values.height) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out age, weight, and height.',
      });
      setIsLoading(false);
      return;
    }

    let photoDataUri: string | undefined;
    const photoFile = values.photo?.[0];
    if (photoFile) {
      photoDataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });
    }

    try {
      // Cast the form values to the server action's expected input type
      const input: GenerateRecommendationsInput = {
        ...values,
        age: Number(values.age),
        weight: Number(values.weight),
        height: Number(values.height),
        photoDataUri,
      };
      
      const result = await getAiRecommendations(input);
      setRecommendations(result);
      toast({
        title: 'Recommendations Generated!',
        description: 'Your personalized plan is ready.',
      });
    } catch (error) {
      console.error('AI recommendation failed', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'The AI could not generate recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Get Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Fill out the form below, and our AI will generate a
                  personalized fitness and diet plan for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 25"
                              {...form.register('age', { valueAsNumber: true })}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 70"
                              {...form.register('weight', { valueAsNumber: true })}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 180"
                              {...form.register('height', { valueAsNumber: true })}
                            />
                          </FormControl>
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>Primary Goal</FormLabel>
                            <Select
                              onValueChange={(value) => form.setValue('goal', value as RecommendationFormValues['goal'])}
                              defaultValue={form.getValues('goal')}
                            >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your main goal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lose_weight">
                                Lose Weight
                              </SelectItem>
                              <SelectItem value="bulk_up">Bulk Up</SelectItem>
                              <SelectItem value="get_fit">
                                Get Fit & Healthy
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                        <FormItem>
                          <FormLabel>Activity Level</FormLabel>
                           <Select
                              onValueChange={(value) => form.setValue('activityLevel', value as RecommendationFormValues['activityLevel'])}
                              defaultValue={form.getValues('activityLevel')}
                            >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="How active are you?" />
                              </Trigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">
                                Sedentary (little to no exercise)
                              </SelectItem>
                              <SelectItem value="lightly_active">
                                Lightly Active (1-2 days/week)
                              </SelectItem>
                              <SelectItem value="moderately_active">
                                Moderately Active (3-5 days/week)
                              </SelectItem>
                              <SelectItem value="very_active">
                                Very Active (6-7 days/week)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                    </div>

                      <FormItem>
                        <FormLabel>Medical Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any diseases, deficiencies, or allergies (e.g., lactose intolerant, peanut allergy)"
                            {...form.register('medical')}
                          />
                        </FormControl>
                        <FormDescription>
                          This helps the AI create a safe and effective plan
                          for you.
                        </FormDescription>
                      </FormItem>

                    <FormItem>
                          <FormLabel>Full Body Photo (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/*"
                              {...photoRef}
                              onChange={handlePhotoChange}
                            />
                          </FormControl>
                          <FormDescription>
                            Providing a photo helps the AI give a more accurate
                            recommendation.
                          </FormDescription>
                        </FormItem>

                    {photoPreview && (
                      <div className="flex justify-center">
                        <Image
                          src={photoPreview}
                          alt="Photo preview"
                          width={150}
                          height={200}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Your Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get My Recommendations
                        </>
                      )}
                    </Button>
                  </form>
                </FormProvider>
                {isLoading && (
                  <Alert className="mt-4 text-primary border-primary">
                    <Bot className="h-4 w-4 !text-primary" />
                    <AlertTitle>AI is thinking...</AlertTitle>
                    <AlertDescription>
                      Your personalized plan is being generated. This might take
                      a moment.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {recommendations && <RecommendationResults results={recommendations} />}
          </div>
        </div>
      </main>
    </>
  );
}
