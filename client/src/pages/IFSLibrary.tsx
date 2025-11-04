import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Heart, 
  Shield, 
  Flame, 
  Users, 
  Lightbulb, 
  BookOpen,
  Sparkles,
  Target,
  ArrowRight
} from "lucide-react";
import { 
  eightCsOfSelf, 
  fiveChildhoodWounds, 
  ifsFoundations, 
  partsDeepDive,
  sixFsProtocol,
  unburdeningProcess,
  dailyIFSPractices
} from "@/lib/ifsKnowledge";

export default function IFSLibrary() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-semibold text-foreground">
            IFS Knowledge Library
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive educational resources for your healing journey
          </p>
        </div>

        <Tabs defaultValue="foundations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 gap-2">
            <TabsTrigger value="foundations" data-testid="tab-foundations">
              <Brain className="w-4 h-4 mr-2" />
              Foundations
            </TabsTrigger>
            <TabsTrigger value="8cs" data-testid="tab-8cs">
              <Sparkles className="w-4 h-4 mr-2" />
              8 C's of Self
            </TabsTrigger>
            <TabsTrigger value="parts" data-testid="tab-parts">
              <Users className="w-4 h-4 mr-2" />
              Parts System
            </TabsTrigger>
            <TabsTrigger value="wounds" data-testid="tab-wounds">
              <Heart className="w-4 h-4 mr-2" />
              Childhood Wounds
            </TabsTrigger>
            <TabsTrigger value="6fs" data-testid="tab-6fs">
              <Target className="w-4 h-4 mr-2" />
              6 F's Protocol
            </TabsTrigger>
            <TabsTrigger value="unburdening" data-testid="tab-unburdening">
              <Flame className="w-4 h-4 mr-2" />
              Unburdening
            </TabsTrigger>
            <TabsTrigger value="practices" data-testid="tab-practices">
              <Lightbulb className="w-4 h-4 mr-2" />
              Daily Practices
            </TabsTrigger>
          </TabsList>

          {/* Foundations */}
          <TabsContent value="foundations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {ifsFoundations.map((concept) => (
                <Card key={concept.id} className="hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-${concept.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      {concept.title}
                    </CardTitle>
                    <CardDescription>{concept.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {concept.detailedContent.substring(0, 300)}...
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Key Takeaways:</p>
                      <ul className="space-y-1">
                        {concept.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {concept.reflectionPrompts && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Reflection Prompt:</p>
                        <p className="text-sm text-muted-foreground italic">
                          {concept.reflectionPrompts[0]}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 8 C's of Self */}
          <TabsContent value="8cs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  {eightCsOfSelf.title}
                </CardTitle>
                <CardDescription>{eightCsOfSelf.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {eightCsOfSelf.qualities.map((quality) => (
                    <Card key={quality.name} className="bg-card/50" data-testid={`card-${quality.name.toLowerCase()}`}>
                      <CardHeader>
                        <CardTitle className="text-lg">{quality.name}</CardTitle>
                        <CardDescription>{quality.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Example:</p>
                          <p className="text-sm italic">{quality.example}</p>
                        </div>
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Practice:</p>
                          <p className="text-sm">{quality.practice}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parts System */}
          <TabsContent value="parts" className="space-y-4">
            <div className="grid gap-4">
              {partsDeepDive.map((concept) => (
                <Card key={concept.id} data-testid={`card-${concept.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {concept.id.includes('manager') && <Shield className="w-5 h-5 text-blue-500" />}
                      {concept.id.includes('firefighter') && <Flame className="w-5 h-5 text-orange-500" />}
                      {concept.id.includes('exile') && <Heart className="w-5 h-5 text-pink-500" />}
                      {concept.title}
                    </CardTitle>
                    <CardDescription>{concept.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-64">
                      <div className="prose prose-sm dark:prose-invert max-w-none pr-4">
                        <div className="whitespace-pre-line text-sm">
                          {concept.detailedContent}
                        </div>
                      </div>
                    </ScrollArea>
                    
                    <div className="grid gap-2">
                      <p className="text-sm font-medium">Key Takeaways:</p>
                      <div className="space-y-1">
                        {concept.keyTakeaways.map((takeaway, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Childhood Wounds */}
          <TabsContent value="wounds" className="space-y-4">
            <div className="grid gap-4">
              {fiveChildhoodWounds.map((wound) => (
                <Card key={wound.id} className="border-l-4 border-l-pink-500" data-testid={`card-${wound.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      {wound.name}
                    </CardTitle>
                    <CardDescription>{wound.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Exile Burdens (Core Beliefs):</p>
                      <ul className="space-y-1">
                        {wound.exileBurdens.map((burden, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground italic pl-4 border-l-2 border-muted">
                            "{burden}"
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Common Protectors:</p>
                      <div className="grid gap-2">
                        {wound.commonProtectors.map((protector, idx) => (
                          <div key={idx} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{protector.name}</p>
                              <Badge variant={protector.type === 'Manager' ? 'default' : 'destructive'}>
                                {protector.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Strategy: {protector.strategy}</p>
                            <p className="text-xs italic">Message: "{protector.message}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-success/10 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Healing Path:</p>
                      <p className="text-sm">{wound.healingPath}</p>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Reparenting Exercise:</p>
                      <p className="text-sm italic">{wound.reparentingExercise}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 6 F's Protocol */}
          <TabsContent value="6fs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  {sixFsProtocol.title}
                </CardTitle>
                <CardDescription>{sixFsProtocol.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Purpose:</p>
                  <p className="text-sm text-muted-foreground">{sixFsProtocol.purpose}</p>
                </div>

                <div className="space-y-4">
                  {sixFsProtocol.steps.map((step) => (
                    <Card key={step.number} className="bg-card/50" data-testid={`card-step-${step.number}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {step.number}
                          </div>
                          {step.name}
                        </CardTitle>
                        <CardDescription>{step.instruction}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {step.questions && (
                          <div>
                            <p className="text-sm font-medium mb-2">Questions to Ask:</p>
                            <ul className="space-y-1">
                              {step.questions.map((q, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/30">
                                  "{q}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {step.example && (
                          <div className="bg-accent/10 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Example:</p>
                            <p className="text-sm italic">{step.example}</p>
                          </div>
                        )}

                        {step.purpose && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs font-medium mb-1">Why This Matters:</p>
                            <p className="text-xs text-muted-foreground">{step.purpose}</p>
                          </div>
                        )}

                        {step.keyQuestion && (
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Key Question:</p>
                            <p className="text-sm">"{step.keyQuestion}"</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="text-sm font-medium mb-1">⚠️ Critical Reminder:</p>
                  <p className="text-sm">{sixFsProtocol.criticalReminder}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Unburdening Process */}
          <TabsContent value="unburdening" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  {unburdeningProcess.title}
                </CardTitle>
                <CardDescription>{unburdeningProcess.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Purpose:</p>
                  <p className="text-sm text-muted-foreground">{unburdeningProcess.purpose}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Prerequisites:</p>
                  <ul className="space-y-1">
                    {unburdeningProcess.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-success" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  {unburdeningProcess.steps.map((step) => (
                    <Card key={step.number} className="bg-card/50 border-l-4 border-l-orange-500" data-testid={`card-unburdening-${step.number}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                            {step.number}
                          </div>
                          {step.name}
                        </CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Steps:</p>
                          <ul className="space-y-1">
                            {step.instructions.map((instruction, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-orange-500/30">
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {step.example && (
                          <div className="bg-orange-500/10 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Example:</p>
                            <p className="text-sm italic">{step.example}</p>
                          </div>
                        )}

                        {step.keyPhrase && (
                          <div className="bg-primary p-3 rounded-lg text-primary-foreground">
                            <p className="text-sm font-medium mb-1">Key Phrase:</p>
                            <p className="text-sm italic">"{step.keyPhrase}"</p>
                          </div>
                        )}

                        {step.validatingStatements && (
                          <div className="bg-success/10 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-2">Validating Statements:</p>
                            <ul className="space-y-1">
                              {step.validatingStatements.map((statement, idx) => (
                                <li key={idx} className="text-sm italic pl-4 border-l-2 border-success/30">
                                  "{statement}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-success/10 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Aftercare:</p>
                  <ul className="space-y-1">
                    {unburdeningProcess.aftercare.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                  <p className="text-sm font-medium mb-1">⚠️ Critical Note:</p>
                  <p className="text-sm">{unburdeningProcess.criticalNote}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Practices */}
          <TabsContent value="practices" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {dailyIFSPractices.map((practice, idx) => (
                <Card key={idx} className="hover-elevate active-elevate-2" data-testid={`card-practice-${idx}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      {practice.title}
                    </CardTitle>
                    <CardDescription>{practice.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Steps:</p>
                      <ol className="space-y-1">
                        {practice.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="text-sm text-muted-foreground pl-4 border-l-2 border-yellow-500/30">
                            {stepIdx + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <Button variant="outline" className="w-full" data-testid={`button-practice-${idx}`}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Try This Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
