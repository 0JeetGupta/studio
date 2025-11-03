'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
import type { GenerateRecommendationsInput } from '@/ai/flows/recommendations.d';

type RecommendationFormValues = Omit<GenerateRecommendationsInput, 'photoDataUri'> & {
  photo?: FileList;
};

function RecommendationResults({ results }: { results: any }) {
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
        <div>
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Workout Plan
          </h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4"
          >
            <ReactMarkdown>{results.workoutPlan}</ReactMarkdown>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Pizza className="h-5 w-5" />
            Diet & Nutrition
          </h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none rounded-md border p-4"
          >
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
  const [recommendations, setRecommendations] = useState<any | null>(null);
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

  const handleSubmit = async (values: RecommendationFormValues) => {
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
      const result = await getAiRecommendations({
        ...values,
        age: Number(values.age),
        weight: Number(values.weight),
        height: Number(values.height),
        photoDataUri,
      });
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
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 25"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 70"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 180"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value, 10) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Goal</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How active are you?" />
                                </SelectTrigger>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="medical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Conditions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any diseases, deficiencies, or allergies (e.g., lactose intolerant, peanut allergy)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This helps the AI create a safe and effective plan
                            for you.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
