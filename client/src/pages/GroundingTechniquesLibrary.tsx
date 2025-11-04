import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { groundingTechniques } from "@/lib/ifsAnxietyKnowledge";
import type { GroundingTechniqueProgress } from "@shared/schema";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Music,
  PlayCircle,
  Star,
  History
} from "lucide-react";

export default function GroundingTechniquesLibrary() {
  const { toast } = useToast();
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [effectiveness, setEffectiveness] = useState<string>("5");
  const [notes, setNotes] = useState("");

  // Get current user
  const currentUser = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")!) 
    : null;

  // Fetch user's progress
  const { data: progressData = [] } = useQuery<GroundingTechniqueProgress[]>({
    queryKey: [`/api/grounding-progress?userId=${currentUser?.id}`],
    enabled: !!currentUser?.id,
  });

  // Mark technique as practiced
  const practiceMutation = useMutation({
    mutationFn: async (data: { techniqueName: string; effectiveness: number; notes?: string }) => {
      if (!currentUser?.id) throw new Error("Not authenticated");
      
      const res = await apiRequest('POST', '/api/grounding-progress', {
        userId: currentUser.id,
        techniqueName: data.techniqueName,
        effectiveness: data.effectiveness,
        notes: data.notes,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/grounding-progress?userId=${currentUser.id}`] });
      toast({
        title: "Progress Saved",
        description: "Your grounding technique practice has been recorded.",
      });
      setPracticeDialogOpen(false);
      setNotes("");
      setEffectiveness("5");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save progress",
        variant: "destructive",
      });
    },
  });

  const handleMarkAsPracticed = (techniqueName: string) => {
    setSelectedTechnique(techniqueName);
    setPracticeDialogOpen(true);
  };

  const handleSavePractice = () => {
    if (!selectedTechnique) return;
    
    practiceMutation.mutate({
      techniqueName: selectedTechnique,
      effectiveness: parseInt(effectiveness),
      notes: notes.trim() || undefined,
    });
  };

  const getTechniqueProgress = (techniqueName: string) => {
    return progressData.find(p => p.techniqueName === techniqueName);
  };

  // Authentication guard
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access the Grounding Techniques Library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" data-testid="button-login">
              <Link href="/">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href="/ifs-anxiety">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-poppins text-foreground">
                Grounding Techniques Library
              </h1>
              <p className="text-muted-foreground mt-1">
                10 IFS-aligned practices to access Self-energy during anxiety
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Audio Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Access guided meditation audio to practice these techniques
              </p>
              <Button variant="outline" size="sm" asChild data-testid="button-meditation-library">
                <Link href="/media-library">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Go to Meditation Library
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Your Practice History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">
                  {progressData.length} {progressData.length === 1 ? 'technique' : 'techniques'} practiced
                </p>
                <p className="text-muted-foreground">
                  {progressData.reduce((sum, p) => sum + (p.timesCompleted || 0), 0)} total practice sessions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Techniques List */}
        <div className="space-y-6">
          {groundingTechniques.map((technique, index) => {
            const progress = getTechniqueProgress(technique.name);
            const isPracticed = progress?.practiced || false;
            const timesCompleted = progress?.timesCompleted || 0;
            const avgEffectiveness = progress?.effectiveness;

            return (
              <Card key={index} data-testid={`card-technique-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl" data-testid={`text-technique-name-${index}`}>
                          {index + 1}. {technique.name}
                        </CardTitle>
                        {isPracticed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Practiced
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {technique.description}
                      </CardDescription>
                      {progress && (
                        <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                          <span>Completed {timesCompleted}x</span>
                          {avgEffectiveness && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {avgEffectiveness}/10 effectiveness
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleMarkAsPracticed(technique.name)}
                      data-testid={`button-practice-${index}`}
                    >
                      Mark as Practiced
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Steps */}
                    <div>
                      <h4 className="font-medium text-sm mb-3">Step-by-Step Instructions:</h4>
                      <ol className="space-y-2">
                        {technique.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm" data-testid={`text-step-${index}-${stepIdx}`}>
                            <span className="text-primary font-medium flex-shrink-0 w-6">
                              {stepIdx + 1}.
                            </span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Separator />

                    {/* IFS Integration */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-primary mb-2">
                        IFS Integration:
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {technique.ifsIntegration}
                      </p>
                    </div>

                    {/* Notes from practice */}
                    {progress?.notes && (
                      <div className="bg-muted/50 border rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-2">Your Notes:</h4>
                        <p className="text-sm text-muted-foreground italic">
                          "{progress.notes}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Last practiced: {progress.lastPracticedAt ? new Date(progress.lastPracticedAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-3">
              Make Grounding Part of Your Daily Practice
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Regular practice of grounding techniques helps you access Self-energy more quickly when anxiety arises. 
              Try using different techniques and track which ones work best for you.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild data-testid="button-daily-checkin">
                <Link href="/daily-anxiety-checkin">Daily Anxiety Check-In</Link>
              </Button>
              <Button variant="outline" asChild data-testid="button-parts-dialogue">
                <Link href="/parts-dialogue">Talk to Your Parts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Dialog */}
      <Dialog open={practiceDialogOpen} onOpenChange={setPracticeDialogOpen}>
        <DialogContent data-testid="dialog-practice">
          <DialogHeader>
            <DialogTitle>Record Your Practice</DialogTitle>
            <DialogDescription>
              Track how effective this grounding technique was for you
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="effectiveness">How effective was this technique? (1-10)</Label>
              <Select value={effectiveness} onValueChange={setEffectiveness}>
                <SelectTrigger id="effectiveness" data-testid="select-effectiveness">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? '(Not effective)' : num === 10 ? '(Very effective)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did this technique help? What did you notice?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                data-testid="input-notes"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setPracticeDialogOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSavePractice}
                disabled={practiceMutation.isPending}
                data-testid="button-save-practice"
              >
                {practiceMutation.isPending ? "Saving..." : "Save Practice"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
