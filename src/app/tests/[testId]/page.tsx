import { Header } from '@/components/header';
import { getTestById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { TestAnalysisClient } from './_components/test-analysis-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TestPage({ params }: { params: { testId: string } }) {
  const test = getTestById(params.testId);

  if (!test) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="mb-6">
            <Button asChild variant="ghost" className="mb-4">
               <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <test.icon className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold font-headline">{test.name}</h1>
                <p className="text-muted-foreground">{test.description}</p>
              </div>
            </div>
          </div>

          <TestAnalysisClient testId={test.id} />
        </div>
      </main>
    </>
  );
}
