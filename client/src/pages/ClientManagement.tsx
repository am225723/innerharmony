import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Edit2, Eye, Mail, Calendar, Activity } from "lucide-react";
import { type User } from "@shared/schema";

export default function ClientManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    email: "",
    displayName: "",
    password: "",
  });

  // Get current therapist
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Redirect if not a therapist
  if (!currentUser || currentUser.role !== "therapist") {
    setLocation("/dashboard");
    return null;
  }

  // Fetch all clients
  const { data: allUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const clients = allUsers.filter((user) => user.role === "client");

  // Filter clients based on search
  const filteredClients = clients.filter((client) =>
    client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: { email: string; displayName: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/signup", {
        ...data,
        role: "client",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create client account");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsCreateDialogOpen(false);
      setNewClient({ email: "", displayName: "", password: "" });
      toast({
        title: "Client created",
        description: "New client account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateClient = () => {
    if (!newClient.email || !newClient.displayName || !newClient.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createClientMutation.mutate(newClient);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-semibold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Client Management
            </h1>
            <p className="text-muted-foreground">
              Manage your client accounts and access their therapeutic resources
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-client">
                <UserPlus className="w-4 h-4" />
                Create Client Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Client Account</DialogTitle>
                <DialogDescription>
                  Create a new client account. They can use these credentials to sign in.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="client@example.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    data-testid="input-client-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Full Name</Label>
                  <Input
                    id="client-name"
                    placeholder="Client's full name"
                    value={newClient.displayName}
                    onChange={(e) => setNewClient({ ...newClient, displayName: e.target.value })}
                    data-testid="input-client-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <Input
                    id="client-password"
                    type="password"
                    placeholder="Temporary password (min 8 characters)"
                    value={newClient.password}
                    onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                    data-testid="input-client-password"
                  />
                </div>
                <Button
                  onClick={handleCreateClient}
                  disabled={createClientMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-create-client"
                >
                  {createClientMutation.isPending ? "Creating..." : "Create Client Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search clients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
              data-testid="input-search-clients"
            />
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {filteredClients.length} {filteredClients.length === 1 ? "Client" : "Clients"}
          </Badge>
        </div>

        {/* Clients List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first client account to get started"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{client.displayName}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Client</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(client.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setLocation(`/clients/${client.id}`)}
                      data-testid={`button-view-client-${client.id}`}
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => {
                        // Navigate to client's parts mapping with their userId
                        localStorage.setItem("viewing_client_id", client.id);
                        setLocation("/parts-mapping");
                      }}
                      data-testid={`button-edit-parts-${client.id}`}
                    >
                      <Activity className="w-4 h-4" />
                      Edit Parts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
