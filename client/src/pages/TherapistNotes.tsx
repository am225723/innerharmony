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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Plus, Search, Tag, Edit, Trash2, Lock, LockOpen } from "lucide-react";
import { type User, type TherapistNote, insertTherapistNoteSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const createNoteSchema = insertTherapistNoteSchema.extend({
  sessionDate: z.string(),
  tags: z.string().optional(),
  taggedPartIds: z.string().optional(),
});

type CreateNoteFormData = z.infer<typeof createNoteSchema>;

export default function TherapistNotes() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<TherapistNote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClientId, setSearchClientId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "therapist") {
        setLocation("/");
        return;
      }
      setUser(parsedUser);
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: notes = [], isLoading } = useQuery<TherapistNote[]>({
    queryKey: [`/api/notes/therapist/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<TherapistNote[]>({
    queryKey: [`/api/notes/search`, { therapistId: user?.id, q: searchTerm, clientId: searchClientId }],
    enabled: !!user?.id && (!!searchTerm || !!searchClientId),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.id) params.append("therapistId", user.id);
      if (searchTerm) params.append("q", searchTerm);
      if (searchClientId) params.append("clientId", searchClientId);
      
      const response = await fetch(`/api/notes/search?${params.toString()}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
  });

  const form = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      therapistId: "",
      clientId: "",
      sessionId: "",
      sessionDate: new Date().toISOString().split('T')[0],
      noteContent: "",
      taggedPartIds: "",
      tags: "",
      isPrivate: true,
    },
  });

  // Update therapistId when user is loaded
  useEffect(() => {
    if (user?.id) {
      form.setValue("therapistId", user.id);
    }
  }, [user?.id, form]);

  const createNoteMutation = useMutation({
    mutationFn: async (data: CreateNoteFormData) => {
      const noteData = {
        therapistId: data.therapistId,
        clientId: data.clientId || null,
        sessionId: data.sessionId || null,
        sessionDate: new Date(data.sessionDate),
        noteContent: data.noteContent,
        taggedPartIds: data.taggedPartIds ? data.taggedPartIds.split(",").map(s => s.trim()) : [],
        tags: data.tags ? data.tags.split(",").map(s => s.trim()) : [],
        isPrivate: data.isPrivate,
      };
      return apiRequest("POST", `/api/notes?userId=${user?.id}`, noteData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes/therapist/${user?.id}`] });
      toast({
        title: "Note created",
        description: "Session note has been saved successfully.",
      });
      setIsCreateDialogOpen(false);
      form.reset({
        therapistId: user?.id || "",
        clientId: "",
        sessionId: "",
        sessionDate: new Date().toISOString().split('T')[0],
        noteContent: "",
        taggedPartIds: "",
        tags: "",
        isPrivate: true,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TherapistNote> }) => {
      return apiRequest("PATCH", `/api/notes/${id}?userId=${user?.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes/therapist/${user?.id}`] });
      toast({
        title: "Note updated",
        description: "Session note has been updated successfully.",
      });
      setSelectedNote(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/notes/${id}?userId=${user?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes/therapist/${user?.id}`] });
      toast({
        title: "Note deleted",
        description: "Session note has been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  const onSubmit = (data: CreateNoteFormData) => {
    createNoteMutation.mutate(data);
  };

  const displayedNotes = searchTerm || searchClientId ? searchResults : notes;

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading session notes...</p>
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
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Session Notes</h1>
              <p className="text-muted-foreground">
                Private notes for client sessions and therapeutic observations
              </p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-note">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Session Note</DialogTitle>
                <DialogDescription>
                  Document client session observations, insights, and therapeutic progress
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client ID (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="Enter client ID" data-testid="input-client-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sessionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session ID (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="Link to session" data-testid="input-session-id" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="sessionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-session-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="noteContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Document session observations, client insights, therapeutic progress..."
                            rows={8}
                            data-testid="textarea-note-content"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taggedPartIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagged Part IDs (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Comma-separated part IDs (e.g., part-123, part-456)"
                            data-testid="input-tagged-parts"
                          />
                        </FormControl>
                        <FormDescription>
                          Reference specific internal parts mentioned in this note
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Comma-separated tags (e.g., breakthrough, resistance, progress)"
                            data-testid="input-tags"
                          />
                        </FormControl>
                        <FormDescription>
                          Add tags for easier searching and categorization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Private Note</FormLabel>
                          <FormDescription>
                            Keep this note private and confidential
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-is-private"
                          />
                        </FormControl>
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
                      disabled={createNoteMutation.isPending}
                      data-testid="button-submit-note"
                    >
                      {createNoteMutation.isPending ? "Saving..." : "Save Note"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes by content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-notes"
                />
              </div>
              <Input
                placeholder="Filter by client ID..."
                value={searchClientId}
                onChange={(e) => setSearchClientId(e.target.value)}
                className="w-64"
                data-testid="input-filter-client"
              />
            </div>
          </CardContent>
        </Card>

        {displayedNotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || searchClientId ? "No notes found" : "No notes yet"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchTerm || searchClientId 
                  ? "Try adjusting your search criteria."
                  : "Create your first session note to start documenting client progress."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {displayedNotes.map((note) => (
              <Card key={note.id} className="hover-elevate" data-testid={`card-note-${note.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" data-testid={`badge-date-${note.id}`}>
                          {new Date(note.sessionDate).toLocaleDateString()}
                        </Badge>
                        {note.isPrivate ? (
                          <Badge variant="secondary" data-testid={`badge-private-${note.id}`}>
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        ) : (
                          <Badge variant="secondary" data-testid={`badge-shared-${note.id}`}>
                            <LockOpen className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                        {note.clientId && (
                          <Badge data-testid={`badge-client-${note.id}`}>
                            Client: {note.clientId}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs text-muted-foreground">
                        Created: {new Date(note.createdAt).toLocaleString()}
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => setSelectedNote(note)}
                        data-testid={`button-edit-${note.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        data-testid={`button-delete-${note.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <ScrollArea className="h-32">
                      <p className="text-sm whitespace-pre-wrap" data-testid={`text-content-${note.id}`}>
                        {note.noteContent}
                      </p>
                    </ScrollArea>
                  </div>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Tag className="w-3 h-3 text-muted-foreground mt-1" />
                      {note.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" data-testid={`badge-tag-${note.id}-${index}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {note.taggedPartIds && note.taggedPartIds.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Referenced Parts:</p>
                      <div className="flex flex-wrap gap-1">
                        {note.taggedPartIds.map((partId, index) => (
                          <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-part-${note.id}-${index}`}>
                            {partId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
