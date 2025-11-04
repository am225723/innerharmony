import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  PenTool,
  Trophy,
  Lock,
  Clock
} from "lucide-react";
import {
  curriculumModules,
  getModuleById,
  type CurriculumModule,
  type CurriculumStep,
  type CurriculumSection,
  type CurriculumActivity,
  type CurriculumResult
} from "@/lib/curriculumData";

export default function CurriculumView() {
  const [, params] = useRoute("/curriculum/:moduleId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [activityResponses, setActivityResponses] = useState<Record<string, string>>({});
  const moduleId = params?.moduleId;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user || !moduleId) return null;

  const module = getModuleById(moduleId);
  if (!module) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Module not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStep = module.steps[currentStepIndex];
  const progress = ((completedSteps.size) / module.steps.length) * 100;
  const isStepCompleted = completedSteps.has(currentStepIndex);
  const canGoNext = currentStepIndex < module.steps.length - 1;
  const canGoPrevious = currentStepIndex > 0;

  const handleCompleteStep = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
    
    if (currentStep.type === "result") {
      toast({
        title: "Module Section Completed!",
        description: "You've completed this part of your learning journey.",
      });
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderLearnStep = (data: CurriculumSection) => (
    <Card className="border-primary/20" data-testid="card-learn-step">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="h-6 w-6 text-primary" data-testid="icon-learn" />
          </div>
          <div>
            <Badge variant="outline" className="mb-2" data-testid="badge-step-type">
              Learn
            </Badge>
            <CardTitle className="text-2xl" data-testid="text-learn-title">{data.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main content */}
        <div className="space-y-4">
          {data.content.map((paragraph, idx) => (
            <p key={idx} className="text-base leading-relaxed" data-testid={`text-content-${idx}`}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bullet points */}
        {data.bullets && data.bullets.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg mb-3" data-testid="text-bullets-header">
              Key Points:
            </h3>
            <ul className="space-y-2">
              {data.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3" data-testid={`text-bullet-${idx}`}>
                  <Circle className="h-2 w-2 mt-2 fill-current text-primary flex-shrink-0" />
                  <span className="text-base">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key takeaways */}
        {data.keyTakeaways && data.keyTakeaways.length > 0 && (
          <div className="bg-primary/10 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2" data-testid="text-takeaways-header">
              <Lightbulb className="h-5 w-5" />
              Key Takeaways:
            </h3>
            <ul className="space-y-2">
              {data.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3" data-testid={`text-takeaway-${idx}`}>
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-base font-medium">{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderActivityStep = (data: CurriculumActivity) => (
    <Card className="border-teal-500/20" data-testid="card-activity-step">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <PenTool className="h-6 w-6 text-teal-600" data-testid="icon-activity" />
          </div>
          <div>
            <Badge variant="outline" className="mb-2 border-teal-500/50" data-testid="badge-step-type">
              Activity
            </Badge>
            <CardTitle className="text-2xl" data-testid="text-activity-title">{data.title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-base mt-2" data-testid="text-activity-description">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt */}
        <div className="bg-teal-500/10 rounded-lg p-6">
          <p className="text-base leading-relaxed" data-testid="text-activity-prompt">{data.prompt}</p>
        </div>

        {/* Guided steps if available */}
        {data.guidedSteps && data.guidedSteps.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg" data-testid="text-guided-steps-header">
              Follow These Steps:
            </h3>
            <ol className="space-y-3">
              {data.guidedSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3" data-testid={`text-guided-step-${idx}`}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-base pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg" data-testid="text-questions-header">
            Reflection Questions:
          </h3>
          {data.questions.map((question, idx) => (
            <div key={idx} className="space-y-2">
              <label className="text-base font-medium" data-testid={`text-question-${idx}`}>
                {idx + 1}. {question}
              </label>
              <Textarea
                placeholder="Take your time to reflect and write your response..."
                className="min-h-[100px]"
                value={activityResponses[`${data.id}-${idx}`] || ""}
                onChange={(e) => setActivityResponses(prev => ({
                  ...prev,
                  [`${data.id}-${idx}`]: e.target.value
                }))}
                data-testid={`input-response-${idx}`}
              />
            </div>
          ))}
        </div>

        {/* Activity type badge */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary" data-testid="badge-activity-type">{data.type.replace("_", " ")}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultStep = (data: CurriculumResult) => (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent" data-testid="card-result-step">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Trophy className="h-6 w-6 text-orange-600" data-testid="icon-result" />
          </div>
          <div>
            <Badge variant="outline" className="mb-2 border-orange-500/50" data-testid="badge-step-type">
              Result
            </Badge>
            <CardTitle className="text-2xl" data-testid="text-result-title">{data.title}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-base mt-2" data-testid="text-result-description">
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion message */}
        <div className="bg-orange-500/10 rounded-lg p-6">
          <p className="text-base leading-relaxed font-medium" data-testid="text-completion-message">
            {data.completionMessage}
          </p>
        </div>

        {/* Next steps */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2" data-testid="text-next-steps-header">
            <ArrowRight className="h-5 w-5" />
            Next Steps:
          </h3>
          <ul className="space-y-3">
            {data.nextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3" data-testid={`text-next-step-${idx}`}>
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-orange-600 flex-shrink-0" />
                <span className="text-base">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Celebration */}
        <div className="text-center pt-6 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4">
            <Trophy className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-lg font-semibold text-orange-600" data-testid="text-celebration">
            Great Work!
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep = () => {
    switch (currentStep.type) {
      case "learn":
        return renderLearnStep(currentStep.data as CurriculumSection);
      case "activity":
        return renderActivityStep(currentStep.data as CurriculumActivity);
      case "result":
        return renderResultStep(currentStep.data as CurriculumResult);
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/curriculum">
              <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Modules
              </Button>
            </Link>

            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2" data-testid="badge-module-category">
                  {module.category.replace("_", " ")}
                </Badge>
                <h1 className="text-3xl font-bold mb-2" data-testid="text-module-title">
                  {module.title}
                </h1>
                <p className="text-muted-foreground text-lg" data-testid="text-module-description">
                  {module.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span data-testid="text-estimated-time">{module.estimatedMinutes} min</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium" data-testid="text-progress-label">
                  Progress: {completedSteps.size} of {module.steps.length} steps
                </span>
                <span className="text-muted-foreground" data-testid="text-progress-percent">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} data-testid="progress-bar" />
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {module.steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    idx === currentStepIndex
                      ? "bg-primary/10"
                      : completedSteps.has(idx)
                      ? "bg-muted hover-elevate"
                      : "hover-elevate"
                  }`}
                  data-testid={`button-step-${idx}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completedSteps.has(idx)
                      ? "bg-primary text-primary-foreground"
                      : idx === currentStepIndex
                      ? "bg-primary/20 text-primary"
                      : "bg-muted"
                  }`}>
                    {completedSteps.has(idx) ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : step.type === "learn" ? (
                      <Lightbulb className="h-4 w-4" />
                    ) : step.type === "activity" ? (
                      <PenTool className="h-4 w-4" />
                    ) : (
                      <Trophy className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-xs font-medium capitalize">{step.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current step content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4 pb-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {!isStepCompleted && (
                <Button
                  variant="default"
                  onClick={handleCompleteStep}
                  data-testid="button-complete-step"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              {isStepCompleted && canGoNext && (
                <Button
                  variant="default"
                  onClick={handleNext}
                  data-testid="button-next"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              {isStepCompleted && !canGoNext && (
                <Link href="/curriculum">
                  <Button variant="default" data-testid="button-finish">
                    <Trophy className="h-4 w-4 mr-2" />
                    Finish Module
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
