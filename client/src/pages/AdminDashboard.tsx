import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Redirect } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserPlus, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: "therapist" | "client";
  createdAt: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setIsAuthorized(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (!user || user.role !== "therapist") {
        setIsAuthorized(false);
        return;
      }
      setIsAuthorized(true);
    } catch (error) {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === false) {
    return <Redirect to="/dashboard" />;
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"therapist" | "client">("client");

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading users",
        description: "Failed to fetch user list. You may not have permission to view this page.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const createUserMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; displayName: string; role: string }) => {
      return apiRequest("POST", "/api/admin/users", userData);
    },
    onSuccess: () => {
      toast({
        title: "User created successfully",
        description: `${email} has been added to the system.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEmail("");
      setPassword("");
      setDisplayName("");
      setRole("client");
    },
    onError: (error: any) => {
      toast({
        title: "Error creating user",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate({ email, password, displayName, role });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and system settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New User
              </CardTitle>
              <CardDescription>
                Add a new therapist or client to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-user-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-user-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    data-testid="input-user-displayname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: "therapist" | "client") => setRole(value)}>
                    <SelectTrigger id="role" data-testid="select-user-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="therapist">Therapist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createUserMutation.isPending}
                  data-testid="button-create-user"
                >
                  {createUserMutation.isPending ? "Creating..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Statistics
              </CardTitle>
              <CardDescription>
                Overview of system users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading users...</div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Unable to load user statistics. Please ensure you have the necessary permissions.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Users</span>
                    <span className="text-2xl font-bold" data-testid="text-total-users">{users.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Therapists</span>
                    <span className="text-2xl font-bold" data-testid="text-therapist-count">
                      {users.filter(u => u.role === "therapist").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Clients</span>
                    <span className="text-2xl font-bold" data-testid="text-client-count">
                      {users.filter(u => u.role === "client").length}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Complete list of system users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground">Loading users...</div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Unable to load user list. Please check your permissions.
                </AlertDescription>
              </Alert>
            ) : users.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">No users found</div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                    data-testid={`user-row-${user.id}`}
                  >
                    <div>
                      <div className="font-medium" data-testid={`text-user-name-${user.id}`}>{user.displayName}</div>
                      <div className="text-sm text-muted-foreground" data-testid={`text-user-email-${user.id}`}>{user.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "therapist"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary-foreground"
                        }`}
                        data-testid={`badge-user-role-${user.id}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
