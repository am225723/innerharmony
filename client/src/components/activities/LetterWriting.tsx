import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Sparkles, BookOpen } from "lucide-react";

interface LetterWritingProps {
  onSave: (letter: string) => void;
  initialLetter?: string;
}

export function LetterWriting({ onSave, initialLetter = "" }: LetterWritingProps) {
  const [letter, setLetter] = useState(initialLetter);
  const [showPrompts, setShowPrompts] = useState(true);

  const prompts = [
    "I know you felt so alone and scared when...",
    "You did nothing wrong. What happened was not your fault.",
    "I am here with you now. I will not abandon you.",
    "You are safe, and you are deeply loved.",
    "I see your pain and I honor your experience.",
    "You deserved to be protected and cared for.",
  ];

  const handleAddPrompt = (prompt: string) => {
    setLetter((prev) => (prev ? `${prev}\n\n${prompt}` : prompt));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">Letter to Your Inner Child</h1>
        <p className="text-muted-foreground">
          Express the love, validation, and care your younger self always needed
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Letter Writing Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Your Letter
                </CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <BookOpen className="w-3 h-3" />
                  {letter.split(/\s+/).filter(Boolean).length} words
                </Badge>
              </div>
              <CardDescription>
                Write from your compassionate adult Self to the young, wounded part
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="Dear younger me,&#10;&#10;I want you to know that..."
                rows={16}
                className="resize-none text-base leading-relaxed font-serif"
                data-testid="textarea-letter"
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setShowPrompts(!showPrompts)}
              data-testid="button-toggle-prompts"
            >
              {showPrompts ? "Hide" : "Show"} Prompts
            </Button>
            <Button
              onClick={() => onSave(letter)}
              disabled={!letter.trim()}
              className="gap-2"
              data-testid="button-save-letter"
            >
              <Send className="w-4 h-4" />
              Save Letter
            </Button>
          </div>
        </div>

        {/* Prompts Sidebar */}
        {showPrompts && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Healing Prompts
                </CardTitle>
                <CardDescription className="text-sm">
                  Click to add these compassionate messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddPrompt(prompt)}
                    className="w-full text-left p-3 rounded-lg border hover-elevate active-elevate-2 text-sm leading-relaxed"
                    data-testid={`prompt-${index}`}
                  >
                    "{prompt}"
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Remember:</p>
                  <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                    <li>Acknowledge the pain this part experienced</li>
                    <li>Validate that what happened wasn't their fault</li>
                    <li>Offer the love and protection they needed</li>
                    <li>Promise your presence and support now</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
