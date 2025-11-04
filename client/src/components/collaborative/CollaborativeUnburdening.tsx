import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, ArrowRight, Heart, Flame, Droplets, Sun, Wind, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UNBURDENING_STEPS = [
  { id: 'witness', name: 'Witness the Pain', description: 'See and acknowledge what happened to the exile' },
  { id: 'validate', name: 'Validate the Experience', description: 'Affirm that what happened was real and wrong' },
  { id: 'retrieve', name: 'Retrieve the Exile', description: 'Bring the young part to safety in the present' },
  { id: 'unburden', name: 'Release the Burden', description: 'Let the false beliefs and pain go' },
  { id: 'invite', name: 'Invite New Qualities', description: 'Fill the space with healing qualities' },
];

const ELEMENTS = [
  { id: 'fire', name: 'Fire', icon: Flame, description: 'Burn away the burdens' },
  { id: 'water', name: 'Water', icon: Droplets, description: 'Wash away the pain' },
  { id: 'light', name: 'Light', icon: Sun, description: 'Dissolve in healing light' },
  { id: 'air', name: 'Wind', icon: Wind, description: 'Blow away what no longer serves' },
];

interface CollaborativeUnburdeningProps {
  sessionId: string;
  currentUserRole: 'therapist' | 'client';
}

export default function CollaborativeUnburdening({ sessionId, currentUserRole }: CollaborativeUnburdeningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [burden, setBurden] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('light');
  const [witnessNotes, setWitnessNotes] = useState('');
  const [validationNotes, setValidationNotes] = useState('');
  const [newQualities, setNewQualities] = useState('');
  const [visualization, setVisualization] = useState<{
    visualization: string;
    elements: string[];
    citations: string[];
  } | null>(null);
  const [reparentingPhrases, setReparentingPhrases] = useState<{
    phrases: string[];
    explanation: string;
  } | null>(null);
  const { toast } = useToast();

  const visualizationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/ai/unburdening-visualization-new', { burden });
    },
    onSuccess: (data) => {
      setVisualization(data);
      if (data.elements.length > 0) {
        setSelectedElement(data.elements[0]);
      }
    },
  });

  const reparentingMutation = useMutation({
    mutationFn: async (woundType: string) => {
      return apiRequest('POST', '/api/ai/reparenting-phrases', {
        woundType,
        situation: witnessNotes,
      });
    },
    onSuccess: (data) => {
      setReparentingPhrases(data);
    },
  });

  const handleGetVisualization = () => {
    if (!burden.trim()) {
      toast({
        title: "Burden Required",
        description: "Please describe the burden to unburden.",
        variant: "destructive",
      });
      return;
    }
    visualizationMutation.mutate();
  };

  const handleNextStep = () => {
    if (currentStep < UNBURDENING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Unburdening Complete",
        description: "The unburdening process is complete. May this exile find peace.",
      });
    }
  };

  const step = UNBURDENING_STEPS[currentStep];
  const selectedElementData = ELEMENTS.find(e => e.id === selectedElement);
  const ElementIcon = selectedElementData?.icon || Sun;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unburdening Process</CardTitle>
          <CardDescription>
            A sacred ritual to release burdens and restore the exile to its natural state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            {UNBURDENING_STEPS.map((s, index) => (
              <div key={s.id} className="flex items-center gap-2">
                <Badge
                  variant={index <= currentStep ? 'default' : 'outline'}
                  data-testid={`unburdening-step-${s.id}`}
                >
                  {s.name}
                </Badge>
                {index < UNBURDENING_STEPS.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>{step.name}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What happened to this young part?
                </label>
                <Textarea
                  value={witnessNotes}
                  onChange={(e) => setWitnessNotes(e.target.value)}
                  placeholder="Describe the painful memory or experience..."
                  className="min-h-[120px]"
                  data-testid="input-witness"
                />
              </div>
              <Button onClick={() => reparentingMutation.mutate('abandonment')} variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Get Reparenting Phrases
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Validation Statement (Self to Exile)
              </label>
              <Textarea
                value={validationNotes}
                onChange={(e) => setValidationNotes(e.target.value)}
                placeholder="This was wrong. This should not have happened to you. You didn't deserve this..."
                className="min-h-[120px]"
                data-testid="input-validation"
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Retrieval Visualization</h4>
                <p className="text-sm text-muted-foreground">
                  Imagine going to the scene of the original wound. As your adult Self, pick up this young part and bring them to the present day. Show them they are safe now.
                </p>
              </div>
              <Textarea
                placeholder="Describe the retrieval experience..."
                className="min-h-[120px]"
                data-testid="input-retrieval"
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  What burden does this exile carry?
                </label>
                <Input
                  value={burden}
                  onChange={(e) => setBurden(e.target.value)}
                  placeholder='E.g., "I am unlovable", "I am worthless", "I am bad"...'
                  data-testid="input-burden"
                />
              </div>

              {!visualization && (
                <Button
                  onClick={handleGetVisualization}
                  variant="outline"
                  disabled={!burden.trim() || visualizationMutation.isPending}
                  data-testid="button-get-visualization"
                >
                  {visualizationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating visualization...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get AI Visualization
                    </>
                  )}
                </Button>
              )}

              {visualization && (
                <>
                  <Separator />
                  <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Unburdening Visualization
                    </h4>
                    <p className="text-sm leading-relaxed" data-testid="text-visualization">
                      {visualization.visualization}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Choose your element
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ELEMENTS.map((element) => {
                        const Icon = element.icon;
                        return (
                          <Card
                            key={element.id}
                            className={`cursor-pointer hover-elevate ${
                              selectedElement === element.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            onClick={() => setSelectedElement(element.id)}
                            data-testid={`element-${element.id}`}
                          >
                            <CardContent className="p-4 flex items-center gap-3">
                              <Icon className="w-5 h-5 text-primary" />
                              <div>
                                <div className="font-semibold text-sm">{element.name}</div>
                                <div className="text-xs text-muted-foreground">{element.description}</div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                    <ElementIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Release with {selectedElementData?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Visualize the burden "{burden}" being {selectedElementData?.description.toLowerCase()}.
                        Watch it dissolve completely, leaving the exile light and free.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Invitation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Now that the burden is gone, what positive qualities would this part like to have instead?
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Examples: joy, peace, playfulness, confidence, belonging, worthiness...
                </p>
              </div>

              <Textarea
                value={newQualities}
                onChange={(e) => setNewQualities(e.target.value)}
                placeholder="List the qualities this exile wants to embody..."
                className="min-h-[100px]"
                data-testid="input-new-qualities"
              />
            </div>
          )}

          {reparentingPhrases && currentStep === 0 && (
            <>
              <Separator />
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Reparenting Phrases (Self to Exile)
                </h4>
                <ul className="space-y-2">
                  {reparentingPhrases.phrases.map((phrase, index) => (
                    <li key={index} className="text-sm pl-4 border-l-2 border-primary/20" data-testid={`phrase-${index}`}>
                      "{phrase}"
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <Button
            onClick={handleNextStep}
            className="w-full"
            data-testid="button-next-unburdening-step"
          >
            {currentStep === UNBURDENING_STEPS.length - 1 ? 'Complete Unburdening' : 'Next Step'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
