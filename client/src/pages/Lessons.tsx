import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle2, Circle } from "lucide-react";
import { Link } from "wouter";
import type { Lesson, LessonProgress } from "@shared/schema";

const categoryColors: Record<string, string> = {
  introduction: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  understanding_parts: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  self_leadership: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
  unburdening: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20",
  advanced: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
};

const categoryLabels: Record<string, string> = {
  introduction: "Introduction",
  understanding_parts: "Understanding Parts",
  self_leadership: "Self-Leadership",
  unburdening: "Unburdening",
  advanced: "Advanced Concepts",
};

export default function Lessons() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: progress = [] } = useQuery<LessonProgress[]>({
    queryKey: ["/api/lesson-progress", user.id],
    queryFn: async () => {
      const response = await fetch(`/api/lesson-progress?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      return response.json();
    },
  });

  const getLessonProgress = (lessonId: string) => {
    return progress.find((p) => p.lessonId === lessonId);
  };

  const getStatusIcon = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId);
    if (!lessonProgress || lessonProgress.status === "not_started") {
      return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
    if (lessonProgress.status === "completed") {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    return <Circle className="w-5 h-5 text-blue-600 fill-blue-600" />;
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  const stats = {
    total: lessons.length,
    completed: progress.filter((p) => p.status === "completed").length,
    inProgress: progress.filter((p) => p.status === "in_progress").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Learning Library</h1>
          <p className="text-muted-foreground">
            Explore educational lessons about Internal Family Systems therapy
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card data-testid="card-total-lessons">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-lessons">{stats.total}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-completed-lessons">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-completed-lessons">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card data-testid="card-in-progress-lessons">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Circle className="w-4 h-4 text-blue-600 fill-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-in-progress-lessons">{stats.inProgress}</div>
            </CardContent>
          </Card>
        </div>

        {lessonsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No lessons available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLessons).map(([category, categoryLessons]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4">{categoryLabels[category] || category}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryLessons
                    .sort((a, b) => parseInt(a.order) - parseInt(b.order))
                    .map((lesson) => {
                      const lessonProgress = getLessonProgress(lesson.id);
                      return (
                        <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                          <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`lesson-${lesson.id}`}>
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                                  <CardDescription>{lesson.description}</CardDescription>
                                </div>
                                {getStatusIcon(lesson.id)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge 
                                  variant="outline" 
                                  className={categoryColors[lesson.category]}
                                  data-testid={`badge-category-${lesson.id}`}
                                >
                                  {categoryLabels[lesson.category] || lesson.category}
                                </Badge>
                                {lesson.estimatedMinutes && (
                                  <Badge variant="outline" className="gap-1" data-testid={`badge-duration-${lesson.id}`}>
                                    <Clock className="w-3 h-3" />
                                    {lesson.estimatedMinutes} min
                                  </Badge>
                                )}
                                {lessonProgress?.status === "in_progress" && (
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20">
                                    In Progress
                                  </Badge>
                                )}
                                {lessonProgress?.status === "completed" && (
                                  <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
