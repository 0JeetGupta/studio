import { Header } from '@/components/header';
import { getTestById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { TestAnalysisClient } from './_components/test-analysis-client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TestPage({ params: { testId } }: { params: { testId: string } }) {
  const test = getTestById(testId);

  if (!test) {
    notFound();
  }

  const { icon: TestIcon, name, description, id } = test;

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
              <TestIcon className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-3xl font-bold font-headline">{name}</h1>
                <p className="text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          <TestAnalysisClient testId={id} />
        </div>
      </main>
    </>
  );
}
