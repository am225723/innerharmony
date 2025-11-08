import { useState } from "react";
import { useLocation } from "wouter";
import { SignupForm } from "@/components/auth/SignupForm";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (
    data: { email: string; password: string; displayName: string },
    role: "therapist" | "client"
  ) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/signup", {
        ...data,
        role,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Signup failed");
      }

      if (result.session) {
        localStorage.setItem("supabase_session", JSON.stringify(result.session));
      }

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      toast({
        title: "Welcome to Compassionate Path!",
        description: "Your account has been created successfully.",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Signup failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <SignupForm onSubmit={handleSignup} isLoading={isLoading} />;
}
