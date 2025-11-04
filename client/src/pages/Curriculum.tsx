import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Lightbulb,
  Users,
  Heart,
  Zap,
  Target
} from "lucide-react";
import { curriculumModules, checkPrerequisites, type CurriculumModule } from "@/lib/curriculumData";

const categoryIcons: Record<string, typeof BookOpen> = {
  introduction: BookOpen,
  parts_system: Users,
  self_leadership: Heart,
  protocols: Target,
  unburdening: Lightbulb,
  integration: Zap,
};

const categoryColors: Record<string, string> = {
  introduction: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  parts_system: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  self_leadership: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  protocols: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  unburdening: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
  integration: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
};

export default function Curriculum() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  // Load completed modules from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`curriculum-progress-${user?.id}`);
    if (stored) {
      try {
        setCompletedModules(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load curriculum progress:', error);
        localStorage.removeItem(`curriculum-progress-${user?.id}`);
        setCompletedModules([]);
      }
    }
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  const sortedModules = [...curriculumModules].sort((a, b) => a.order - b.order);

  const getModuleStatus = (module: CurriculumModule) => {
    const isCompleted = completedModules.includes(module.id);
    const hasPrerequisites = module.prerequisites && module.prerequisites.length > 0;
    const prerequisitesMet = checkPrerequisites(module.id, completedModules);

    if (isCompleted) return "completed";
    if (hasPrerequisites && !prerequisitesMet) return "locked";
    return "available";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" data-testid="icon-completed" />;
      case "locked":
        return <Lock className="w-5 h-5 text-muted-foreground" data-testid="icon-locked" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" data-testid="icon-available" />;
    }
  };

  const totalModules = curriculumModules.length;
  const completedCount = completedModules.length;
  const overallProgress = (completedCount / totalModules) * 100;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AppHeader
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
              IFS Learning Curriculum
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              A comprehensive journey through Internal Family Systems therapy, structured as Learn → Activity → Result
            </p>

            {/* Overall progress */}
            <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg" data-testid="text-overall-progress">
                      Overall Progress
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {completedCount} of {totalModules} modules completed
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary" data-testid="text-progress-percent">
                    {Math.round(overallProgress)}%
                  </div>
                </div>
                <Progress value={overallProgress} className="h-3" data-testid="progress-overall" />
              </CardContent>
            </Card>
          </div>

          {/* Learning path description */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  How This Curriculum Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base">
                  Each module follows a proven <strong>Learn → Activity → Result</strong> structure that builds your understanding step by step:
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">1. Learn</p>
                      <p className="text-sm text-muted-foreground">
                        Study rich educational content about each IFS concept
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-teal-500/5">
                    <Target className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">2. Activity</p>
                      <p className="text-sm text-muted-foreground">
                        Apply what you learned through guided reflection and exercises
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/5">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">3. Result</p>
                      <p className="text-sm text-muted-foreground">
                        See your progress and receive guidance for next steps
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  For example, in Module 2, you'll learn about Manager parts, then identify your own managers through activities, and finally see your complete Parts Map emerge step by step.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Module list */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold" data-testid="text-modules-header">
              Learning Modules
            </h2>

            <div className="grid gap-6">
              {sortedModules.map((module) => {
                const status = getModuleStatus(module);
                const Icon = categoryIcons[module.category] || BookOpen;
                const isLocked = status === "locked";

                return (
                  <Card
                    key={module.id}
                    className={`transition-all ${
                      isLocked ? "opacity-60" : "hover-elevate"
                    }`}
                    data-testid={`card-module-${module.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${categoryColors[module.category]}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className={categoryColors[module.category]} data-testid={`badge-category-${module.id}`}>
                                {module.category.replace("_", " ")}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground" data-testid={`text-duration-${module.id}`}>
                                  {module.estimatedMinutes} min
                                </span>
                              </div>
                            </div>
                            <CardTitle className="text-xl mb-2" data-testid={`text-title-${module.id}`}>
                              {module.title}
                            </CardTitle>
                            <CardDescription className="text-base" data-testid={`text-description-${module.id}`}>
                              {module.description}
                            </CardDescription>
                            
                            {/* Module structure preview */}
                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{module.steps.length} steps:</span>
                              <div className="flex items-center gap-1">
                                {module.steps.map((step, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-2 py-1 rounded text-xs ${
                                      step.type === "learn"
                                        ? "bg-primary/10"
                                        : step.type === "activity"
                                        ? "bg-teal-500/10"
                                        : "bg-orange-500/10"
                                    }`}
                                    data-testid={`badge-step-type-${idx}`}
                                  >
                                    {step.type}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Prerequisites */}
                            {module.prerequisites && module.prerequisites.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-muted-foreground">
                                  Requires: {module.prerequisites.map(id => {
                                    const prereq = curriculumModules.find(m => m.id === id);
                                    return prereq?.title.replace("Module ", "");
                                  }).join(", ")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {getStatusIcon(status)}
                          {!isLocked && (
                            <Link href={`/curriculum/${module.id}`}>
                              <Button
                                size="sm"
                                variant={status === "completed" ? "outline" : "default"}
                                data-testid={`button-start-${module.id}`}
                              >
                                {status === "completed" ? "Review" : "Start"}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          )}
                          {isLocked && (
                            <Button size="sm" disabled data-testid={`button-locked-${module.id}`}>
                              <Lock className="h-4 w-4 mr-2" />
                              Locked
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
