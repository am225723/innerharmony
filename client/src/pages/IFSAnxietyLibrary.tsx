import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Brain, 
  Heart, 
  Zap, 
  Shield, 
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ifsAnxietyKnowledge, groundingTechniques } from '@/lib/ifsAnxietyKnowledge';

export default function IFSAnxietyLibrary() {
  const [activeTab, setActiveTab] = useState('understanding');

  const tabIcons: Record<string, any> = {
    understanding: Brain,
    partsAndAnxiety: Shield,
    woundsToAnxiety: Heart,
    selfEnergyPractices: Sparkles,
    anxietyScenarios: Target,
    dailyPractices: Lightbulb,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-width mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              data-testid="button-back"
            >
              <Link href="/client-dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                IFS + Anxiety: A Complete Guide
              </h1>
              <p className="text-muted-foreground mt-1">
                Understanding and healing anxiety through Internal Family Systems
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
            {Object.entries(ifsAnxietyKnowledge).map(([key, section]) => {
              const Icon = tabIcons[key] || Brain;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2"
                  data-testid={`tab-${key}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {section.title.split(':')[0]}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(ifsAnxietyKnowledge).map(([key, section]) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {(() => {
                      const Icon = tabIcons[key] || Brain;
                      return <Icon className="w-6 h-6 text-primary" />;
                    })()}
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-8">
                      {section.content.map((item, idx) => (
                        <div key={idx} className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                  {idx + 1}
                                </span>
                              </div>
                              {item.heading}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {item.text}
                            </p>
                          </div>

                          {item.examples && item.examples.length > 0 && (
                            <div className="space-y-3 pl-10">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <AlertCircle className="w-4 h-4 text-accent" />
                                Real-World Examples
                              </div>
                              <div className="space-y-2">
                                {item.examples.map((example, exIdx) => (
                                  <div 
                                    key={exIdx}
                                    className="p-4 rounded-lg border border-border bg-muted/30 hover-elevate"
                                  >
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {example}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.practices && item.practices.length > 0 && (
                            <div className="space-y-3 pl-10">
                              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                IFS Practices
                              </div>
                              <div className="space-y-2">
                                {item.practices.map((practice, pIdx) => (
                                  <div 
                                    key={pIdx}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                                  >
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs font-bold text-primary">
                                        {pIdx + 1}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground leading-relaxed">
                                      {practice}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {idx < section.content.length - 1 && (
                            <Separator className="my-6" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Grounding Techniques Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-accent" />
              Quick Grounding Techniques
            </CardTitle>
            <CardDescription>
              10 powerful practices to access Self-energy during anxiety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groundingTechniques.map((technique, idx) => (
                <Card key={idx} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{technique.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {technique.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        #{idx + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Steps:</p>
                      <ol className="space-y-2">
                        {technique.steps.map((step, stepIdx) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary font-medium flex-shrink-0">
                              {stepIdx + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs font-medium text-primary mb-1">IFS Integration:</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {technique.ifsIntegration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-xl font-semibold mb-3">Ready to Work with Your Anxiety?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore interactive activities designed to help you understand and heal your anxiety through IFS
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild data-testid="button-anxiety-parts">
                  <Link href="/anxiety-parts-mapping">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Anxiety Parts Mapping
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-parts-dialogue">
                  <Link href="/parts-dialogue">
                    <Heart className="w-4 h-4 mr-2" />
                    Conversational Parts Dialogue
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-parts-map">
                  <Link href="/parts-mapping">
                    <Brain className="w-4 h-4 mr-2" />
                    Full Parts Map
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
