import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Target, Plus, TrendingUp, CheckCircle2, Clock, Edit, Trash2 } from "lucide-react";
import { type User, type SessionGoal, insertSessionGoalSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const createGoalSchema = insertSessionGoalSchema.extend({
  targetDate: z.string().optional(),
});

type CreateGoalFormData = z.infer<typeof createGoalSchema>;

const GOAL_CATEGORIES = [
  { value: "self_leadership", label: "Self-Leadership" },
  { value: "parts_work", label: "Parts Work" },
  { value: "unburdening", label: "Unburdening" },
  { value: "daily_practice", label: "Daily Practice" },
  { value: "relationship", label: "Relationship Healing" },
  { value: "emotional_regulation", label: "Emotional Regulation" },
  { value: "trauma_healing", label: "Trauma Healing" },
  { value: "other", label: "Other" },
];

const GOAL_STATUSES = [
  { value: "not_started", label: "Not Started", icon: Clock },
  { value: "in_progress", label: "In Progress", icon: TrendingUp },
  { value: "achieved", label: "Achieved", icon: CheckCircle2 },
  { value: "revised", label: "Revised", icon: Edit },
];

export default function SessionGoals() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SessionGoal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const isTherapist = user?.role === "therapist";

  const { data: goals = [], isLoading } = useQuery<SessionGoal[]>({
    queryKey: isTherapist 
      ? [`/api/goals/therapist/${user?.id}`]
      : [`/api/goals/client/${user?.id}`],
    enabled: !!user?.id,
  });

  const form = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      therapistId: "",
      clientId: "",
      goalText: "",
      category: "self_leadership",
      targetDate: "",
      status: "not_started",
      progress: 0,
      clientNotes: "",
      therapistNotes: "",
    },
  });

  // Update therapistId when user is loaded
  useEffect(() => {
    if (user?.id) {
      form.setValue("therapistId", user.id);
    }
  }, [user?.id, form]);

  const createGoalMutation = useMutation({
    mutationFn: async (data: CreateGoalFormData) => {
      const goalData = {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
      };
      return apiRequest("POST", `/api/goals?userId=${user?.id}`, goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goals/therapist/${user?.id}`] });
      toast({
        title: "Goal created",
        description: "Session goal has been created successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset({
        therapistId: user?.id || "",
        clientId: "",
        goalText: "",
        category: "self_leadership",
        targetDate: "",
        status: "not_started",
        progress: 0,
        clientNotes: "",
        therapistNotes: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SessionGoal> }) => {
      return apiRequest("PATCH", `/api/goals/${id}?userId=${user?.id}`, updates);
    },
    onSuccess: () => {
      const queryKey = isTherapist 
        ? [`/api/goals/therapist/${user?.id}`]
        : [`/api/goals/client/${user?.id}`];
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Goal updated",
        description: "Session goal has been updated successfully.",
      });
      setSelectedGoal(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/goals/${id}?userId=${user?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/goals/therapist/${user?.id}`] });
      toast({
        title: "Goal deleted",
        description: "Session goal has been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const onSubmit = (data: CreateGoalFormData) => {
    createGoalMutation.mutate(data);
  };

  const updateProgress = (goalId: string, progress: number) => {
    updateGoalMutation.mutate({ id: goalId, updates: { progress } });
  };

  const updateStatus = (goalId: string, status: SessionGoal["status"]) => {
    updateGoalMutation.mutate({ id: goalId, updates: { status } });
  };

  const updateClientNotes = (goalId: string, clientNotes: string) => {
    updateGoalMutation.mutate({ id: goalId, updates: { clientNotes } });
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading goals...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Session Goals</h1>
              <p className="text-muted-foreground">
                {isTherapist ? "Create and track goals for your clients" : "Track your therapeutic goals and progress"}
              </p>
            </div>
          </div>
          
          {isTherapist && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-goal">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Session Goal</DialogTitle>
                  <DialogDescription>
                    Set a therapeutic goal for your client's journey
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client ID</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter client ID" data-testid="input-client-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goalText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe the therapeutic goal..." rows={3} data-testid="input-goal-text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GOAL_CATEGORIES.map((cat) => (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="targetDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-target-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="therapistNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Therapist Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} value={field.value || ""} placeholder="Additional context or observations..." rows={2} data-testid="input-therapist-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        data-testid="button-cancel-create"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createGoalMutation.isPending}
                        data-testid="button-submit-goal"
                      >
                        {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {isTherapist 
                  ? "Create your first therapeutic goal to start tracking client progress."
                  : "Your therapist will set goals for your therapeutic journey."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => {
              const statusInfo = GOAL_STATUSES.find(s => s.value === goal.status);
              const StatusIcon = statusInfo?.icon || Target;
              const category = GOAL_CATEGORIES.find(c => c.value === goal.category);
              
              return (
                <Card key={goal.id} className="hover-elevate" data-testid={`card-goal-${goal.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" data-testid={`badge-category-${goal.id}`}>
                            {category?.label}
                          </Badge>
                          <Badge 
                            variant={goal.status === "achieved" ? "default" : "secondary"}
                            data-testid={`badge-status-${goal.id}`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo?.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl" data-testid={`text-goal-text-${goal.id}`}>
                          {goal.goalText}
                        </CardTitle>
                        {goal.targetDate && (
                          <CardDescription>
                            Target: {new Date(goal.targetDate).toLocaleDateString()}
                          </CardDescription>
                        )}
                      </div>
                      
                      {isTherapist && (
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => setSelectedGoal(goal)}
                            data-testid={`button-edit-${goal.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => deleteGoalMutation.mutate(goal.id)}
                            data-testid={`button-delete-${goal.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground" data-testid={`text-progress-${goal.id}`}>
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} data-testid={`progress-bar-${goal.id}`} />
                      
                      {!isTherapist && (
                        <div className="flex gap-2 mt-2">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            placeholder="Update progress"
                            onBlur={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value) && value >= 0 && value <= 100) {
                                updateProgress(goal.id, value);
                                e.target.value = "";
                              }
                            }}
                            data-testid={`input-progress-${goal.id}`}
                          />
                          <Select onValueChange={(value) => updateStatus(goal.id, value as SessionGoal["status"])}>
                            <SelectTrigger className="w-[180px]" data-testid={`select-status-${goal.id}`}>
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              {GOAL_STATUSES.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    {goal.clientNotes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Client Notes</h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-client-notes-${goal.id}`}>
                          {goal.clientNotes}
                        </p>
                      </div>
                    )}
                    
                    {!isTherapist && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Add Client Notes</h4>
                        <div className="flex gap-2">
                          <Textarea 
                            placeholder="Share your thoughts or reflections..."
                            rows={2}
                            id={`notes-${goal.id}`}
                            data-testid={`textarea-client-notes-${goal.id}`}
                          />
                          <Button
                            onClick={() => {
                              const textarea = document.getElementById(`notes-${goal.id}`) as HTMLTextAreaElement;
                              if (textarea?.value) {
                                updateClientNotes(goal.id, textarea.value);
                                textarea.value = "";
                              }
                            }}
                            data-testid={`button-save-notes-${goal.id}`}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {isTherapist && goal.therapistNotes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Therapist Notes</h4>
                        <p className="text-sm text-muted-foreground" data-testid={`text-therapist-notes-${goal.id}`}>
                          {goal.therapistNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
