import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { type User, type Session, type Activity, type AIInsight } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: [`/api/sessions?userId=${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: [`/api/activities?userId=${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: aiInsights = [], isLoading: insightsLoading } = useQuery<AIInsight[]>({
    queryKey: [`/api/ai-insights?userId=${user?.id}`],
    enabled: !!user?.id,
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  if (sessionsLoading || activitiesLoading || insightsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <DashboardOverview
        user={user}
        sessions={sessions}
        activities={activities}
        aiInsights={aiInsights}
      />
    </div>
  );
}
