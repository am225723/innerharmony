import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Sparkles } from "lucide-react";
import { Link } from "wouter";

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials, role: "therapist" | "client") => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [selectedRole, setSelectedRole] = useState<"therapist" | "client">("client");
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = async (data: LoginCredentials) => {
    await onSubmit(data, selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Compassionate Path
          </h1>
          <p className="text-muted-foreground text-lg">
            Your journey to inner harmony begins here
          </p>
        </div>

        <div className="flex gap-3 p-1 bg-muted/50 rounded-lg">
          <Button
            type="button"
            variant={selectedRole === "client" ? "default" : "ghost"}
            className="flex-1 gap-2"
            onClick={() => setSelectedRole("client")}
            data-testid="button-select-client"
          >
            <Heart className="w-4 h-4" />
            Client
          </Button>
          <Button
            type="button"
            variant={selectedRole === "therapist" ? "default" : "ghost"}
            className="flex-1 gap-2"
            onClick={() => setSelectedRole("therapist")}
            data-testid="button-select-therapist"
          >
            <Shield className="w-4 h-4" />
            Therapist
          </Button>
        </div>

        <Card className="shadow-lg border-card-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Sign in as {selectedRole}
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                {selectedRole === "therapist" ? "Guide" : "Seeker"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  data-testid="input-email"
                  className="h-11"
                />
                {errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-email">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  data-testid="input-password"
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-password">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 gap-2"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium" data-testid="link-signup">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          "The curious paradox is that when I accept myself just as I am, then I can change." 
          <br />
          <span className="text-xs">— Carl Rogers</span>
        </p>
      </div>
    </div>
  );
}
