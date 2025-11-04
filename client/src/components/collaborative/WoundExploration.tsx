import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { HeartCrack, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { fiveChildhoodWounds } from '@/lib/ifsKnowledge';

const SYMPTOM_CHECKLIST = [
  'Feeling unworthy or unlovable',
  'Fear of abandonment',
  'Difficulty trusting others',
  'Perfectionism or controlling behaviors',
  'Feeling invisible or unseen',
  'Chronic shame or guilt',
  'People-pleasing patterns',
  'Difficulty setting boundaries',
  'Fear of rejection',
  'Hypervigilance',
];

interface WoundExplorationProps {
  sessionId: string;
  currentUserRole: 'therapist' | 'client';
}

export default function WoundExploration({ sessionId, currentUserRole }: WoundExplorationProps) {
  const [description, setDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [woundResult, setWoundResult] = useState<{
    woundType: string;
    explanation: string;
    healingPath: string;
    citations: string[];
  } | null>(null);

  const identifyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/ai/wound-identification', {
        description,
        symptoms: selectedSymptoms,
      });
    },
    onSuccess: (data) => {
      setWoundResult(data);
    },
  });

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleIdentify = () => {
    if (!description.trim()) {
      return;
    }
    identifyMutation.mutate();
  };

  const identifiedWound = fiveChildhoodWounds.find(w => 
    w.name.toLowerCase().includes(woundResult?.woundType.toLowerCase() || '')
  );

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartCrack className="w-5 h-5 text-primary" />
            Childhood Wound Exploration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe a painful pattern or recurring experience
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What keeps happening in your relationships or life? What triggers intense reactions?"
              className="min-h-[120px]"
              data-testid="input-wound-description"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">
              Check symptoms you recognize (optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SYMPTOM_CHECKLIST.map((symptom, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    id={`symptom-${index}`}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                    data-testid={`checkbox-symptom-${index}`}
                  />
                  <label
                    htmlFor={`symptom-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleIdentify}
            disabled={!description.trim() || identifyMutation.isPending}
            className="w-full"
            data-testid="button-identify-wound"
          >
            {identifyMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing pattern...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Identify Wound Pattern
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {woundResult && (
        <>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    Identified Wound
                  </CardTitle>
                  <Badge variant="secondary" className="text-base" data-testid="badge-wound-type">
                    {woundResult.woundType}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-wound-explanation">
                  {woundResult.explanation}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Healing Path</h4>
                <p className="text-sm text-muted-foreground" data-testid="text-healing-path">
                  {woundResult.healingPath}
                </p>
              </div>

              {woundResult.citations.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-xs text-muted-foreground">Sources</h4>
                    {woundResult.citations.slice(0, 3).map((citation, index) => (
                      <a
                        key={index}
                        href={citation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline block mb-1"
                      >
                        {citation}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {identifiedWound && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{identifiedWound.name} - Deep Dive</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Description</h4>
                  <p className="text-sm text-muted-foreground">{identifiedWound.description}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Exile Burdens</h4>
                  <ul className="space-y-1">
                    {identifiedWound.exileBurdens.map((burden, index) => (
                      <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/20">
                        "{burden}"
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Common Protectors</h4>
                  <div className="space-y-3">
                    {identifiedWound.commonProtectors.map((protector, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {protector.type}
                          </Badge>
                          <span className="font-semibold text-sm">{protector.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          <strong>Strategy:</strong> {protector.strategy}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          "{protector.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Healing Path</h4>
                  <p className="text-sm text-muted-foreground mb-3">{identifiedWound.healingPath}</p>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm">Reparenting Exercise</h4>
                  <p className="text-sm italic" data-testid="text-reparenting-exercise">
                    {identifiedWound.reparentingExercise}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!woundResult && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <HeartCrack className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Describe a painful pattern to begin the exploration.
              </p>
              <p className="text-xs mt-2">
                This process uses AI to identify which of the 5 core childhood wounds may be present.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
