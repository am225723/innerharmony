import { useState } from 'react';
import { Link } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Sparkles, Heart, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PartsDialogueJournal() {
  const [partType, setPartType] = useState<string>('manager');
  const [dialogue, setDialogue] = useState<string>('');
  const [analysis, setAnalysis] = useState<{
    analysis: string;
    patterns: string[];
    citations: string[];
  } | null>(null);
  const { toast } = useToast();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/ai/parts-dialogue-analysis', {
        dialogue,
        partType,
        userId: currentUser.id,
        saveInsight: true,
      });
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your parts dialogue and identified patterns.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze dialogue. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!dialogue.trim()) {
      toast({
        title: "Dialogue Required",
        description: "Please write a dialogue with your part before analyzing.",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate();
  };

  const dialogueTemplates = {
    manager: `Self: I notice you've been working really hard to keep everything organized...
Part: Someone has to! If I don't, everything will fall apart.
Self: What are you most afraid of if you stopped organizing?
Part: [Your part's response here]`,
    
    firefighter: `Self: I see you jump in when the pain gets too intense...
Part: I have to! The pain is unbearable.
Self: What would happen if you didn't jump in immediately?
Part: [Your part's response here]`,
    
    exile: `Self: I'm here with you. I see you're in pain.
Part: No one sees me. No one cares.
Self: I see you now. I care. What do you need me to know?
Part: [Your part's response here]`,
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" data-testid="text-page-title">
          Parts Dialogue Journal
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Write conversations with your internal parts and receive AI-powered insights to deepen your understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dialogue Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Write Your Dialogue
              </CardTitle>
              <CardDescription>
                Have a conversation between your Self and one of your parts. Be curious and compassionate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Part Type</label>
                <Select value={partType} onValueChange={setPartType}>
                  <SelectTrigger data-testid="select-part-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="firefighter">Firefighter</SelectItem>
                    <SelectItem value="exile">Exile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Dialogue</label>
                <Textarea
                  value={dialogue}
                  onChange={(e) => setDialogue(e.target.value)}
                  placeholder={dialogueTemplates[partType as keyof typeof dialogueTemplates]}
                  className="min-h-[400px] font-mono text-sm"
                  data-testid="input-dialogue"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!dialogue.trim() || analyzeMutation.isPending}
                className="w-full"
                data-testid="button-analyze"
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {analysis && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Insights
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" data-testid="text-analysis">
                    {analysis.analysis}
                  </p>
                </div>

                {analysis.patterns.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Patterns Identified
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.patterns.map((pattern, index) => (
                          <Badge key={index} variant="secondary" data-testid={`pattern-${index}`}>
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {analysis.citations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 text-xs text-muted-foreground">
                        Citations
                      </h3>
                      <div className="space-y-1">
                        {analysis.citations.map((citation, index) => (
                          <a
                            key={index}
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline block"
                            data-testid={`citation-${index}`}
                          >
                            {citation}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Guidance Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">1. Choose Part Type</h4>
                <p className="text-muted-foreground">
                  Select whether you're dialoguing with a Manager, Firefighter, or Exile.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1">2. Write the Dialogue</h4>
                <p className="text-muted-foreground">
                  Write as "Self:" and let the part respond. Be curious, not judgmental.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1">3. Get AI Insights</h4>
                <p className="text-muted-foreground">
                  The AI will identify patterns, wounds, and suggest next steps for healing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Tips for Dialogue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                • Lead with curiosity: "What do you want me to know?"
              </p>
              <p className="text-muted-foreground">
                • Express appreciation: "Thank you for trying to protect me"
              </p>
              <p className="text-muted-foreground">
                • Ask about fears: "What are you afraid would happen?"
              </p>
              <p className="text-muted-foreground">
                • Offer reassurance: "I'm here now. You don't have to do this alone."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The 8 C's of Self</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Dialogue from these qualities:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Badge variant="outline">Curiosity</Badge>
                <Badge variant="outline">Compassion</Badge>
                <Badge variant="outline">Calm</Badge>
                <Badge variant="outline">Clarity</Badge>
                <Badge variant="outline">Confidence</Badge>
                <Badge variant="outline">Courage</Badge>
                <Badge variant="outline">Creativity</Badge>
                <Badge variant="outline">Connectedness</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
