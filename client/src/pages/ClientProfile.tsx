import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, Calendar, Heart, FileText, Activity as ActivityIcon, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/layout/AppHeader";
import type { User, Part, JournalEntry, Activity, Session } from "@shared/schema";
import { format } from "date-fns";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [, setLocation] = useLocation();
  
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    setLocation("/login");
    return null;
  }
  const therapist = JSON.parse(userStr);

  if (therapist.role !== "therapist") {
    setLocation("/dashboard");
    return null;
  }

  const { data: client, isLoading: clientLoading } = useQuery<User>({
    queryKey: ["/api/users", clientId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${clientId}?requestingUserId=${therapist.id}`);
      if (!response.ok) throw new Error("Failed to fetch client");
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const { data: parts = [] } = useQuery<Part[]>({
    queryKey: ["/api/parts", clientId],
    queryFn: async () => {
      const response = await fetch(`/api/parts?userId=${clientId}`);
      return response.json();
    },
    enabled: !!clientId,
  });

  const { data: journalEntries = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries", clientId],
    queryFn: async () => {
      const response = await fetch(`/api/journal-entries?userId=${clientId}`);
      return response.json();
    },
    enabled: !!clientId,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities", clientId],
    queryFn: async () => {
      const response = await fetch(`/api/activities?userId=${clientId}`);
      return response.json();
    },
    enabled: !!clientId,
  });

  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions", "client", clientId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions?userId=${therapist.id}`);
      const allSessions = await response.json();
      return allSessions.filter((s: Session) => s.clientId === clientId);
    },
    enabled: !!clientId,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (clientLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={therapist} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading client profile...</div>
        </main>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={therapist} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Client not found</div>
        </main>
      </div>
    );
  }

  const completedActivities = activities.filter(a => a.status === "completed");
  const inProgressActivities = activities.filter(a => a.status === "in_progress");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={therapist} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="button-back-to-dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-semibold" data-testid="text-client-name">
                {client.displayName}
              </h1>
              <p className="text-muted-foreground">@{client.username}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parts Mapped</CardTitle>
              <Heart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-parts-count">{parts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Internal parts identified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-journal-count">{journalEntries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Reflections written</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <ActivityIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-activities-count">{completedActivities.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {inProgressActivities.length} in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-sessions-count">{sessions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="parts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="parts" data-testid="tab-parts">Parts ({parts.length})</TabsTrigger>
            <TabsTrigger value="journal" data-testid="tab-journal">Journal ({journalEntries.length})</TabsTrigger>
            <TabsTrigger value="activities" data-testid="tab-activities">Activities ({activities.length})</TabsTrigger>
            <TabsTrigger value="sessions" data-testid="tab-sessions">Sessions ({sessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="parts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Internal Parts</CardTitle>
                <CardDescription>Client's identified parts from IFS mapping</CardDescription>
              </CardHeader>
              <CardContent>
                {parts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No parts mapped yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {parts.map((part) => (
                      <div
                        key={part.id}
                        className="p-4 rounded-lg border"
                        data-testid={`part-${part.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{part.name}</h3>
                            {part.age && (
                              <p className="text-sm text-muted-foreground">Age: {part.age}</p>
                            )}
                          </div>
                          <Badge variant={
                            part.type === "manager" ? "default" :
                            part.type === "firefighter" ? "secondary" : "outline"
                          }>
                            {part.type}
                          </Badge>
                        </div>
                        {part.emotions && part.emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {part.emotions.map((emotion, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {part.bodyLocation && (
                          <p className="text-sm text-muted-foreground">
                            Body location: {part.bodyLocation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Journal Entries</CardTitle>
                <CardDescription>Client's therapeutic reflections and protocol responses</CardDescription>
              </CardHeader>
              <CardContent>
                {journalEntries.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No journal entries yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {journalEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 rounded-lg border"
                        data-testid={`journal-${entry.id}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline">{entry.protocol}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(entry.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {entry.content && typeof entry.content === 'object' && (
                            <div className="text-sm space-y-1">
                              {Object.entries(entry.content).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-muted-foreground">{key}: </span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Therapeutic Activities</CardTitle>
                <CardDescription>Client's progress through IFS exercises</CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ActivityIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No activities yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-4 rounded-lg border"
                        data-testid={`activity-${activity.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium capitalize">
                              {activity.type.replace(/_/g, " ")}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                            {activity.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Therapy Sessions</CardTitle>
                <CardDescription>Sessions with this client</CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No sessions scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-lg border"
                        data-testid={`session-${session.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{session.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {format(new Date(session.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant={
                            session.status === "active" ? "default" :
                            session.status === "completed" ? "secondary" : "outline"
                          }>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
