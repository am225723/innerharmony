import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIInsightsProps {
  variant: "journal-reflection" | "parts-analysis" | "ask-question" | "unburdening" | "appreciation";
  userId?: string;
  entryId?: string;
  partId?: string;
  burden?: string;
}

export function AIInsights({ variant, userId, entryId, partId, burden }: AIInsightsProps) {
  const [question, setQuestion] = useState("");
  const [insight, setInsight] = useState<string | null>(null);
  const { toast } = useToast();

  const journalReflectionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/journal-reflection", { entryId });
      return response.json();
    },
    onSuccess: (data: any) => {
      setInsight(data.reflection);
    },
    onError: () => {
      toast({
        title: "Unable to generate reflection",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const partsAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/parts-analysis", { userId });
      return response.json();
    },
    onSuccess: (data: any) => {
      setInsight(data.analysis);
    },
    onError: () => {
      toast({
        title: "Unable to analyze parts",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const askQuestionMutation = useMutation({
    mutationFn: async (q: string) => {
      const response = await apiRequest("POST", "/api/ai/ask-question", { question: q, userId });
      return response.json();
    },
    onSuccess: (data: any) => {
      setInsight(data.answer);
    },
    onError: () => {
      toast({
        title: "Unable to answer question",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const unburdeningMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/unburdening-visualization", { partId, burden });
      return response.json();
    },
    onSuccess: (data: any) => {
      setInsight(data.visualization);
    },
    onError: () => {
      toast({
        title: "Unable to generate visualization",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const appreciationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/protector-appreciation", { partId });
      return response.json();
    },
    onSuccess: (data: any) => {
      setInsight(data.appreciation);
    },
    onError: () => {
      toast({
        title: "Unable to generate appreciation",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    setInsight(null);
    switch (variant) {
      case "journal-reflection":
        journalReflectionMutation.mutate();
        break;
      case "parts-analysis":
        partsAnalysisMutation.mutate();
        break;
      case "ask-question":
        if (question.trim()) {
          askQuestionMutation.mutate(question);
        }
        break;
      case "unburdening":
        unburdeningMutation.mutate();
        break;
      case "appreciation":
        appreciationMutation.mutate();
        break;
    }
  };

  const isPending =
    journalReflectionMutation.isPending ||
    partsAnalysisMutation.isPending ||
    askQuestionMutation.isPending ||
    unburdeningMutation.isPending ||
    appreciationMutation.isPending;

  const getTitle = () => {
    switch (variant) {
      case "journal-reflection":
        return "Gentle Reflection";
      case "parts-analysis":
        return "Parts Pattern Insights";
      case "ask-question":
        return "Ask a Question";
      case "unburdening":
        return "Unburdening Visualization";
      case "appreciation":
        return "Protector Appreciation";
    }
  };

  const getDescription = () => {
    switch (variant) {
      case "journal-reflection":
        return "Receive a compassionate reflection on your journal entry";
      case "parts-analysis":
        return "Understand patterns in your protective system";
      case "ask-question":
        return "Get trauma-informed answers about IFS";
      case "unburdening":
        return "Create a healing visualization for releasing burdens";
      case "appreciation":
        return "Recognize the positive intention of this protector";
    }
  };

  return (
    <Card data-testid="card-ai-insights">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>{getTitle()}</CardTitle>
        </div>
        <CardDescription>{getDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {variant === "ask-question" && !insight && (
          <div className="space-y-2">
            <Textarea
              placeholder="Ask a question about IFS therapy, your parts, or healing practices..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-24"
              data-testid="input-ai-question"
            />
          </div>
        )}

        {!insight && (
          <Button
            onClick={handleGenerate}
            disabled={isPending || (variant === "ask-question" && !question.trim())}
            className="w-full"
            data-testid="button-generate-insight"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate {variant === "ask-question" ? "Answer" : "Insight"}
              </>
            )}
          </Button>
        )}

        {insight && (
          <div className="space-y-3">
            <div className="rounded-lg bg-accent/30 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed" data-testid="text-ai-insight">
                  {insight}
                </p>
              </div>
            </div>
            {variant === "ask-question" && (
              <Button
                variant="outline"
                onClick={() => {
                  setInsight(null);
                  setQuestion("");
                }}
                className="w-full"
                data-testid="button-ask-another"
              >
                Ask Another Question
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
