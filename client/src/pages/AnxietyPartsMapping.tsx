import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Shield, Flame, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AnxietyPart {
  id?: string;
  name: string;
  category: 'manager' | 'firefighter' | 'exile';
  anxietyRole: string;
  triggers: string[];
  bodySensations: string[];
  protectiveStrategies: string[];
  fearBehind: string;
}

export default function AnxietyPartsMapping() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [parts, setParts] = useState<AnxietyPart[]>([]);
  const [currentPart, setCurrentPart] = useState<AnxietyPart>({
    name: '',
    category: 'manager',
    anxietyRole: '',
    triggers: [''],
    bodySensations: [''],
    protectiveStrategies: [''],
    fearBehind: '',
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const { data: savedParts = [] } = useQuery<any[]>({
    queryKey: [`/api/parts?userId=${currentUser.id}`],
    enabled: !!currentUser.id,
  });

  const savePart = useMutation({
    mutationFn: async (part: AnxietyPart) => {
      // Transform to standard part format for saving
      const partData = {
        userId: currentUser.id,
        type: part.category, // Schema uses 'type' field, not 'category'
        name: part.name,
        description: `Anxiety Role: ${part.anxietyRole}\n\nFear Behind: ${part.fearBehind}`,
        triggers: part.triggers.filter(t => t.trim()),
        beliefs: part.protectiveStrategies.filter(s => s.trim()),
        emotions: part.bodySensations.filter(s => s.trim()),
      };
      
      const res = await apiRequest('POST', '/api/parts', partData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Part Saved",
        description: "Your anxiety part has been added to your parts map.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/parts?userId=${currentUser.id}`] });
      setParts([...parts, currentPart]);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save part. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCurrentPart({
      name: '',
      category: 'manager',
      anxietyRole: '',
      triggers: [''],
      bodySensations: [''],
      protectiveStrategies: [''],
      fearBehind: '',
    });
  };

  const addField = (field: 'triggers' | 'bodySensations' | 'protectiveStrategies') => {
    setCurrentPart({
      ...currentPart,
      [field]: [...currentPart[field], ''],
    });
  };

  const updateField = (
    field: 'triggers' | 'bodySensations' | 'protectiveStrategies',
    index: number,
    value: string
  ) => {
    const newArray = [...currentPart[field]];
    newArray[index] = value;
    setCurrentPart({ ...currentPart, [field]: newArray });
  };

  const removeField = (field: 'triggers' | 'bodySensations' | 'protectiveStrategies', index: number) => {
    if (currentPart[field].length > 1) {
      const newArray = currentPart[field].filter((_, i) => i !== index);
      setCurrentPart({ ...currentPart, [field]: newArray });
    }
  };

  const handleSubmit = () => {
    if (!currentPart.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please give your anxiety part a name.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPart.anxietyRole.trim()) {
      toast({
        title: "Anxiety Role Required",
        description: "Please describe what role this part plays in your anxiety.",
        variant: "destructive",
      });
      return;
    }

    savePart.mutate(currentPart);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'manager':
        return <Shield className="w-5 h-5" />;
      case 'firefighter':
        return <Flame className="w-5 h-5" />;
      case 'exile':
        return <Heart className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'manager':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/30';
      case 'firefighter':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950/30';
      case 'exile':
        return 'text-pink-600 bg-pink-50 dark:bg-pink-950/30';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
              <h1 className="text-3xl font-bold text-foreground">Anxiety Parts Mapping</h1>
              <p className="text-muted-foreground mt-1">
                Map how your parts contribute to anxiety patterns
              </p>
            </div>
          </div>
        </div>

        {/* Educational Context */}
        <Card className="mb-8 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <AlertCircle className="w-5 h-5" />
              Understanding Anxiety Through Parts
            </CardTitle>
            <CardDescription className="text-base">
              Anxiety is never "just anxiety" - it's always parts trying to protect you. Managers create worry
              to prevent bad things, Firefighters create panic to escape danger, and Exiles hold the original
              fear. Mapping these parts helps you understand your anxiety system with compassion.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Part Creation Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Map an Anxiety Part</CardTitle>
                <CardDescription>
                  Identify a part that contributes to your anxiety and explore its protective role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Part Name */}
                <div className="space-y-2">
                  <Label htmlFor="part-name">Part Name</Label>
                  <Input
                    id="part-name"
                    placeholder="e.g., The Worrier, The Perfectionist, The Panicker"
                    value={currentPart.name}
                    onChange={(e) => setCurrentPart({ ...currentPart, name: e.target.value })}
                    data-testid="input-part-name"
                  />
                </div>

                {/* Part Category */}
                <div className="space-y-2">
                  <Label htmlFor="part-category">Part Type</Label>
                  <Select
                    value={currentPart.category}
                    onValueChange={(value: 'manager' | 'firefighter' | 'exile') =>
                      setCurrentPart({ ...currentPart, category: value })
                    }
                  >
                    <SelectTrigger id="part-category" data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager (Proactive Worrier)</SelectItem>
                      <SelectItem value="firefighter">Firefighter (Panic/Escape)</SelectItem>
                      <SelectItem value="exile">Exile (Holds the Fear)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Anxiety Role */}
                <div className="space-y-2">
                  <Label htmlFor="anxiety-role">What role does this part play in your anxiety?</Label>
                  <Textarea
                    id="anxiety-role"
                    placeholder="e.g., Creates constant worry about work performance, Triggers panic in social situations, Holds childhood fear of abandonment"
                    value={currentPart.anxietyRole}
                    onChange={(e) => setCurrentPart({ ...currentPart, anxietyRole: e.target.value })}
                    className="min-h-[80px]"
                    data-testid="input-anxiety-role"
                  />
                </div>

                {/* Triggers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Triggers (What activates this part?)</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField('triggers')}
                      data-testid="button-add-trigger"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {currentPart.triggers.map((trigger, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder="e.g., Making a mistake, Being alone, Uncertain situations"
                        value={trigger}
                        onChange={(e) => updateField('triggers', idx, e.target.value)}
                        data-testid={`input-trigger-${idx}`}
                      />
                      {currentPart.triggers.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeField('triggers', idx)}
                          data-testid={`button-remove-trigger-${idx}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Body Sensations */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Body Sensations (Where/how anxiety shows up physically)</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField('bodySensations')}
                      data-testid="button-add-sensation"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {currentPart.bodySensations.map((sensation, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder="e.g., Chest tightness, Stomach knots, Racing heart, Shallow breathing"
                        value={sensation}
                        onChange={(e) => updateField('bodySensations', idx, e.target.value)}
                        data-testid={`input-sensation-${idx}`}
                      />
                      {currentPart.bodySensations.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeField('bodySensations', idx)}
                          data-testid={`button-remove-sensation-${idx}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Protective Strategies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Protective Strategies (How this part tries to keep you safe)</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField('protectiveStrategies')}
                      data-testid="button-add-strategy"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {currentPart.protectiveStrategies.map((strategy, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder="e.g., Constant planning, Avoiding social events, Seeking reassurance, Perfectionism"
                        value={strategy}
                        onChange={(e) => updateField('protectiveStrategies', idx, e.target.value)}
                        data-testid={`input-strategy-${idx}`}
                      />
                      {currentPart.protectiveStrategies.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeField('protectiveStrategies', idx)}
                          data-testid={`button-remove-strategy-${idx}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fear Behind */}
                <div className="space-y-2">
                  <Label htmlFor="fear-behind">The Fear Behind (What is this part protecting you from?)</Label>
                  <Textarea
                    id="fear-behind"
                    placeholder="e.g., Being rejected, Losing control, Being alone, Being seen as incompetent, Getting hurt again"
                    value={currentPart.fearBehind}
                    onChange={(e) => setCurrentPart({ ...currentPart, fearBehind: e.target.value })}
                    className="min-h-[80px]"
                    data-testid="input-fear-behind"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={savePart.isPending}
                    className="flex-1"
                    data-testid="button-save-part"
                  >
                    {savePart.isPending ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save to Parts Map
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={savePart.isPending}
                    data-testid="button-reset"
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Parts Display */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Anxiety Parts System</CardTitle>
                <CardDescription>
                  Parts you've mapped ({parts.length} session + {savedParts.length} saved)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parts.length === 0 && savedParts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No anxiety parts mapped yet.</p>
                    <p className="text-sm mt-1">Start by mapping a part on the left.</p>
                  </div>
                ) : (
                  <>
                    {parts.map((part, idx) => (
                      <Card key={idx} className={`border-2 ${getCategoryColor(part.category)}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${getCategoryColor(part.category)}`}>
                                {getCategoryIcon(part.category)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{part.name}</CardTitle>
                                <Badge variant="outline" className="mt-1">
                                  {part.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-foreground mb-1">Anxiety Role:</p>
                            <p className="text-muted-foreground">{part.anxietyRole}</p>
                          </div>

                          {part.triggers.filter(t => t.trim()).length > 0 && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Triggers:</p>
                              <div className="flex flex-wrap gap-1">
                                {part.triggers.filter(t => t.trim()).map((trigger, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {trigger}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {part.bodySensations.filter(s => s.trim()).length > 0 && (
                            <div>
                              <p className="font-medium text-foreground mb-1">Body Sensations:</p>
                              <div className="flex flex-wrap gap-1">
                                {part.bodySensations.filter(s => s.trim()).map((sensation, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {sensation}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {part.fearBehind && (
                            <div className="pt-2 border-t border-border">
                              <p className="font-medium text-primary mb-1">Fear Behind:</p>
                              <p className="text-muted-foreground italic">{part.fearBehind}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Link to full parts map */}
            <Button asChild variant="outline" className="w-full" data-testid="button-view-full-map">
              <Link href="/parts-mapping">
                View Complete Parts Map
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
