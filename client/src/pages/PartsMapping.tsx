import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { PartsCanvas } from "@/components/parts/PartsCanvas";
import { AIInsights } from "@/components/AIInsights";
import { type User, type Part } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function PartsMapping() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: parts = [], isLoading } = useQuery<Part[]>({
    queryKey: [`/api/parts?userId=${user?.id}`],
    enabled: !!user?.id,
  });

  const addPartMutation = useMutation({
    mutationFn: async (newPart: Omit<Part, "id" | "createdAt" | "userId">) => {
      const response = await apiRequest("POST", "/api/parts", {
        ...newPart,
        userId: user!.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/parts?userId=${user?.id}`] });
      toast({
        title: "Part added",
        description: "Your part has been added to the map.",
      });
    },
  });

  const updatePartMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Part> }) => {
      const response = await apiRequest("PATCH", `/api/parts/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/parts?userId=${user?.id}`] });
    },
  });

  const deletePartMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/parts/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/parts?userId=${user?.id}`] });
      toast({
        title: "Part removed",
        description: "The part has been removed from your map.",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading parts map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-hidden">
          <PartsCanvas
            parts={parts}
            onAddPart={(part) => addPartMutation.mutate(part)}
            onUpdatePart={(id, updates) => updatePartMutation.mutate({ id, updates })}
            onDeletePart={(id) => deletePartMutation.mutate(id)}
          />
        </div>
        
        {/* AI Insights Sidebar */}
        {showInsights ? (
          <div className="w-96 border-l bg-card p-6 overflow-y-auto">
            <div className="space-y-4">
              <AIInsights variant="parts-analysis" userId={user.id} />
              <AIInsights variant="ask-question" userId={user.id} />
              <Button
                variant="outline"
                onClick={() => setShowInsights(false)}
                className="w-full"
                data-testid="button-hide-insights"
              >
                Hide Insights
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              onClick={() => setShowInsights(true)}
              size="lg"
              className="shadow-lg"
              data-testid="button-show-insights"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              AI Insights
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
