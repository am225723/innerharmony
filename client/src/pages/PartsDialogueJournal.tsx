import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Heart, ArrowLeft, Loader2, User, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PartsDialogueJournal() {
  const [, setLocation] = useLocation();
  const [partType, setPartType] = useState<string>('manager');
  const [partName, setPartName] = useState<string>('');
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [identifiedPatterns, setIdentifiedPatterns] = useState<string[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Query for user's parts to potentially save discovered parts
  const { data: existingParts = [] } = useQuery({
    queryKey: [`/api/parts?userId=${currentUser.id}`],
    enabled: !!currentUser.id,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageToSend: string) => {
      const res = await apiRequest('POST', '/api/ai/part-conversation', {
        partType,
        userMessage: messageToSend,
        conversationHistory: conversation,
        partName: partName || undefined,
      });
      return await res.json() as { response: string; identifiedPattern?: string; citations: string[] };
    },
    onSuccess: (data: { response: string; identifiedPattern?: string; citations: string[] }, messageToSend: string) => {
      // Add user message and AI response to conversation
      const userMsg: Message = { role: 'user', content: messageToSend };
      const partMsg: Message = { role: 'assistant', content: data.response };
      
      setConversation(prev => [...prev, userMsg, partMsg]);
      setCurrentMessage('');

      // Track identified patterns with functional updater to avoid stale state
      if (data.identifiedPattern) {
        setIdentifiedPatterns(prev => 
          prev.includes(data.identifiedPattern!) ? prev : [...prev, data.identifiedPattern!]
        );
      }
    },
    onError: () => {
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const savePartMutation = useMutation({
    mutationFn: async () => {
      const partNameToSave = partName || `${partType.charAt(0).toUpperCase() + partType.slice(1)} Part`;
      const description = identifiedPatterns.join(", ") || "Discovered through dialogue";
      
      return apiRequest('POST', '/api/parts', {
        userId: currentUser.id,
        name: partNameToSave,
        type: partType,
        description,
        triggers: identifiedPatterns,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/parts', currentUser.id] });
      toast({
        title: "Part Saved",
        description: `${partName || partType} has been added to your parts map!`,
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Could not save part. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!currentMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please type a message to send to your part.",
        variant: "destructive",
      });
      return;
    }
    const messageToSend = currentMessage;
    sendMessageMutation.mutate(messageToSend);
  };

  const handleReset = () => {
    setConversation([]);
    setIdentifiedPatterns([]);
    setPartName('');
  };

  const handleSavePart = () => {
    if (conversation.length === 0) {
      toast({
        title: "No Conversation",
        description: "Have a conversation first before saving the part.",
        variant: "destructive",
      });
      return;
    }
    savePartMutation.mutate();
  };

  const partDescriptions = {
    manager: "protective, strategic, keeps things under control",
    firefighter: "reactive, acts quickly to stop pain, uses distraction or escape",
    exile: "vulnerable, carries past wounds, wants to be seen and loved",
  };

  const starterPrompts = {
    manager: [
      "I notice you working so hard to keep everything perfect...",
      "What are you most afraid would happen if you stopped?",
      "Thank you for trying to protect me. What do you need me to know?",
    ],
    firefighter: [
      "I see you jump in when the pain gets too intense...",
      "What would happen if you didn't act so quickly?",
      "I appreciate that you're trying to help. What are you protecting me from?",
    ],
    exile: [
      "I'm here with you now. I see you.",
      "What do you need me to know about what happened?",
      "You're not alone anymore. I'm listening.",
    ],
  };

  if (!currentUser.id) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
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
          Parts Conversation
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Have a real dialogue with one of your internal parts. The AI will respond as the part would speak.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Conversation Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Part Selection Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Choose Your Part</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Part Type</label>
                  <Select value={partType} onValueChange={setPartType} disabled={conversation.length > 0}>
                    <SelectTrigger data-testid="select-part-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="firefighter">Firefighter</SelectItem>
                      <SelectItem value="exile">Exile</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {partDescriptions[partType as keyof typeof partDescriptions]}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Part Name (Optional)</label>
                  <Input
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g., The Perfectionist, The Worrier"
                    disabled={conversation.length > 0}
                    data-testid="input-part-name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Give this part a name for future reference
                  </p>
                </div>
              </div>

              {conversation.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    data-testid="button-reset"
                  >
                    Start New Conversation
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSavePart}
                    disabled={savePartMutation.isPending}
                    data-testid="button-save-part"
                  >
                    {savePartMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save to Parts Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation Messages */}
          <Card className="min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Conversation with {partName || `Your ${partType}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: '500px' }}>
                {conversation.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No messages yet. Start the conversation below!</p>
                    <p className="text-sm mt-2">Try one of the starter prompts on the right →</p>
                  </div>
                )}

                {conversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                      data-testid={`message-${idx}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type your message to the part..."
                  disabled={sendMessageMutation.isPending}
                  data-testid="input-message"
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!currentMessage.trim() || sendMessageMutation.isPending}
                  data-testid="button-send"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Identified Patterns */}
          {identifiedPatterns.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-primary" />
                  Patterns Discovered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {identifiedPatterns.map((pattern, index) => (
                    <Badge key={index} variant="secondary" data-testid={`pattern-${index}`}>
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Guidance Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">1. Choose Part Type</h4>
                <p className="text-muted-foreground">
                  Select Manager, Firefighter, or Exile and optionally give it a name.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1">2. Start Dialogue</h4>
                <p className="text-muted-foreground">
                  Send a message from Self. The AI will respond as the part would speak.
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-1">3. Save to Map</h4>
                <p className="text-muted-foreground">
                  When ready, save the discovered part to your parts map.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Starter Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {starterPrompts[partType as keyof typeof starterPrompts].map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => setCurrentMessage(prompt)}
                  disabled={sendMessageMutation.isPending}
                  data-testid={`starter-${idx}`}
                >
                  <span className="text-xs line-clamp-2">{prompt}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">The 8 C's of Self</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Lead with these qualities:
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
