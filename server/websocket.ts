import { WebSocketServer, WebSocket } from "ws";
import { Server as HTTPServer } from "http";
import type { User } from "@shared/schema";
import { storage } from "./storage";

interface SessionRoom {
  sessionId: string;
  therapist: WebSocket | null;
  client: WebSocket | null;
  therapistId: string | null;
  clientId: string | null;
}

const sessionRooms = new Map<string, SessionRoom>();

interface WSMessage {
  type: "join" | "leave" | "part_update" | "part_delete" | "protocol_update" | "message" | "note_update" | "cursor_move";
  sessionId?: string;
  userId?: string;
  role?: "therapist" | "client";
  data?: any;
}

export function setupWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");

    ws.on("message", (rawMessage: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(rawMessage.toString());
        
        switch (message.type) {
          case "join":
            handleJoin(ws, message).catch(err => {
              console.error("handleJoin error:", err);
            });
            break;
          
          case "leave":
            handleLeave(ws, message);
            break;
          
          case "part_update":
            handlePartUpdate(ws, message);
            break;
          
          case "part_delete":
            handlePartDelete(ws, message);
            break;
          
          case "protocol_update":
            handleProtocolUpdate(ws, message);
            break;
          
          case "message":
            handleMessage(ws, message);
            break;
          
          case "note_update":
            handleNoteUpdate(ws, message);
            break;
          
          case "cursor_move":
            handleCursorMove(ws, message);
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      // Clean up any room associations
      for (const [sessionId, room] of Array.from(sessionRooms.entries())) {
        if (room.therapist === ws) {
          room.therapist = null;
          room.therapistId = null;
          broadcastToRoom(sessionId, {
            type: "participant_left",
            role: "therapist"
          });
        }
        if (room.client === ws) {
          room.client = null;
          room.clientId = null;
          broadcastToRoom(sessionId, {
            type: "participant_left",
            role: "client"
          });
        }
        
        // Remove empty rooms
        if (!room.therapist && !room.client) {
          sessionRooms.delete(sessionId);
        }
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return wss;
}

async function handleJoin(ws: WebSocket, message: WSMessage) {
  const { sessionId, userId, role } = message;
  
  if (!sessionId || !userId || !role) {
    ws.send(JSON.stringify({ type: "error", message: "Missing required fields" }));
    return;
  }

  // SECURITY: Verify user is authorized to join this session
  try {
    const session = await storage.getSession(sessionId);
    if (!session) {
      ws.send(JSON.stringify({ type: "error", message: "Session not found" }));
      return;
    }

    // Verify user is either the therapist or client for this session
    const isAuthorized = 
      (role === "therapist" && session.therapistId === userId) ||
      (role === "client" && session.clientId === userId);

    if (!isAuthorized) {
      ws.send(JSON.stringify({ type: "error", message: "Unauthorized: You are not a participant in this session" }));
      console.warn(`Unauthorized join attempt: User ${userId} tried to join session ${sessionId} as ${role}`);
      return;
    }
  } catch (error) {
    console.error("Authorization check failed:", error);
    ws.send(JSON.stringify({ type: "error", message: "Authorization failed" }));
    return;
  }

  let room = sessionRooms.get(sessionId);
  
  if (!room) {
    room = {
      sessionId,
      therapist: null,
      client: null,
      therapistId: null,
      clientId: null,
    };
    sessionRooms.set(sessionId, room);
  }

  if (role === "therapist") {
    room.therapist = ws;
    room.therapistId = userId;
  } else {
    room.client = ws;
    room.clientId = userId;
  }

  // Notify both participants about who's in the room
  broadcastToRoom(sessionId, {
    type: "participant_joined",
    role,
    userId,
    participants: {
      therapist: room.therapistId !== null,
      client: room.clientId !== null,
    }
  });

  console.log(`User ${userId} (${role}) joined session ${sessionId}`);
}

function handleLeave(ws: WebSocket, message: WSMessage) {
  const { sessionId, role } = message;
  
  if (!sessionId) return;

  const room = sessionRooms.get(sessionId);
  if (!room) return;

  if (role === "therapist" && room.therapist === ws) {
    room.therapist = null;
    room.therapistId = null;
  } else if (role === "client" && room.client === ws) {
    room.client = null;
    room.clientId = null;
  }

  broadcastToRoom(sessionId, {
    type: "participant_left",
    role
  });

  if (!room.therapist && !room.client) {
    sessionRooms.delete(sessionId);
  }
}

function handlePartUpdate(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  // Broadcast to the other participant in the session
  broadcastToRoom(sessionId, {
    type: "part_updated",
    part: data
  }, ws);
}

function handlePartDelete(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  broadcastToRoom(sessionId, {
    type: "part_deleted",
    partId: data.partId
  }, ws);
}

function handleProtocolUpdate(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  broadcastToRoom(sessionId, {
    type: "protocol_updated",
    protocol: data
  }, ws);
}

function handleMessage(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  broadcastToRoom(sessionId, {
    type: "new_message",
    message: data
  }, ws);
}

function handleNoteUpdate(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  broadcastToRoom(sessionId, {
    type: "note_updated",
    note: data
  }, ws);
}

function handleCursorMove(ws: WebSocket, message: WSMessage) {
  const { sessionId, data } = message;
  
  if (!sessionId || !data) return;

  broadcastToRoom(sessionId, {
    type: "cursor_moved",
    cursor: data
  }, ws);
}

function broadcastToRoom(sessionId: string, data: any, exclude?: WebSocket) {
  const room = sessionRooms.get(sessionId);
  if (!room) return;

  const message = JSON.stringify(data);

  if (room.therapist && room.therapist !== exclude && room.therapist.readyState === WebSocket.OPEN) {
    room.therapist.send(message);
  }

  if (room.client && room.client !== exclude && room.client.readyState === WebSocket.OPEN) {
    room.client.send(message);
  }
}

export function getActiveRooms() {
  return Array.from(sessionRooms.keys());
}

export function getRoomParticipants(sessionId: string) {
  const room = sessionRooms.get(sessionId);
  if (!room) return null;

  return {
    therapist: room.therapistId,
    client: room.clientId,
  };
}
