import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SIX_FS_STEPS = [
  { id: 'find', name: 'Find', description: 'Locate the part in your body or mind' },
  { id: 'focus', name: 'Focus', description: 'Give your full attention to this part' },
  { id: 'flesh-out', name: 'Flesh Out', description: 'Get to know the part - its appearance, age, feelings' },
  { id: 'feel-toward', name: 'Feel Toward', description: 'Notice how you feel toward this part' },
  { id: 'befriend', name: 'Befriend', description: 'Build a relationship with the part' },
  { id: 'find-exile', name: 'Find the Exile', description: 'Discover which exile this part protects' },
];

interface Collaborative6FsProps {
  sessionId: string;
  currentUserRole: 'therapist' | 'client';
}

export default function Collaborative6Fs({ sessionId, currentUserRole }: Collaborative6FsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [aiGuidance, setAiGuidance] = useState<{ guidance: string; citations: string[] } | null>(null);
  const { toast } = useToast();

  const guidanceMutation = useMutation({
    mutationFn: async () => {
      const step = SIX_FS_STEPS[currentStep];
      return apiRequest('POST', '/api/ai/protocol-guidance', {
        protocolType: '6 F\'s Protocol',
        currentStep: step.name,
        userResponse: currentResponse || undefined,
      });
    },
    onSuccess: (data) => {
      setAiGuidance(data);
    },
  });

  const handleGetGuidance = () => {
    guidanceMutation.mutate();
  };

  const handleNextStep = () => {
    if (!currentResponse.trim()) {
      toast({
        title: "Response Required",
        description: "Please reflect on this step before continuing.",
        variant: "destructive",
      });
      return;
    }

    setResponses({ ...responses, [currentStep]: currentResponse });
    setCurrentResponse('');
    setAiGuidance(null);

    if (currentStep < SIX_FS_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Complete",
        description: `Moving to: ${SIX_FS_STEPS[currentStep + 1].name}`,
      });
    } else {
      toast({
        title: "Protocol Complete",
        description: "You've completed the 6 F's Protocol!",
      });
    }
  };

  const step = SIX_FS_STEPS[currentStep];
  const isComplete = currentStep === SIX_FS_STEPS.length - 1 && responses[currentStep];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">6 F's Protocol Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {SIX_FS_STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center gap-2">
                <Badge
                  variant={index < currentStep ? 'default' : index === currentStep ? 'secondary' : 'outline'}
                  className="flex items-center gap-1"
                  data-testid={`step-badge-${s.id}`}
                >
                  {index < currentStep && <Check className="w-3 h-3" />}
                  {s.name}
                </Badge>
                {index < SIX_FS_STEPS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="mb-2">{step.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            <Badge variant="outline" data-testid="current-step">
              Step {currentStep + 1}/{SIX_FS_STEPS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {currentUserRole === 'therapist' ? 'Guide your client' : 'Your reflection'}
            </label>
            <Textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder={
                currentUserRole === 'therapist'
                  ? 'Ask guiding questions or offer reflections...'
                  : 'What do you notice? What comes up for you?'
              }
              className="min-h-[120px]"
              data-testid="input-step-response"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleGetGuidance}
              variant="outline"
              disabled={guidanceMutation.isPending}
              data-testid="button-get-guidance"
            >
              {guidanceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting guidance...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Guidance
                </>
              )}
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!currentResponse.trim() || isComplete}
              className="flex-1"
              data-testid="button-next-step"
            >
              {currentStep === SIX_FS_STEPS.length - 1 ? 'Complete Protocol' : 'Next Step'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* AI Guidance */}
          {aiGuidance && (
            <>
              <Separator />
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Therapeutic Guidance
                </h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-ai-guidance">
                  {aiGuidance.guidance}
                </p>
                {aiGuidance.citations.length > 0 && (
                  <div className="pt-2 border-t border-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Sources:</p>
                    {aiGuidance.citations.slice(0, 2).map((citation, index) => (
                      <a
                        key={index}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline block"
                      >
                        {citation}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Previous Responses */}
      {Object.keys(responses).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(responses).map(([stepIndex, response]) => {
              const stepData = SIX_FS_STEPS[parseInt(stepIndex)];
              return (
                <div key={stepIndex} className="border-l-2 border-primary/20 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-3 h-3 text-primary" />
                    <span className="text-sm font-semibold">{stepData.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground" data-testid={`response-${stepIndex}`}>
                    {response}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Check className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Protocol Complete!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You've successfully completed the 6 F's Protocol. Consider moving to unburdening work if an exile was identified.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
