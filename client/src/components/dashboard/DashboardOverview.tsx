import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AIInsights } from "@/components/AIInsights";
import {
  Activity,
  BookOpen,
  Calendar,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  Brain,
  Flame,
  Shield,
  Plus,
  Loader2,
  Lightbulb,
  Target,
  ArrowRight,
  GraduationCap,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { type User, type Session as SessionType, type Activity as ActivityType, type AIInsight } from "@shared/schema";
import { curriculumModules } from "@/lib/curriculumData";
import { eightCsOfSelf, dailyIFSPractices, fiveChildhoodWounds, ifsFoundations } from "@/lib/ifsKnowledge";

interface DashboardOverviewProps {
  user: User;
  sessions: SessionType[];
  activities: ActivityType[];
  aiInsights?: AIInsight[];
  onCreateSession?: () => void;
  onViewActivity?: (activityId: string) => void;
}

export function DashboardOverview({
  user,
  sessions,
  activities,
  aiInsights = [],
  onCreateSession,
  onViewActivity,
}: DashboardOverviewProps) {
  const { toast } = useToast();
  const [curriculumProgress, setCurriculumProgress] = useState(0);
  
  const activeSessions = sessions.filter(s => s.status === "active");
  const completedActivities = activities.filter(a => a.status === "completed");
  const activityCompletionRate = activities.length > 0 
    ? Math.round((completedActivities.length / activities.length) * 100) 
    : 0;

  // Load curriculum progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`curriculum-progress-${user.id}`);
    if (stored) {
      try {
        const completedModules = JSON.parse(stored);
        const totalModules = curriculumModules.length;
        const progress = totalModules > 0 
          ? Math.round((completedModules.length / totalModules) * 100)
          : 0;
        setCurriculumProgress(progress);
      } catch (error) {
        console.error('Failed to load curriculum progress:', error);
        setCurriculumProgress(0);
      }
    }
  }, [user.id]);

  // Calculate overall journey progress combining activities and curriculum
  const journeyProgress = Math.round((activityCompletionRate + curriculumProgress) / 2);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "parts_mapping": return Shield;
      case "six_fs": return BookOpen;
      case "meditation": return Heart;
      case "witnessing": return Users;
      case "unburdening": return Flame;
      case "letter_writing": return BookOpen;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "parts_mapping": return "text-primary";
      case "six_fs": return "text-secondary";
      case "meditation": return "text-accent";
      case "witnessing": return "text-chart-3";
      case "unburdening": return "text-chart-4";
      default: return "text-muted-foreground";
    }
  };

  // Get daily insight (rotates based on day of year)
  const getDailyInsight = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const insights = [
      {
        title: "Practice Self-Energy Today",
        content: "When you notice a part activating, pause and ask: 'How do I feel TOWARD this part?' If you notice judgment, ask that judging part to step back so you can be curious instead.",
        cQuality: "Curiosity"
      },
      {
        title: "All Parts Are Welcome",
        content: "There are no bad parts. Even your inner critic is trying to protect you. Today, thank one of your protector parts for working so hard on your behalf.",
        cQuality: "Compassion"
      },
      {
        title: "You Are Not Your Parts",
        content: "Remember: You have parts, but you are not your parts. Your core Self is whole, undamaged, and naturally wise. Parts can be healed, but Self is already complete.",
        cQuality: "Clarity"
      },
      {
        title: "Small Steps of Healing",
        content: "Healing doesn't require dramatic breakthroughs. Simply noticing a part, being curious about it, and listening to it with compassion is powerful healing work.",
        cQuality: "Calm"
      },
      {
        title: "Trust Your System",
        content: "Your internal system will only open up at the pace it feels safe. There's no rush. Progress isn't linear. Trust the process and be patient with yourself.",
        cQuality: "Confidence"
      }
    ];
    return insights[dayOfYear % insights.length];
  };

  const dailyInsight = getDailyInsight();

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Welcome back, {user.displayName.split(" ")[0]}
        </h1>
        <p className="text-lg text-muted-foreground">
          Continue your journey of compassionate self-discovery through learning and healing
        </p>
      </div>

      {/* Daily Insight - Featured at Top */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="card-daily-insight">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Today's IFS Insight</CardTitle>
                <CardDescription>Daily wisdom for your healing journey</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {dailyInsight.cQuality}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-semibold text-lg">{dailyInsight.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {dailyInsight.content}
          </p>
          <div className="flex gap-2">
            <Link href="/ifs-library">
              <Button variant="outline" size="sm" data-testid="button-explore-library">
                <BookOpen className="w-4 h-4 mr-2" />
                Explore IFS Library
              </Button>
            </Link>
            <Button variant="outline" size="sm" data-testid="button-daily-practice">
              <Target className="w-4 h-4 mr-2" />
              Today's Practice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-active-sessions">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {sessions.length} total sessions
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-completed-activities">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities Completed</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{completedActivities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activityCompletionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-insights">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
            <Sparkles className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{aiInsights.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {aiInsights.length === 0 ? "No insights yet" : "Personalized guidance available"}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-progress">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journey Progress</CardTitle>
            <Brain className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display font-semibold">{journeyProgress}%</div>
            <Progress value={journeyProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Curriculum: {curriculumProgress}% • Activities: {activityCompletionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display">Recent Activities</CardTitle>
                <CardDescription>Your therapeutic journey continues</CardDescription>
              </div>
              <Activity className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No activities yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start your healing journey with an activity
                </p>
                <Button data-testid="button-start-activity">
                  <Plus className="w-4 h-4 mr-2" />
                  Start Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg hover-elevate active-elevate-2 cursor-pointer border border-transparent hover:border-border"
                      onClick={() => onViewActivity?.(activity.id)}
                      data-testid={`activity-${activity.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : activity.status === "in_progress"
                            ? "secondary"
                            : "outline"
                        }
                        data-testid={`badge-status-${activity.id}`}
                      >
                        {activity.status === "completed" ? "Done" : activity.status === "in_progress" ? "Active" : "Start"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Therapeutic Activities</CardTitle>
            <CardDescription>Choose an activity to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/parts-mapping">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-parts-mapping"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Parts Mapping</p>
                  <p className="text-xs text-muted-foreground">Visualize your internal system</p>
                </div>
              </Button>
            </Link>

            <Link href="/six-fs">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-six-fs"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">6 F's Protocol</p>
                  <p className="text-xs text-muted-foreground">Befriend your anxious parts</p>
                </div>
              </Button>
            </Link>

            <Link href="/parts-dialogue">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-parts-dialogue"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Parts Dialogue Journal</p>
                  <p className="text-xs text-muted-foreground">Write dialogues with AI insights</p>
                </div>
              </Button>
            </Link>

            <Link href="/curriculum">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-curriculum"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">IFS Curriculum</p>
                  <p className="text-xs text-muted-foreground">Comprehensive Learn → Activity → Result modules</p>
                </div>
              </Button>
            </Link>

            <Link href="/ifs-anxiety">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-ifs-anxiety"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">IFS + Anxiety Guide</p>
                  <p className="text-xs text-muted-foreground">Understanding & healing anxiety through IFS</p>
                </div>
              </Button>
            </Link>

            <Link href="/lessons">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-lessons"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Learning Library</p>
                  <p className="text-xs text-muted-foreground">Educational lessons about IFS</p>
                </div>
              </Button>
            </Link>

            <Link href="/media-library">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-media-library"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Multimedia Library</p>
                  <p className="text-xs text-muted-foreground">Meditations, videos & wound mapping</p>
                </div>
              </Button>
            </Link>

            <Link href="/letter">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 gap-3"
                data-testid="button-letter-writing"
              >
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-success" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium">Letter to Inner Child</p>
                  <p className="text-xs text-muted-foreground">Express love and validation</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* AI Q&A Panel */}
        <AIInsights variant="ask-question" userId={user.id} />
      </div>

      {/* Sessions Section for Therapists */}
      {user.role === "therapist" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display">Client Sessions</CardTitle>
                <CardDescription>Manage your therapeutic sessions</CardDescription>
              </div>
              <Button onClick={onCreateSession} data-testid="button-create-session">
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No sessions scheduled</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`session-${session.id}`}
                  >
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={session.status === "active" ? "default" : "outline"}
                      data-testid={`badge-session-status-${session.id}`}
                    >
                      {session.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
