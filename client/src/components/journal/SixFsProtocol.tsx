import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Check } from "lucide-react";

interface SixFsProtocolProps {
  onComplete: (responses: Record<string, string>) => void;
  initialResponses?: Record<string, string>;
}

const STEPS = [
  {
    id: "find",
    title: "Find",
    question: "Turn your attention inward. Where do you notice the anxious part in or around your body?",
    placeholder: "e.g., a tightness in my chest, a knot in my stomach...",
    guidance: "Take a moment to scan your body. Notice any sensations, tensions, or areas of discomfort.",
  },
  {
    id: "focus",
    title: "Focus",
    question: "Focus your attention on this part. What do you notice as you stay with it?",
    placeholder: "Describe what you observe about this part...",
    guidance: "Stay present with the part in a mindful, open way. Just observe without judgment.",
  },
  {
    id: "flesh-out",
    title: "Flesh Out",
    question: "What does this part look like? Does it have a shape, color, age? What emotions does it carry?",
    placeholder: "Describe the characteristics of this part...",
    guidance: "Use your imagination. The part may appear as an image, a feeling, or just a sense.",
  },
  {
    id: "feel-toward",
    title: "Feel Toward",
    question: "How do you feel toward this anxious part right now?",
    placeholder: "e.g., curious, annoyed, frustrated, compassionate...",
    guidance: "If you feel anything other than curiosity or compassion, another part has stepped in. Acknowledge it and gently ask it to step back.",
  },
  {
    id: "befriend",
    title: "beFriend",
    question: "From a place of curiosity, ask the part: What is your job? How long have you been doing this? What do you want me to know?",
    placeholder: "Write what the part tells you...",
    guidance: "Listen with genuine curiosity. This validates the part and honors its positive intention.",
  },
  {
    id: "fear",
    title: "Fear",
    question: "Ask the part: What are you afraid would happen if you stopped doing this job?",
    placeholder: "The part's answer will reveal the exile it's protecting...",
    guidance: "This is the most crucial step. The part's fear points directly to the wound that needs healing.",
  },
];

export function SixFsProtocol({ onComplete, initialResponses = {} }: SixFsProtocolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>(initialResponses);
  const [showAiInsight, setShowAiInsight] = useState(false);

  const currentStepData = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const isLastStep = currentStep === STEPS.length - 1;
  const canProceed = responses[currentStepData.id]?.trim().length > 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(responses);
    } else {
      setCurrentStep(currentStep + 1);
      setShowAiInsight(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowAiInsight(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">The 6 F's Protocol</h1>
        <p className="text-muted-foreground">
          A compassionate journey to befriend your protective parts
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="shadow-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="w-fit">
              {currentStepData.title}
            </Badge>
            {currentStep === STEPS.length - 1 && (
              <Badge variant="outline" className="gap-1">
                <Heart className="w-3 h-3" />
                Final Step
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-display leading-relaxed">
            {currentStepData.question}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {currentStepData.guidance}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={responses[currentStepData.id] || ""}
            onChange={(e) =>
              setResponses({ ...responses, [currentStepData.id]: e.target.value })
            }
            placeholder={currentStepData.placeholder}
            rows={6}
            className="resize-none text-base leading-relaxed"
            data-testid={`textarea-${currentStepData.id}`}
          />

          {canProceed && !showAiInsight && (
            <Button
              variant="outline"
              onClick={() => setShowAiInsight(true)}
              className="w-full gap-2"
              data-testid="button-get-insight"
            >
              <Sparkles className="w-4 h-4" />
              Get AI Insight
            </Button>
          )}

          {showAiInsight && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 animate-slide-up">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-2 flex-1">
                  <p className="font-medium text-sm">AI Insight</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your response shows deep awareness of this part's protective role. 
                    Consider how long this part has been working to keep you safe. 
                    What would it be like to thank this part for its dedication while 
                    gently asking if it's willing to trust your Self to lead?
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="gap-2"
          data-testid="button-previous"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="gap-2"
          data-testid={isLastStep ? "button-complete" : "button-next"}
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
