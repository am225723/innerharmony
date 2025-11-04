import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { groundingTechniques } from "@/lib/ifsAnxietyKnowledge";
import type { Part, DailyAnxietyCheckin } from "@shared/schema";
import { format } from "date-fns";
import { TrendingDown, TrendingUp, Calendar, Heart, Sparkles } from "lucide-react";

export default function DailyAnxietyCheckIn() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { toast } = useToast();

  // Form state
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);
  const [selfEnergyMoments, setSelfEnergyMoments] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Fetch user's parts
  const { data: parts = [] } = useQuery<Part[]>({
    queryKey: ["/api/parts", currentUser.id],
    enabled: !!currentUser.id,
  });

  // Fetch recent check-ins
  const { data: checkins = [] } = useQuery<DailyAnxietyCheckin[]>({
    queryKey: [`/api/anxiety-checkins?userId=${currentUser.id}`],
    enabled: !!currentUser.id,
  });

  // Save check-in mutation
  const saveCheckin = useMutation({
    mutationFn: async () => {
      const checkinData = {
        userId: currentUser.id,
        checkinDate: new Date().toISOString(),
        anxietyLevel,
        triggeredParts: selectedParts,
        groundingTechniquesUsed: selectedTechniques,
        selfEnergyMoments: selfEnergyMoments.trim() || null,
        notes: notes.trim() || null,
      };
      const res = await apiRequest("POST", "/api/anxiety-checkins", checkinData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/anxiety-checkins?userId=${currentUser.id}`] });
      toast({
        title: "Check-In Saved",
        description: "Your daily anxiety check-in has been recorded.",
      });
      // Reset form
      setAnxietyLevel(5);
      setSelectedParts([]);
      setSelectedTechniques([]);
      setSelfEnergyMoments("");
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save check-in. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate trend
  const calculateTrend = () => {
    if (checkins.length < 14) return null; // Need at least 14 check-ins for full week-over-week comparison
    const recentCheckins = checkins.slice(0, 7);
    const previousCheckins = checkins.slice(7, 14);
    
    // Require exactly 7 entries in both periods for accurate comparison
    if (recentCheckins.length < 7 || previousCheckins.length < 7) return null;
    
    const avg = recentCheckins.reduce((sum, c) => sum + c.anxietyLevel, 0) / recentCheckins.length;
    const previousAvg = previousCheckins.reduce((sum, c) => sum + c.anxietyLevel, 0) / previousCheckins.length;
    
    const change = avg - previousAvg;
    return { change, improving: change < 0 };
  };

  const trend = calculateTrend();

  // Get anxiety level color
  const getAnxietyColor = (level: number) => {
    if (level <= 3) return "bg-green-500";
    if (level <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const togglePart = (partId: string) => {
    setSelectedParts(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const toggleTechnique = (techniqueName: string) => {
    setSelectedTechniques(prev =>
      prev.includes(techniqueName) ? prev.filter(name => name !== techniqueName) : [...prev, techniqueName]
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Daily Anxiety Check-In</h1>
          <p className="text-muted-foreground">
            Track your anxiety patterns and self-care practices to understand what helps you access Self-energy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Check-In Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Check-In
                </CardTitle>
                <CardDescription>
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Anxiety Level Slider */}
                <div className="space-y-3">
                  <Label htmlFor="anxiety-level">
                    Anxiety Level: <span className="text-2xl font-bold text-primary">{anxietyLevel}</span>/10
                  </Label>
                  <Slider
                    id="anxiety-level"
                    data-testid="slider-anxiety-level"
                    value={[anxietyLevel]}
                    onValueChange={(value) => setAnxietyLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Active Parts */}
                <div className="space-y-3">
                  <Label>Which parts are active with anxiety today?</Label>
                  {parts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {parts.map((part) => (
                        <div
                          key={part.id}
                          className="flex items-start gap-2 p-2 rounded-md hover-elevate"
                          data-testid={`checkbox-part-${part.id}`}
                        >
                          <Checkbox
                            id={`part-${part.id}`}
                            checked={selectedParts.includes(part.id)}
                            onCheckedChange={() => togglePart(part.id)}
                          />
                          <label htmlFor={`part-${part.id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{part.name}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {part.type}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No parts mapped yet. Visit Parts Mapping to identify your parts.
                    </p>
                  )}
                </div>

                {/* Grounding Techniques Used */}
                <div className="space-y-3">
                  <Label>Which grounding techniques did you use today?</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {groundingTechniques.map((technique) => (
                      <div
                        key={technique.name}
                        className="flex items-start gap-2 p-2 rounded-md hover-elevate"
                        data-testid={`checkbox-technique-${technique.name.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <Checkbox
                          id={`technique-${technique.name}`}
                          checked={selectedTechniques.includes(technique.name)}
                          onCheckedChange={() => toggleTechnique(technique.name)}
                        />
                        <label htmlFor={`technique-${technique.name}`} className="flex-1 cursor-pointer">
                          <div className="font-medium text-sm">{technique.name}</div>
                          <p className="text-xs text-muted-foreground mt-1">{technique.description}</p>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Self-Energy Moments */}
                <div className="space-y-2">
                  <Label htmlFor="self-energy" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Moments of Self-Energy
                  </Label>
                  <Textarea
                    id="self-energy"
                    data-testid="textarea-self-energy"
                    placeholder="When did you feel calm, curious, compassionate, or connected today? What helped you access Self?"
                    value={selfEnergyMoments}
                    onChange={(e) => setSelfEnergyMoments(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Reflections</Label>
                  <Textarea
                    id="notes"
                    data-testid="textarea-notes"
                    placeholder="Any other observations, patterns, or insights about your anxiety today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={() => saveCheckin.mutate()}
                  disabled={saveCheckin.isPending}
                  className="w-full"
                  data-testid="button-save-checkin"
                >
                  {saveCheckin.isPending ? "Saving..." : "Save Today's Check-In"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Trend & History */}
          <div className="space-y-6">
            {/* Trend Card */}
            {trend && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">7-Day Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2">
                    {trend.improving ? (
                      <TrendingDown className="w-8 h-8 text-green-500" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <div className={`text-2xl font-bold ${trend.improving ? "text-green-500" : "text-red-500"}`}>
                        {trend.improving ? "-" : "+"}{Math.abs(trend.change).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">vs. previous week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Check-Ins */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Check-Ins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkins.length > 0 ? (
                  checkins.slice(0, 10).map((checkin) => (
                    <div
                      key={checkin.id}
                      className="flex items-center justify-between p-3 rounded-md bg-card border"
                      data-testid={`checkin-${checkin.id}`}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {format(new Date(checkin.checkinDate), "MMM d")}
                        </div>
                        {checkin.groundingTechniquesUsed && checkin.groundingTechniquesUsed.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Heart className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {checkin.groundingTechniquesUsed.length} technique{checkin.groundingTechniquesUsed.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getAnxietyColor(checkin.anxietyLevel)} text-white border-0`}>
                          {checkin.anxietyLevel}/10
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No check-ins yet. Complete your first one above!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
