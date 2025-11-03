import { useEffect, useRef, useState } from 'react';

export interface SessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: 'therapist' | 'client';
  messageType: 'chat' | 'prompt' | 'reflection';
  content: string;
  readBy: string[] | null;
  createdAt: Date;
}

export interface WebSocketMessage {
  type: 'join' | 'leave' | 'message' | 'part_update' | 'protocol_update' | 'note_update';
  sessionId: string;
  userId: string;
  userName?: string;
  data?: any;
}

export function useWebSocket(sessionId: string, userId: string, userName: string, userRole: 'therapist' | 'client') {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Join the session room with role for authorization
      ws.send(JSON.stringify({
        type: 'join',
        sessionId,
        userId,
        userName,
        role: userRole,
      } as WebSocketMessage));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'new_message':
            // Server sends new message
            if (message.message) {
              setMessages(prev => [...prev, message.message]);
            }
            break;
          case 'participant_joined':
            // Update participants based on server's boolean map
            if (message.participants) {
              const participantList: string[] = [];
              if (message.participants.therapist) participantList.push('Therapist');
              if (message.participants.client) participantList.push('Client');
              setParticipants(participantList);
            }
            break;
          case 'participant_left':
            // Update participants when someone leaves
            setParticipants(prev => prev.filter(p => 
              p.toLowerCase() !== message.role?.toLowerCase()
            ));
            break;
          case 'part_updated':
            // Handle parts update
            window.dispatchEvent(new CustomEvent('parts-update', { detail: message.part }));
            break;
          case 'note_updated':
            // Handle note update
            window.dispatchEvent(new CustomEvent('note-update', { detail: message.note }));
            break;
          case 'error':
            // Handle server errors
            console.error('WebSocket server error:', message.message);
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'leave',
          sessionId,
          userId,
          role: userRole,
        } as WebSocketMessage));
      }
      ws.close();
    };
  }, [sessionId, userId, userName, userRole]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        sessionId,
        userId,
        userName,
        data: { content },
      } as WebSocketMessage));
    }
  };

  const updateParts = (parts: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'part_update',
        sessionId,
        userId,
        data: parts,
      } as WebSocketMessage));
    }
  };

  return {
    isConnected,
    messages,
    participants,
    sendMessage,
    updateParts,
  };
}
