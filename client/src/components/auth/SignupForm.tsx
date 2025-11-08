import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Sparkles, UserPlus } from "lucide-react";
import { Link } from "wouter";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormData, role: "therapist" | "client") => Promise<void>;
  isLoading?: boolean;
}

export function SignupForm({ onSubmit, isLoading }: SignupFormProps) {
  const [selectedRole, setSelectedRole] = useState<"therapist" | "client">("client");
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleFormSubmit = async (data: SignupFormData) => {
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
            Begin your healing journey today
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
            <CardTitle className="text-2xl font-display">Create your account</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Sign up as {selectedRole}
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
                  placeholder="your.email@example.com"
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
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your full name"
                  {...register("displayName")}
                  data-testid="input-display-name"
                  className="h-11"
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive" data-testid="error-display-name">
                    {errors.displayName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password (min 8 characters)"
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
                data-testid="button-signup"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login">
                <a className="text-primary hover:underline font-medium" data-testid="link-login">
                  Sign in
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          "The privilege of a lifetime is to become who you truly are."
          <br />
          <span className="text-xs">— Carl Jung</span>
        </p>
      </div>
    </div>
  );
}
