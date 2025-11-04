import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWebSocket } from '@/hooks/useWebSocket';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Send, Circle, BookOpen, Brain, Map } from 'lucide-react';
import { format } from 'date-fns';
import { curriculumModules } from '@/lib/curriculumData';
import type { Session, SessionMessage } from '@shared/schema';

export default function SharedSessionWorkspace() {
  const { sessionId } = useParams();
  const [messageInput, setMessageInput] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Fetch session details
  const { data: session } = useQuery<Session>({
    queryKey: ['/api/sessions', sessionId],
    enabled: !!sessionId,
  });

  // Fetch messages from API
  const { data: persistedMessages = [], isLoading: messagesLoading } = useQuery<SessionMessage[]>({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId,
  });

  // WebSocket connection for real-time updates
  const {
    isConnected,
    messages: wsMessages,
    participants,
    sendMessage,
  } = useWebSocket(sessionId || '', currentUser.id, currentUser.displayName, currentUser.role);

  // Combine persisted and WebSocket messages
  const allMessages = [...persistedMessages, ...wsMessages];

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest(
        'POST',
        `/api/sessions/${sessionId}/messages`,
        {
          senderId: currentUser.id,
          senderRole: currentUser.role,
          content,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    const content = messageInput;
    setMessageInput('');
    
    // Send via WebSocket for real-time delivery
    sendMessage(content);
    
    // Also persist to database
    await createMessageMutation.mutateAsync(content);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!sessionId || !currentUser.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Invalid session or user</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2" data-testid="text-session-title">
              Collaborative Session
            </h1>
            {session && (
              <p className="text-muted-foreground" data-testid="text-session-info">
                {session.title || 'Therapy Session'}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? 'default' : 'secondary'} data-testid="status-connection">
              <Circle className={`w-2 h-2 mr-2 ${isConnected ? 'fill-current' : ''}`} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            <Badge variant="outline" data-testid="status-participants">
              <Users className="w-4 h-4 mr-2" />
              {participants.length} Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Main Content Area with Tabs */}
        <Card className="lg:col-span-2 flex flex-col">
          <Tabs defaultValue="chat" className="flex flex-col flex-1">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" data-testid="tab-chat">
                  <Send className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="learning" data-testid="tab-learning">
                  <Brain className="w-4 h-4 mr-2" />
                  Shared Learning
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
              <CardContent className="flex-1 flex flex-col overflow-hidden pt-0">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4" data-testid="container-messages">
              {messagesLoading && (
                <div className="text-center text-muted-foreground">Loading messages...</div>
              )}
              {allMessages.map((msg, index) => {
                const isCurrentUser = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    data-testid={`message-${index}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="font-semibold text-sm mb-1" data-testid={`text-sender-${index}`}>
                        {msg.senderRole === 'therapist' ? 'Therapist' : 'Client'}
                      </div>
                      <div data-testid={`text-content-${index}`}>{msg.content}</div>
                      <div className="text-xs opacity-70 mt-1" data-testid={`text-time-${index}`}>
                        {msg.createdAt && format(new Date(msg.createdAt), 'p')}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <Separator className="my-4" />

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send)"
                className="resize-none"
                rows={2}
                data-testid="input-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || createMessageMutation.isPending}
                size="icon"
                data-testid="button-send"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="learning" className="flex-1 overflow-hidden mt-0">
              <CardContent className="h-full overflow-y-auto pt-0">
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      Learn Together
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Explore IFS curriculum modules together during your session. Select a module below to view it collaboratively.
                    </p>
                  </div>

                  {selectedModuleId ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModuleId(null)}
                        data-testid="button-back-to-modules"
                      >
                        ← Back to Modules
                      </Button>
                      <div className="bg-primary/5 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          You and your therapist can view this module together:
                        </p>
                        <Link href={`/curriculum/${selectedModuleId}`} target="_blank">
                          <Button className="w-full" data-testid="button-open-module">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Open Module in New Tab
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Available Curriculum Modules</h3>
                      {curriculumModules.map((module) => (
                        <Card
                          key={module.id}
                          className="hover-elevate cursor-pointer"
                          onClick={() => setSelectedModuleId(module.id)}
                          data-testid={`module-card-${module.id}`}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Brain className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-semibold mb-1">
                                  {module.title}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {module.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {module.steps.length} steps
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {module.estimatedMinutes} min
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Sidebar - Notes & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session && (
                <>
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <Badge className="mt-1" data-testid="status-session">
                      {session.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Created</div>
                    <div className="text-sm text-muted-foreground mt-1" data-testid="text-created">
                      {format(new Date(session.createdAt), 'PPp')}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {participants.length === 0 ? (
                  <p className="text-sm text-muted-foreground" data-testid="text-no-participants">
                    No active participants
                  </p>
                ) : (
                  participants.map((participant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2"
                      data-testid={`participant-${index}`}
                    >
                      <Circle className="w-2 h-2 fill-current text-green-500" />
                      <span className="text-sm">{participant}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/parts-mapping">
                <Button variant="outline" className="w-full justify-start" data-testid="button-parts-map">
                  <Map className="w-4 h-4 mr-2" />
                  View Parts Map
                </Button>
              </Link>
              <Link href="/six-fs">
                <Button variant="outline" className="w-full justify-start" data-testid="button-protocol">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Protocol
                </Button>
              </Link>
              <Link href="/curriculum">
                <Button variant="outline" className="w-full justify-start" data-testid="button-curriculum">
                  <Brain className="w-4 h-4 mr-2" />
                  Full Curriculum
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
