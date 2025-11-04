import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar, Clock, AlertCircle, Heart, Brain, Trash2, Edit2, Plus, ArrowLeft, XCircle } from "lucide-react";
import { format } from "date-fns";
import type { AnxietyTimeline, InsertAnxietyTimeline } from "@shared/schema";
import { Link } from "wouter";

export default function AnxietyTimelinePage() {
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AnxietyTimeline | null>(null);
  
  // Form state
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [situation, setSituation] = useState("");
  const [selectedWounds, setSelectedWounds] = useState<string[]>([]);
  const [partsInvolved, setPartsInvolved] = useState("");
  const [triggers, setTriggers] = useState("");
  const [bodyResponse, setBodyResponse] = useState("");
  const [notes, setNotes] = useState("");

  const wounds = [
    { id: "rejection", label: "Rejection", color: "bg-pink-500" },
    { id: "abandonment", label: "Abandonment", color: "bg-purple-500" },
    { id: "injustice", label: "Injustice", color: "bg-orange-500" },
    { id: "betrayal", label: "Betrayal", color: "bg-red-500" },
    { id: "neglect", label: "Neglect", color: "bg-blue-500" },
  ];

  // Fetch timeline events
  const { data: timeline = [], isLoading } = useQuery<AnxietyTimeline[]>({
    queryKey: [`/api/anxiety-timeline?userId=${currentUser.id}`],
    enabled: !!currentUser.id,
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: InsertAnxietyTimeline) => {
      return await apiRequest("POST", "/api/anxiety-timeline", eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/anxiety-timeline?userId=${currentUser.id}`] });
      toast({
        title: "Event Added",
        description: "Your anxiety timeline event has been recorded.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create timeline event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AnxietyTimeline> }) => {
      return await apiRequest("PATCH", `/api/anxiety-timeline/${id}?userId=${currentUser.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/anxiety-timeline?userId=${currentUser.id}`] });
      toast({
        title: "Event Updated",
        description: "Timeline event has been updated successfully.",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update timeline event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/anxiety-timeline/${id}?userId=${currentUser.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/anxiety-timeline?userId=${currentUser.id}`] });
      toast({
        title: "Event Removed",
        description: "Timeline event has been deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete timeline event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setEventDate(new Date().toISOString().slice(0, 16));
    setAnxietyLevel(5);
    setSituation("");
    setSelectedWounds([]);
    setPartsInvolved("");
    setTriggers("");
    setBodyResponse("");
    setNotes("");
    setShowForm(false);
    setEditingEvent(null);
  };

  const handleSubmit = () => {
    if (!currentUser?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to save timeline events.",
        variant: "destructive",
      });
      return;
    }

    if (!situation.trim()) {
      toast({
        title: "Validation Error",
        description: "Please describe the situation.",
        variant: "destructive",
      });
      return;
    }

    const eventData = {
      userId: currentUser.id,
      eventDate: new Date(eventDate),
      anxietyLevel,
      situation,
      woundsIdentified: selectedWounds,
      partsInvolved: partsInvolved.split(",").map(p => p.trim()).filter(Boolean),
      triggers: triggers || null,
      bodyResponse: bodyResponse || null,
      notes: notes || null,
    };

    if (editingEvent) {
      updateEvent.mutate({ id: editingEvent.id, updates: eventData });
    } else {
      createEvent.mutate(eventData);
    }
  };

  const handleEdit = (event: AnxietyTimeline) => {
    setEditingEvent(event);
    setEventDate(new Date(event.eventDate).toISOString().slice(0, 16));
    setAnxietyLevel(event.anxietyLevel);
    setSituation(event.situation);
    setSelectedWounds(event.woundsIdentified || []);
    setPartsInvolved((event.partsInvolved || []).join(", "));
    setTriggers(event.triggers || "");
    setBodyResponse(event.bodyResponse || "");
    setNotes(event.notes || "");
    setShowForm(true);
  };

  const toggleWound = (woundId: string) => {
    setSelectedWounds(prev =>
      prev.includes(woundId) ? prev.filter(w => w !== woundId) : [...prev, woundId]
    );
  };

  const getAnxietyColor = (level: number) => {
    if (level <= 3) return "bg-teal-500";
    if (level <= 6) return "bg-orange-500";
    return "bg-pink-500";
  };

  const getWoundColor = (woundId: string) => {
    return wounds.find(w => w.id === woundId)?.color || "bg-gray-500";
  };

  if (!currentUser.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the Anxiety Timeline.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full" data-testid="button-login">
              <Link href="/">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href="/ifs-anxiety">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-poppins text-foreground">Anxiety Timeline</h1>
              <p className="text-muted-foreground mt-1">
                Track your anxiety patterns and connect them to childhood wounds
              </p>
            </div>
          </div>
        </div>

        {/* Add Event Button */}
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="mb-6"
            data-testid="button-add-event"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Timeline Event
          </Button>
        )}

        {/* Event Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingEvent ? "Edit Event" : "New Timeline Event"}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                  data-testid="button-cancel-form"
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <CardDescription>
                Record an anxiety experience and connect it to your internal system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date/Time */}
              <div>
                <Label htmlFor="event-date">When did this happen?</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  data-testid="input-event-date"
                />
              </div>

              {/* Anxiety Level */}
              <div>
                <Label>Anxiety Level: {anxietyLevel}/10</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[anxietyLevel]}
                    onValueChange={(value) => setAnxietyLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                    data-testid="slider-anxiety-level"
                  />
                  <Badge className={`${getAnxietyColor(anxietyLevel)} text-white`}>
                    {anxietyLevel}/10
                  </Badge>
                </div>
              </div>

              {/* Situation */}
              <div>
                <Label htmlFor="situation">What was happening? *</Label>
                <Textarea
                  id="situation"
                  placeholder="Describe the situation that triggered anxiety..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  rows={3}
                  data-testid="textarea-situation"
                />
              </div>

              {/* Wounds Identified */}
              <div>
                <Label>Childhood Wounds Connected</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {wounds.map(wound => (
                    <Badge
                      key={wound.id}
                      variant={selectedWounds.includes(wound.id) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedWounds.includes(wound.id) ? `${wound.color} text-white` : ""}`}
                      onClick={() => toggleWound(wound.id)}
                      data-testid={`badge-wound-${wound.id}`}
                    >
                      {wound.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Parts Involved */}
              <div>
                <Label htmlFor="parts">Parts Involved (comma-separated)</Label>
                <Input
                  id="parts"
                  placeholder="e.g., Protector, Anxious One, Inner Critic"
                  value={partsInvolved}
                  onChange={(e) => setPartsInvolved(e.target.value)}
                  data-testid="input-parts"
                />
              </div>

              {/* Triggers */}
              <div>
                <Label htmlFor="triggers">What triggered this anxiety?</Label>
                <Textarea
                  id="triggers"
                  placeholder="Specific triggers or circumstances..."
                  value={triggers}
                  onChange={(e) => setTriggers(e.target.value)}
                  rows={2}
                  data-testid="textarea-triggers"
                />
              </div>

              {/* Body Response */}
              <div>
                <Label htmlFor="body-response">How did your body respond?</Label>
                <Textarea
                  id="body-response"
                  placeholder="Physical sensations, tension, breath changes..."
                  value={bodyResponse}
                  onChange={(e) => setBodyResponse(e.target.value)}
                  rows={2}
                  data-testid="textarea-body-response"
                />
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Reflections</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other insights or observations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  data-testid="textarea-notes"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={createEvent.isPending || updateEvent.isPending}
                data-testid="button-save-event"
              >
                {editingEvent ? "Update Event" : "Save Event"}
              </Button>
              <Button variant="outline" onClick={resetForm} data-testid="button-cancel">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Timeline Visualization */}
        <div className="space-y-6">
          {isLoading && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading timeline...
              </CardContent>
            </Card>
          )}

          {!isLoading && timeline.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No timeline events yet. Add your first anxiety experience to start tracking patterns.
                </p>
              </CardContent>
            </Card>
          )}

          {!isLoading && timeline.length > 0 && (
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

              {/* Timeline Events */}
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={event.id} className="relative pl-20">
                    {/* Timeline Marker */}
                    <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-background border-4 border-primary" />

                    {/* Event Card */}
                    <Card data-testid={`card-event-${event.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground" data-testid={`text-event-date-${event.id}`}>
                                {format(new Date(event.eventDate), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                            </div>
                            <CardTitle className="text-xl" data-testid={`text-situation-${event.id}`}>
                              {event.situation}
                            </CardTitle>
                          </div>
                          <Badge
                            className={`${getAnxietyColor(event.anxietyLevel)} text-white`}
                            data-testid={`badge-anxiety-${event.id}`}
                          >
                            {event.anxietyLevel}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Wounds */}
                        {event.woundsIdentified && event.woundsIdentified.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Childhood Wounds:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {event.woundsIdentified.map(woundId => {
                                const wound = wounds.find(w => w.id === woundId);
                                return wound ? (
                                  <Badge
                                    key={woundId}
                                    className={`${wound.color} text-white`}
                                    data-testid={`badge-event-wound-${woundId}-${event.id}`}
                                  >
                                    {wound.label}
                                  </Badge>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Parts */}
                        {event.partsInvolved && event.partsInvolved.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Parts Involved:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {event.partsInvolved.map((part, idx) => (
                                <Badge key={idx} variant="secondary" data-testid={`badge-part-${idx}-${event.id}`}>
                                  {part}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Triggers */}
                        {event.triggers && (
                          <div>
                            <span className="text-sm font-medium">Triggers:</span>
                            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-triggers-${event.id}`}>
                              {event.triggers}
                            </p>
                          </div>
                        )}

                        {/* Body Response */}
                        {event.bodyResponse && (
                          <div>
                            <span className="text-sm font-medium">Body Response:</span>
                            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-body-${event.id}`}>
                              {event.bodyResponse}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {event.notes && (
                          <div>
                            <span className="text-sm font-medium">Reflections:</span>
                            <p className="text-sm text-muted-foreground mt-1" data-testid={`text-notes-${event.id}`}>
                              {event.notes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          data-testid={`button-edit-${event.id}`}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this timeline event?")) {
                              deleteEvent.mutate(event.id);
                            }
                          }}
                          data-testid={`button-delete-${event.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
