import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import type { AnalyzeAthleteFormOutput } from '@/ai/flows/analyze-athlete-form';
import type { SegmentExerciseVideoOutput } from '@/ai/flows/segment-exercise-videos';
import ReactMarkdown from 'react-markdown';

interface AnalysisResultsProps {
  formAnalysis: AnalyzeAthleteFormOutput | null;
  segmentation: SegmentExerciseVideoOutput | null;
}

export function AnalysisResults({ formAnalysis, segmentation }: AnalysisResultsProps) {
  return (
    <Accordion type="multiple" defaultValue={['form-analysis', 'segmentation']} className="w-full">
      {formAnalysis && (
        <AccordionItem value="form-analysis">
          <AccordionTrigger className="text-lg font-semibold">AI Form Analysis</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{formAnalysis.analysis}</ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {segmentation && segmentation.segments.length > 0 && (
        <AccordionItem value="segmentation">
          <AccordionTrigger className="text-lg font-semibold">Automated Repetition Count</AccordionTrigger>
          <AccordionContent>
             <p className="text-sm text-foreground mb-4">{segmentation.analysis}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rep</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segmentation.segments.map((segment, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{segment.action}</TableCell>
                    <TableCell>{segment.startTime.toFixed(2)}s</TableCell>
                    <TableCell>{segment.endTime.toFixed(2)}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
