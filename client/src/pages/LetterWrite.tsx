import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { LetterWriting } from "@/components/activities/LetterWriting";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function LetterWrite() {
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
    mutationFn: async (letter: string) => {
      const response = await apiRequest("POST", "/api/journal-entries", {
        userId: user!.id,
        sessionId: null,
        partId: null,
        protocol: "letter",
        step: null,
        content: letter,
        responses: { letter },
      });
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [`/api/journal-entries?userId=${user?.id}`] });
      await queryClient.invalidateQueries({ queryKey: [`/api/activities?userId=${user?.id}`] });
      
      toast({
        title: "Letter Saved",
        description: "Your compassionate message has been saved.",
      });
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const handleSave = (letter: string) => {
    saveMutation.mutate(letter);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      <LetterWriting onSave={handleSave} />
    </div>
  );
}
