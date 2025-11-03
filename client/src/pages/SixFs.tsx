import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { SixFsProtocol } from "@/components/journal/SixFsProtocol";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function SixFs() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const saveMutation = useMutation({
    mutationFn: async (responses: Record<string, string>) => {
      const response = await apiRequest("POST", "/api/journal-entries", {
        userId: user!.id,
        sessionId: null,
        partId: null,
        protocol: "six_fs",
        step: null,
        content: JSON.stringify(responses),
        responses,
      });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/journal-entries?userId=${user?.id}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/activities?userId=${user?.id}`] });
      
      toast({
        title: "Protocol Complete",
        description: "Your 6 F's journey has been saved.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const handleComplete = (responses: Record<string, string>) => {
    saveMutation.mutate(responses);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <SixFsProtocol onComplete={handleComplete} />
    </div>
  );
}
