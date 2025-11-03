import { useEffect, useRef, useState } from 'react';

export interface SessionMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
}

export interface WebSocketMessage {
  type: 'JOIN_SESSION' | 'LEAVE_SESSION' | 'MESSAGE' | 'PARTS_UPDATE' | 'PROTOCOL_UPDATE' | 'NOTE_UPDATE';
  sessionId: string;
  userId: string;
  userName?: string;
  data?: any;
}

export function useWebSocket(sessionId: string, userId: string, userName: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Join the session room
      ws.send(JSON.stringify({
        type: 'JOIN_SESSION',
        sessionId,
        userId,
        userName,
      } as WebSocketMessage));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'MESSAGE':
            setMessages(prev => [...prev, message.data]);
            break;
          case 'PARTICIPANTS_UPDATE':
            setParticipants(message.data);
            break;
          case 'PARTS_UPDATE':
            // Handle parts update
            window.dispatchEvent(new CustomEvent('parts-update', { detail: message.data }));
            break;
          case 'NOTE_UPDATE':
            // Handle note update
            window.dispatchEvent(new CustomEvent('note-update', { detail: message.data }));
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
          type: 'LEAVE_SESSION',
          sessionId,
          userId,
        } as WebSocketMessage));
      }
      ws.close();
    };
  }, [sessionId, userId, userName]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'MESSAGE',
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
        type: 'PARTS_UPDATE',
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
