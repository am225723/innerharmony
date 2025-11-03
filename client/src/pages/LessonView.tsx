import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Lesson, LessonActivity, LessonProgress } from "@shared/schema";

export default function LessonView() {
  const [, params] = useRoute("/lessons/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const lessonId = params?.id;

  const [expandedActivities, setExpandedActivities] = useState<Set<string>>(new Set());
  const [activityResponses, setActivityResponses] = useState<Record<string, string>>({});

  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) throw new Error("Failed to fetch lesson");
      return response.json();
    },
    enabled: !!lessonId,
  });

  const { data: activities = [] } = useQuery<LessonActivity[]>({
    queryKey: ["/api/lessons", lessonId, "activities"],
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}/activities`);
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
    enabled: !!lessonId,
  });

  const { data: progress } = useQuery<LessonProgress>({
    queryKey: ["/api/lesson-progress", user.id, lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/lesson-progress?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      const allProgress: LessonProgress[] = await response.json();
      return allProgress.find((p) => p.lessonId === lessonId);
    },
    enabled: !!lessonId,
  });

  const startLessonMutation = useMutation({
    mutationFn: async () => {
      if (progress) return progress;
      return apiRequest("POST", "/api/lesson-progress", {
        userId: user.id,
        lessonId,
        status: "in_progress",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-progress"] });
    },
  });

  const completeActivityMutation = useMutation({
    mutationFn: async (activityId: string) => {
      if (!progress) {
        const newProgress = await apiRequest("POST", "/api/lesson-progress", {
          userId: user.id,
          lessonId,
          status: "in_progress",
          activitiesCompleted: [activityId],
        });
        return newProgress;
      }
      
      const updatedCompleted = [...(progress.activitiesCompleted || []), activityId];
      const allActivitiesCompleted = updatedCompleted.length === activities.length;
      
      return apiRequest("PATCH", `/api/lesson-progress/${progress.id}`, {
        activitiesCompleted: updatedCompleted,
        status: allActivitiesCompleted ? "completed" : "in_progress",
        completedAt: allActivitiesCompleted ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-progress"] });
      toast({
        title: "Activity completed!",
        description: "Your progress has been saved.",
      });
    },
  });

  const toggleActivity = (activityId: string) => {
    setExpandedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(activityId)) {
        next.delete(activityId);
      } else {
        next.add(activityId);
      }
      return next;
    });
  };

  const handleCompleteActivity = (activityId: string) => {
    completeActivityMutation.mutate(activityId);
  };

  const isActivityCompleted = (activityId: string) => {
    return progress?.activitiesCompleted?.includes(activityId) || false;
  };

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto p-6">
          <p className="text-muted-foreground">Loading lesson...</p>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto p-6">
          <p className="text-muted-foreground">Lesson not found</p>
        </main>
      </div>
    );
  }

  const content = lesson.content as any;
  const sections = content?.sections || [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-6 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/lessons")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                <CardDescription className="text-base">{lesson.description}</CardDescription>
              </div>
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {lesson.estimatedMinutes && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.estimatedMinutes} min
                </Badge>
              )}
              {progress?.status === "completed" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              {progress?.status === "in_progress" && (
                <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                  In Progress
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {sections.map((section: any, index: number) => (
          <Card key={index} className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {section.paragraphs?.map((paragraph: string, pIndex: number) => (
                  <p key={pIndex} className="mb-4 text-foreground">{paragraph}</p>
                ))}
                {section.bulletPoints && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.bulletPoints.map((point: string, bIndex: number) => (
                      <li key={bIndex} className="text-foreground">{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {activities.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Interactive Activities</h2>
            {activities
              .sort((a, b) => parseInt(a.order) - parseInt(b.order))
              .map((activity) => {
                const isCompleted = isActivityCompleted(activity.id);
                const isExpanded = expandedActivities.has(activity.id);
                const activityContent = activity.content as any;

                return (
                  <Card key={activity.id} data-testid={`activity-${activity.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {activity.title}
                          </CardTitle>
                          <CardDescription className="mt-2">{activity.description}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActivity(activity.id)}
                          data-testid={`button-toggle-${activity.id}`}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="space-y-4">
                        {activityContent?.prompt && (
                          <div className="p-4 rounded-lg bg-muted">
                            <p className="text-sm font-medium mb-2">Reflection Prompt:</p>
                            <p className="text-foreground">{activityContent.prompt}</p>
                          </div>
                        )}
                        {activityContent?.questions && (
                          <div className="space-y-3">
                            {activityContent.questions.map((question: string, qIndex: number) => (
                              <div key={qIndex}>
                                <p className="text-sm font-medium mb-2">{question}</p>
                                <Textarea
                                  placeholder="Your response..."
                                  value={activityResponses[`${activity.id}-${qIndex}`] || ""}
                                  onChange={(e) =>
                                    setActivityResponses((prev) => ({
                                      ...prev,
                                      [`${activity.id}-${qIndex}`]: e.target.value,
                                    }))
                                  }
                                  data-testid={`textarea-response-${activity.id}-${qIndex}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {!isCompleted && (
                          <Button
                            onClick={() => handleCompleteActivity(activity.id)}
                            disabled={completeActivityMutation.isPending}
                            data-testid={`button-complete-${activity.id}`}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark as Complete
                          </Button>
                        )}
                        {isCompleted && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
          </div>
        )}

        {!progress && (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Button
                onClick={() => startLessonMutation.mutate()}
                disabled={startLessonMutation.isPending}
                data-testid="button-start-lesson"
              >
                Start This Lesson
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
