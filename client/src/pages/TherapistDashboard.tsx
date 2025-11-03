import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Users, Calendar, Activity, Plus, UserCheck, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import type { User, Session } from "@shared/schema";

export default function TherapistDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    setLocation("/login");
    return null;
  }
  const user = JSON.parse(userStr);

  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["/api/sessions", user.id],
    queryFn: async () => {
      const response = await fetch(`/api/sessions?userId=${user.id}`);
      return response.json();
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: clients = [] } = useQuery<User[]>({
    queryKey: ["/api/users", "client", user.id],
    queryFn: async () => {
      const response = await fetch(`/api/users?role=client&requestingUserId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      return response.json();
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: { therapistId: string; clientId: string; title: string }) => {
      return apiRequest("POST", "/api/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session created",
        description: "New therapy session has been scheduled.",
      });
      setShowCreateSession(false);
      setSessionTitle("");
      setSelectedClient("");
    },
    onError: () => {
      toast({
        title: "Failed to create session",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateSession = () => {
    if (!sessionTitle || !selectedClient) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    createSessionMutation.mutate({
      therapistId: user.id,
      clientId: selectedClient,
      title: sessionTitle,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const activeSessionsCount = sessions.filter(s => s.status === "active").length;
  const scheduledSessionsCount = sessions.filter(s => s.status === "scheduled").length;
  const completedSessionsCount = sessions.filter(s => s.status === "completed").length;
  const totalClients = clients.length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground mb-2">
              Therapist Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your clients and therapeutic sessions
            </p>
          </div>
          <Button onClick={() => setShowCreateSession(true)} data-testid="button-create-session">
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-total-clients">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-total-clients">{totalClients}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unique active clients
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-active-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-active-sessions">{activeSessionsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-scheduled-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-scheduled-sessions">{scheduledSessionsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Upcoming sessions
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-completed-sessions">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" data-testid="text-completed-sessions">{completedSessionsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total completed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Recent Sessions</CardTitle>
              <CardDescription>Your latest therapeutic sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-2">No sessions yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first session to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => {
                    const client = clients.find(c => c.id === session.clientId);
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                        onClick={() => setLocation(`/session/${session.id}`)}
                        data-testid={`session-${session.id}`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {client ? client.displayName : "Unknown client"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={session.status === "active" ? "default" : session.status === "completed" ? "secondary" : "outline"}
                          data-testid={`badge-session-status-${session.id}`}
                        >
                          {session.status === "active" && <Activity className="w-3 h-3 mr-1" />}
                          {session.status === "scheduled" && <Clock className="w-3 h-3 mr-1" />}
                          {session.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {session.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                          {session.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Client Directory</CardTitle>
              <CardDescription>All registered clients</CardDescription>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserCheck className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No clients registered</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.slice(0, 5).map((client) => {
                    const clientSessions = sessions.filter(s => s.clientId === client.id);
                    return (
                      <Link key={client.id} href={`/clients/${client.id}`}>
                        <div
                          className="flex items-center justify-between p-4 rounded-lg border hover-elevate active-elevate-2 cursor-pointer"
                          data-testid={`client-${client.id}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{client.displayName}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              @{client.username}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" data-testid={`badge-client-sessions-${client.id}`}>
                              {clientSessions.length} sessions
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showCreateSession} onOpenChange={setShowCreateSession}>
        <DialogContent data-testid="dialog-create-session">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
            <DialogDescription>
              Schedule a new therapy session with a client
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="session-title">Session Title</Label>
              <Input
                id="session-title"
                data-testid="input-session-title"
                placeholder="e.g., Initial Assessment, Parts Mapping Session"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-select">Select Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger id="client-select" data-testid="select-client">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id} data-testid={`option-client-${client.id}`}>
                      {client.displayName} (@{client.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateSession(false)} data-testid="button-cancel-session">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSession} 
              disabled={createSessionMutation.isPending}
              data-testid="button-submit-session"
            >
              {createSessionMutation.isPending ? "Creating..." : "Create Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
