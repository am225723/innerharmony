import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { type User, type Session as SessionType, type Activity as ActivityType, type AIInsight } from "@shared/schema";

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
  const activeSessions = sessions.filter(s => s.status === "active");
  const completedActivities = activities.filter(a => a.status === "completed");
  const completionRate = activities.length > 0 
    ? Math.round((completedActivities.length / activities.length) * 100) 
    : 0;

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

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Welcome back, {user.displayName.split(" ")[0]}
        </h1>
        <p className="text-lg text-muted-foreground">
          Continue your journey of compassionate self-discovery
        </p>
      </div>

      {/* Stats Grid */}
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
              {completionRate}% completion rate
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
            <div className="text-3xl font-display font-semibold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
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

            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 gap-3"
              data-testid="button-meditation"
              disabled
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium">Inner Child Meditation</p>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </div>
            </Button>

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
