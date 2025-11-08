import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as aiInsights from "./ai-insights";
import { aiService } from "./ai-service";
import { supabase } from "./supabase";
import { requireAuth, type AuthRequest } from "./middleware/auth";
import {
  insertUserSchema,
  insertSessionSchema,
  insertActivitySchema,
  insertPartSchema,
  insertJournalEntrySchema,
  insertAIInsightSchema,
  insertMediaSchema,
  insertLessonSchema,
  insertLessonActivitySchema,
  insertLessonProgressSchema,
  insertSessionMessageSchema,
  insertSessionNoteSchema,
  insertDailyAnxietyCheckinSchema,
  insertBodySensationSchema,
  insertGroundingTechniqueProgressSchema,
  insertAnxietyTimelineSchema,
  insertTherapistAssignmentSchema,
  insertSessionGoalSchema,
  insertTherapistNoteSchema,
  loginCredentialsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes - Supabase Auth
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Authentication service not configured" });
      }

      const { email, password, role, displayName } = req.body;
      
      if (!email || !password || !role || !displayName) {
        return res.status(400).json({ error: "Email, password, role, and display name are required" });
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            display_name: displayName,
          },
        },
      });
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      if (data.user) {
        // Check if user already exists in database (legacy users created before Supabase)
        const existingUser = await storage.getUserByEmail(data.user.email!);
        
        if (existingUser) {
          // Link existing user to Supabase by updating supabaseAuthId
          await storage.updateUser(existingUser.id, {
            supabaseAuthId: data.user.id,
            role: role as "therapist" | "client",
            displayName,
          });
        } else {
          // Create new user with Supabase ID
          await storage.createUser({
            id: data.user.id,
            supabaseAuthId: data.user.id,
            email: data.user.email!,
            username: data.user.email!.split('@')[0],
            role: role as "therapist" | "client",
            displayName,
          });
        }
      }
      
      res.json({ 
        user: data.user,
        session: data.session,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Authentication service not configured" });
      }

      const credentials = loginCredentialsSchema.parse(req.body);
      const { email, password } = credentials;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return res.status(401).json({ error: error.message });
      }
      
      let user = await storage.getUserByEmail(email);
      
      if (!user && data.user) {
        user = await storage.createUser({
          id: data.user.id,
          email: data.user.email!,
          username: data.user.email!.split('@')[0],
          role: (data.user.user_metadata?.role as "therapist" | "client") || "client",
          displayName: data.user.user_metadata?.display_name || data.user.email!.split('@')[0],
        });
      }
      
      res.json({ 
        user,
        session: data.session,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      if (!supabase) {
        return res.status(503).json({ error: "Authentication service not configured" });
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User Routes - Protected
  app.get("/api/users", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const role = req.query.role as string | undefined;
      
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const requestingUser = await storage.getUser(req.user.id);
      if (!requestingUser || requestingUser.role !== "therapist") {
        return res.status(403).json({ error: "Forbidden - therapist access only" });
      }
      
      const users = await storage.getAllUsers(role);
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const requestingUser = await storage.getUser(req.user.id);
      if (!requestingUser || requestingUser.role !== "therapist") {
        return res.status(403).json({ error: "Forbidden - therapist access only" });
      }
      
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Session Routes - Protected
  app.get("/api/sessions", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const requestedUserId = req.query.userId as string;
      let userId = req.user.id;
      
      if (requestedUserId && requestedUserId !== req.user.id) {
        const requestingUser = await storage.getUser(req.user.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' sessions" });
        }
        userId = requestedUserId;
      }
      
      const sessions = await storage.getSessionsByUserId(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/sessions/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isParticipant = session.therapistId === req.user!.id || session.clientId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isParticipant && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      
      // Validate therapistId and clientId - only therapists can create sessions
      const requestingUser = await storage.getUser(req.user!.id);
      if (!requestingUser || requestingUser.role !== "therapist") {
        return res.status(403).json({ error: "Forbidden - only therapists can create sessions" });
      }
      
      // Verify therapistId matches authenticated user
      if (sessionData.therapistId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden - therapists can only create sessions for themselves" });
      }
      
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/sessions/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const existingSession = await storage.getSession(req.params.id);
      if (!existingSession) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isParticipant = existingSession.therapistId === req.user!.id || existingSession.clientId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isParticipant && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      const session = await storage.updateSession(req.params.id, req.body);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Activity Routes
  app.get("/api/activities", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const activities = await storage.getActivitiesByUserId(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/activities/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = activity.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/activities", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (activityData.userId && activityData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        activityData.userId = req.user!.id;
      }
      
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/activities/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const existingActivity = await storage.getActivity(req.params.id);
      if (!existingActivity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = existingActivity.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      const activity = await storage.updateActivity(req.params.id, req.body);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Parts Routes
  app.get("/api/parts", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const parts = await storage.getPartsByUserId(userId);
      res.json(parts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/parts/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const part = await storage.getPart(req.params.id);
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = part.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/parts", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const partData = insertPartSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (partData.userId && partData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        partData.userId = req.user!.id;
      }
      
      const part = await storage.createPart(partData);
      
      // Create or update Parts Mapping activity (scoped by sessionId if present)
      const existingActivities = await storage.getActivitiesByUserId(partData.userId);
      const partsActivity = existingActivities.find(
        a => a.type === "parts_mapping" && 
             a.status !== "completed" &&
             (partData.sessionId ? a.sessionId === partData.sessionId : a.sessionId === null)
      );
      
      if (!partsActivity) {
        // Create new in-progress activity for Parts Mapping
        await storage.createActivity({
          userId: partData.userId,
          sessionId: partData.sessionId || null,
          type: "parts_mapping",
          title: "Parts Mapping",
          status: "in_progress",
          data: {},
        });
      }
      
      res.status(201).json(part);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/parts/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const existingPart = await storage.getPart(req.params.id);
      if (!existingPart) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = existingPart.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      const part = await storage.updatePart(req.params.id, req.body);
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/parts/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const existingPart = await storage.getPart(req.params.id);
      if (!existingPart) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = existingPart.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      const deleted = await storage.deletePart(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Journal Entry Routes
  app.get("/api/journal-entries", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const entries = await storage.getJournalEntriesByUserId(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/journal-entries/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = entry.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/journal-entries", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (entryData.userId && entryData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        entryData.userId = req.user!.id;
      }
      
      const entry = await storage.createJournalEntry(entryData);
      
      // Create or update activity record for this protocol
      const activityType = entryData.protocol === "six_fs" ? "six_fs" : 
                          entryData.protocol === "letter" ? "letter_writing" :
                          entryData.protocol === "witnessing" ? "witnessing" :
                          entryData.protocol === "unburdening" ? "unburdening" :
                          entryData.protocol;
      
      const activityTitle = activityType === "six_fs" ? "6 F's Protocol" :
                           activityType === "letter_writing" ? "Letter to Inner Child" :
                           activityType === "witnessing" ? "Witnessing Protocol" :
                           activityType === "unburdening" ? "Unburdening Ceremony" :
                           "Journal Entry";
      
      // Check if activity already exists for this user/type/session
      const existingActivities = await storage.getActivitiesByUserId(entryData.userId);
      const existingActivity = existingActivities.find(
        a => a.type === activityType && 
             a.status !== "completed" &&
             (entryData.sessionId ? a.sessionId === entryData.sessionId : a.sessionId === null)
      );
      
      if (existingActivity) {
        // Update existing activity to completed
        await storage.updateActivity(existingActivity.id, {
          status: "completed",
          completedAt: new Date(),
          data: { journalEntryId: entry.id },
        });
      } else {
        // Create new completed activity
        await storage.createActivity({
          userId: entryData.userId,
          sessionId: entryData.sessionId || null,
          type: activityType as any,
          title: activityTitle,
          status: "completed",
          data: { journalEntryId: entry.id },
        });
      }
      
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/journal-entries/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const existingEntry = await storage.getJournalEntry(req.params.id);
      if (!existingEntry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      
      const requestingUser = await storage.getUser(req.user!.id);
      const isOwner = existingEntry.userId === req.user!.id;
      const isTherapist = requestingUser?.role === "therapist";
      
      if (!isOwner && !isTherapist) {
        return res.status(403).json({ error: "Forbidden - insufficient permissions" });
      }
      
      const entry = await storage.updateJournalEntry(req.params.id, req.body);
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Daily Anxiety Check-in Routes
  app.get("/api/anxiety-checkins", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const checkins = await storage.getDailyAnxietyCheckins(userId, limit);
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/anxiety-checkins", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const checkinData = insertDailyAnxietyCheckinSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (checkinData.userId && checkinData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        checkinData.userId = req.user!.id;
      }
      
      const checkin = await storage.createDailyAnxietyCheckin(checkinData);
      res.status(201).json(checkin);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Body Sensations Routes
  app.get("/api/body-sensations", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const sensations = await storage.getBodySensations(userId);
      res.json(sensations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/body-sensations", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const sensationData = insertBodySensationSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (sensationData.userId && sensationData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        sensationData.userId = req.user!.id;
      }
      
      const sensation = await storage.createBodySensation(sensationData);
      res.status(201).json(sensation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/body-sensations/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify ownership before deletion
      const sensations = await storage.getBodySensations(userId);
      const sensation = sensations.find(s => s.id === id);
      
      if (!sensation) {
        return res.status(404).json({ error: "Body sensation not found or unauthorized" });
      }
      
      const success = await storage.deleteBodySensation(id);
      
      if (!success) {
        return res.status(500).json({ error: "Failed to delete sensation" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Anxiety Timeline Routes
  app.get("/api/anxiety-timeline", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const timeline = await storage.getAnxietyTimeline(userId);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/anxiety-timeline", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const eventData = insertAnxietyTimelineSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (eventData.userId && eventData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        eventData.userId = req.user!.id;
      }
      
      const event = await storage.createTimelineEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/anxiety-timeline/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify ownership before update
      const timeline = await storage.getAnxietyTimeline(userId);
      const event = timeline.find(e => e.id === id);
      
      if (!event) {
        return res.status(404).json({ error: "Timeline event not found or unauthorized" });
      }
      
      const updated = await storage.updateTimelineEvent(id, req.body);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update event" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/anxiety-timeline/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify ownership before deletion
      const timeline = await storage.getAnxietyTimeline(userId);
      const event = timeline.find(e => e.id === id);
      
      if (!event) {
        return res.status(404).json({ error: "Timeline event not found or unauthorized" });
      }
      
      const success = await storage.deleteTimelineEvent(id);
      
      if (!success) {
        return res.status(500).json({ error: "Failed to delete event" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Grounding Technique Progress Routes
  app.get("/api/grounding-progress", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const progress = await storage.getGroundingTechniqueProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Get grounding progress error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/grounding-progress", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const insertResult = insertGroundingTechniqueProgressSchema.safeParse(req.body);
      
      if (!insertResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: insertResult.error.flatten() 
        });
      }
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (insertResult.data.userId && insertResult.data.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        insertResult.data.userId = req.user!.id;
      }
      
      // Check if progress already exists for this technique
      const existing = await storage.getGroundingTechniqueProgressByName(
        insertResult.data.userId,
        insertResult.data.techniqueName
      );
      
      if (existing) {
        // Update existing progress
        const updated = await storage.updateGroundingTechniqueProgress(existing.id, {
          practiced: true,
          timesCompleted: (existing.timesCompleted || 0) + 1,
          lastPracticedAt: new Date(),
          effectiveness: insertResult.data.effectiveness,
          notes: insertResult.data.notes,
        });
        return res.json(updated);
      }
      
      // Create new progress entry
      const progress = await storage.createGroundingTechniqueProgress({
        ...insertResult.data,
        practiced: true,
        timesCompleted: 1,
        lastPracticedAt: new Date(),
      });
      
      res.json(progress);
    } catch (error) {
      console.error("Create grounding progress error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/grounding-progress/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify ownership before update
      const allProgress = await storage.getGroundingTechniqueProgress(userId);
      const progressItem = allProgress.find(p => p.id === id);
      
      if (!progressItem) {
        return res.status(404).json({ error: "Progress record not found or unauthorized" });
      }
      
      const updated = await storage.updateGroundingTechniqueProgress(id, req.body);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update progress" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update grounding progress error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Therapist Assignment Routes
  app.get("/api/assignments/therapist/:therapistId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { therapistId } = req.params;
      const assignments = await storage.getAssignmentsByTherapist(therapistId);
      res.json(assignments);
    } catch (error) {
      console.error("Get therapist assignments error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/assignments/client/:clientId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { clientId } = req.params;
      const assignments = await storage.getAssignmentsByClient(clientId);
      res.json(assignments);
    } catch (error) {
      console.error("Get client assignments error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/assignments", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const insertResult = insertTherapistAssignmentSchema.safeParse(req.body);
      
      if (!insertResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: insertResult.error.flatten() 
        });
      }
      
      // Validate therapistId - only therapists can create assignments and only for themselves
      const requestingUser = await storage.getUser(req.user!.id);
      if (!requestingUser || requestingUser.role !== "therapist") {
        return res.status(403).json({ error: "Forbidden - only therapists can create assignments" });
      }
      
      // Verify therapistId matches authenticated user
      if (insertResult.data.therapistId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden - therapists can only create assignments for themselves" });
      }
      
      const assignment = await storage.createAssignment(insertResult.data);
      res.json(assignment);
    } catch (error) {
      console.error("Create assignment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/assignments/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Fetch all assignments for the user (as therapist or client) to verify ownership
      const therapistAssignments = await storage.getAssignmentsByTherapist(userId);
      const clientAssignments = await storage.getAssignmentsByClient(userId);
      
      const assignment = [...therapistAssignments, ...clientAssignments].find(a => a.id === id);
      
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found or unauthorized" });
      }
      
      // Determine role: is user the therapist or the client?
      const isTherapist = assignment.therapistId === userId;
      const isClient = assignment.clientId === userId;
      
      // Define allowed fields per role
      let allowedUpdates: Partial<typeof assignment> = {};
      
      if (isTherapist) {
        // Therapist can update: title, description, dueDate, priority, status, notes, activityType, activityId
        const { title, description, dueDate, priority, status, notes, activityType, activityId } = req.body;
        allowedUpdates = { title, description, dueDate, priority, status, notes, activityType, activityId };
      } else if (isClient) {
        // Client can ONLY update: status, notes, completedAt
        const { status, notes, completedAt } = req.body;
        allowedUpdates = { status, notes, completedAt };
      } else {
        return res.status(403).json({ error: "Unauthorized to update this assignment" });
      }
      
      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
          delete allowedUpdates[key as keyof typeof allowedUpdates];
        }
      });
      
      // Validate the allowed updates with partial schema
      const partialSchema = insertTherapistAssignmentSchema.partial();
      const validationResult = partialSchema.safeParse(allowedUpdates);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid update data", 
          details: validationResult.error.flatten() 
        });
      }
      
      const updateData: any = { ...validationResult.data };
      if (updateData.dueDate && typeof updateData.dueDate === 'string') {
        updateData.dueDate = new Date(updateData.dueDate);
      }
      if (updateData.completedAt && typeof updateData.completedAt === 'string') {
        updateData.completedAt = new Date(updateData.completedAt);
      }
      
      const updated = await storage.updateAssignment(id, updateData);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update assignment" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update assignment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/assignments/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Only therapist who created the assignment can delete it
      const therapistAssignments = await storage.getAssignmentsByTherapist(userId);
      const assignment = therapistAssignments.find(a => a.id === id);
      
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found or unauthorized - only the therapist who created an assignment can delete it" });
      }
      
      const success = await storage.deleteAssignment(id);
      
      if (!success) {
        return res.status(500).json({ error: "Failed to delete assignment" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete assignment error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Session Goals Routes
  app.get("/api/goals/therapist/:therapistId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { therapistId } = req.params;
      const goals = await storage.getGoalsByTherapist(therapistId);
      res.json(goals);
    } catch (error) {
      console.error("Get therapist goals error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/goals/client/:clientId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { clientId } = req.params;
      const goals = await storage.getGoalsByClient(clientId);
      res.json(goals);
    } catch (error) {
      console.error("Get client goals error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/goals", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const insertResult = insertSessionGoalSchema.safeParse(req.body);
      
      if (!insertResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: insertResult.error.flatten() 
        });
      }
      
      // Validate that the caller is the therapist creating the goal
      if (insertResult.data.therapistId !== userId) {
        return res.status(403).json({ error: "Unauthorized - can only create goals as yourself" });
      }
      
      const goal = await storage.createGoal(insertResult.data);
      res.json(goal);
    } catch (error) {
      console.error("Create goal error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/goals/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Fetch goals to verify ownership
      const therapistGoals = await storage.getGoalsByTherapist(userId);
      const clientGoals = await storage.getGoalsByClient(userId);
      
      const goal = [...therapistGoals, ...clientGoals].find(g => g.id === id);
      
      if (!goal) {
        return res.status(404).json({ error: "Goal not found or unauthorized" });
      }
      
      // Determine role
      const isTherapist = goal.therapistId === userId;
      const isClient = goal.clientId === userId;
      
      // Define allowed fields per role
      let allowedUpdates: Partial<typeof goal> = {};
      
      if (isTherapist) {
        // Therapist can update all fields except immutable ones
        const { goalText, category, targetDate, status, progress, clientNotes, therapistNotes } = req.body;
        allowedUpdates = { goalText, category, targetDate, status, progress, clientNotes, therapistNotes };
      } else if (isClient) {
        // Client can ONLY update: progress, status, clientNotes
        const { progress, status, clientNotes } = req.body;
        allowedUpdates = { progress, status, clientNotes };
      } else {
        return res.status(403).json({ error: "Unauthorized to update this goal" });
      }
      
      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
          delete allowedUpdates[key as keyof typeof allowedUpdates];
        }
      });
      
      // Validate with partial schema
      const partialSchema = insertSessionGoalSchema.partial();
      const validationResult = partialSchema.safeParse(allowedUpdates);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid update data", 
          details: validationResult.error.flatten() 
        });
      }
      
      const updateData: any = { ...validationResult.data };
      if (updateData.targetDate && typeof updateData.targetDate === 'string') {
        updateData.targetDate = new Date(updateData.targetDate);
      }
      
      const updated = await storage.updateGoal(id, updateData);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update goal" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update goal error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/goals/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Only therapist who created the goal can delete it
      const therapistGoals = await storage.getGoalsByTherapist(userId);
      const goal = therapistGoals.find(g => g.id === id);
      
      if (!goal) {
        return res.status(404).json({ error: "Goal not found or unauthorized - only the therapist who created a goal can delete it" });
      }
      
      const success = await storage.deleteGoal(id);
      
      if (!success) {
        return res.status(500).json({ error: "Failed to delete goal" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete goal error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Therapist Notes Routes
  app.get("/api/notes/therapist/:therapistId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { therapistId } = req.params;
      const notes = await storage.getNotesByTherapist(therapistId);
      res.json(notes);
    } catch (error) {
      console.error("Get therapist notes error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/notes/client/:therapistId/:clientId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { therapistId, clientId } = req.params;
      const notes = await storage.getNotesByClient(therapistId, clientId);
      res.json(notes);
    } catch (error) {
      console.error("Get client notes error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/notes/search", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const therapistId = req.query.therapistId as string;
      const searchTerm = req.query.q as string || "";
      const clientId = req.query.clientId as string | undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
      
      if (!therapistId) {
        return res.status(400).json({ error: "therapistId required" });
      }
      
      const notes = await storage.searchNotes(therapistId, searchTerm, { clientId, tags });
      res.json(notes);
    } catch (error) {
      console.error("Search notes error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/notes", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const insertResult = insertTherapistNoteSchema.safeParse(req.body);
      
      if (!insertResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: insertResult.error.flatten() 
        });
      }
      
      // Validate that the caller is the therapist creating the note
      if (insertResult.data.therapistId !== userId) {
        return res.status(403).json({ error: "Unauthorized - can only create notes as yourself" });
      }
      
      const note = await storage.createNote(insertResult.data);
      res.json(note);
    } catch (error) {
      console.error("Create note error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/notes/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify therapist ownership
      const therapistNotes = await storage.getNotesByTherapist(userId);
      const note = therapistNotes.find(n => n.id === id);
      
      if (!note) {
        return res.status(404).json({ error: "Note not found or unauthorized - only the therapist who created a note can update it" });
      }
      
      // Therapist can update all fields except immutable ones
      const { clientId, sessionId, sessionDate, noteContent, taggedPartIds, tags, isPrivate } = req.body;
      const allowedUpdates = { clientId, sessionId, sessionDate, noteContent, taggedPartIds, tags, isPrivate };
      
      // Remove undefined values
      Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
          delete allowedUpdates[key as keyof typeof allowedUpdates];
        }
      });
      
      // Validate with partial schema
      const partialSchema = insertTherapistNoteSchema.partial();
      const validationResult = partialSchema.safeParse(allowedUpdates);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid update data", 
          details: validationResult.error.flatten() 
        });
      }
      
      const updated = await storage.updateNote(id, validationResult.data);
      
      if (!updated) {
        return res.status(500).json({ error: "Failed to update note" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Update note error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/notes/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Only therapist who created the note can delete it
      const therapistNotes = await storage.getNotesByTherapist(userId);
      const note = therapistNotes.find(n => n.id === id);
      
      if (!note) {
        return res.status(404).json({ error: "Note not found or unauthorized - only the therapist who created a note can delete it" });
      }
      
      const success = await storage.deleteNote(id);
      
      if (!success) {
        return res.status(500).json({ error: "Failed to delete note" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete note error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Test Perplexity API
  app.get("/api/test-perplexity", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.PERPLEXITY_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "PERPLEXITY_API_KEY not set" });
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            { role: "system", content: "Be precise and concise." },
            { role: "user", content: "Say 'Hello from Perplexity!'" }
          ],
          temperature: 0.2,
          stream: false,
        }),
      });

      const data = await response.json();
      res.json({ status: response.status, data });
    } catch (error) {
      console.error('Perplexity test error:', error);
      res.status(500).json({ error: String(error) });
    }
  });

  // AI Insights Routes
  app.get("/api/ai-insights", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const insights = await storage.getAIInsightsByUserId(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-insights/generate", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { userId, sessionId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      // Gather user data for AI insight
      const parts = await storage.getPartsByUserId(userId);
      const journalEntries = await storage.getJournalEntriesByUserId(userId);
      const recentActivities = await storage.getActivitiesByUserId(userId);
      
      // Build context for AI
      const partsContext = parts.map(p => 
        `${p.name} (${p.type}): ${p.description || 'No description'}`
      ).join('\n');
      
      const journalContext = journalEntries.slice(0, 3).map(j => 
        `${j.protocol}: ${typeof j.responses === 'object' && j.responses ? 'Completed' : 'In progress'}`
      ).join('\n');

      const systemPrompt = `You are a compassionate Internal Family Systems (IFS) therapy guide. Based on the client's parts and therapeutic work, provide a brief, personalized insight (2-3 paragraphs) that:
1. Acknowledges their progress and self-awareness
2. Offers a gentle IFS-based perspective on their internal system
3. Suggests a specific next step for their healing journey

Be warm, validating, and use IFS terminology naturally.`;

      const userPrompt = `Client's Internal Parts:
${partsContext || 'No parts mapped yet'}

Recent Therapeutic Work:
${journalContext || 'No journal entries yet'}

Provide a personalized IFS insight for this client.`;

      // Call Perplexity API
      const apiKey = process.env.PERPLEXITY_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Perplexity API key not configured" });
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Perplexity API error:', response.status, errorText);
        throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Perplexity API response:', JSON.stringify(data, null, 2));
      const generatedInsight = data.choices[0]?.message?.content;

      if (!generatedInsight) {
        throw new Error("No insight generated from AI");
      }

      // Store the insight
      const insight = await storage.createAIInsight({
        userId,
        sessionId: sessionId || null,
        context: `Based on ${parts.length} parts, ${journalEntries.length} journal entries, and ${recentActivities.length} activities`,
        insight: generatedInsight,
      });

      res.status(201).json(insight);
    } catch (error) {
      console.error('AI insight generation error:', error);
      res.status(500).json({ error: "Failed to generate AI insight" });
    }
  });

  app.post("/api/ai-insights", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const insightData = insertAIInsightSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (insightData.userId && insightData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        insightData.userId = req.user!.id;
      }
      
      const insight = await storage.createAIInsight(insightData);
      res.status(201).json(insight);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Media Routes
  app.get("/api/media", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const media = await storage.getMediaByUserId(userId);
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/media", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      
      // Validate userId - default to authenticated user, only therapists can create for others
      if (mediaData.userId && mediaData.userId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can create resources for other users" });
        }
      } else {
        // Override userId to authenticated user for security
        mediaData.userId = req.user!.id;
      }
      
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Lesson Routes
  app.get("/api/lessons", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lessons", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id/activities", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const activities = await storage.getLessonActivitiesByLessonId(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lesson-activities", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const activityData = insertLessonActivitySchema.parse(req.body);
      const activity = await storage.createLessonActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lesson-progress", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const requestedUserId = req.query.userId as string;
      let userId = req.user!.id;
      
      if (requestedUserId && requestedUserId !== req.user!.id) {
        const requestingUser = await storage.getUser(req.user!.id);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(403).json({ error: "Forbidden - only therapists can view other users' data" });
        }
        userId = requestedUserId;
      }
      
      const progress = await storage.getLessonProgressByUserId(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lesson-progress", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const progressData = insertLessonProgressSchema.parse(req.body);
      
      // Always use authenticated user's ID for lesson progress
      progressData.userId = req.user!.id;
      
      const progress = await storage.createLessonProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/lesson-progress/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      
      // Verify ownership before update
      const allProgress = await storage.getLessonProgressByUserId(userId);
      const progressItem = allProgress.find(p => p.id === id);
      
      if (!progressItem) {
        const requestingUser = await storage.getUser(userId);
        if (!requestingUser || requestingUser.role !== "therapist") {
          return res.status(404).json({ error: "Progress not found or unauthorized" });
        }
      }
      
      const updated = await storage.updateLessonProgress(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Collaborative Session Routes
  app.get("/api/sessions/:sessionId/messages", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const messages = await storage.getSessionMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions/:sessionId/messages", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const messageData = insertSessionMessageSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      
      // Always override senderId with authenticated user for security
      messageData.senderId = req.user!.id;
      
      const message = await storage.createSessionMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/sessions/:sessionId/notes", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const notes = await storage.getSessionNotes(req.params.sessionId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions/:sessionId/notes", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const noteData = insertSessionNoteSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      
      // Always override authorId with authenticated user for security
      noteData.authorId = req.user!.id;
      
      const note = await storage.createSessionNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/sessions/:sessionId/notes/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const updated = await storage.updateSessionNote(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Insights Routes
  app.post("/api/ai/journal-reflection", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { entryId } = req.body;
      if (!entryId) {
        return res.status(400).json({ error: "entryId required" });
      }
      
      const entry = await storage.getJournalEntry(entryId);
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      
      const reflection = await aiInsights.analyzeJournalEntry(entry);
      res.json({ reflection });
    } catch (error) {
      console.error("AI journal reflection error:", error);
      res.status(500).json({ error: "Failed to generate reflection" });
    }
  });

  app.post("/api/ai/parts-analysis", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const parts = await storage.getPartsByUserId(userId);
      if (parts.length === 0) {
        return res.status(400).json({ error: "No parts found for analysis" });
      }
      
      const analysis = await aiInsights.analyzePartsPatterns(parts);
      res.json({ analysis });
    } catch (error) {
      console.error("AI parts analysis error:", error);
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });

  app.post("/api/ai/ask-question", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { question, userId } = req.body;
      if (!question) {
        return res.status(400).json({ error: "question required" });
      }
      
      let userContext;
      if (userId) {
        const parts = await storage.getPartsByUserId(userId);
        const journalEntries = await storage.getJournalEntriesByUserId(userId);
        const activities = await storage.getActivitiesByUserId(userId);
        
        userContext = {
          partsCount: parts.length,
          journalEntriesCount: journalEntries.length,
          recentProtocols: activities
            .slice(0, 3)
            .map(a => a.type)
            .filter((v, i, a) => a.indexOf(v) === i),
        };
      }
      
      const answer = await aiInsights.answerTherapeuticQuestion(question, userContext);
      res.json({ answer });
    } catch (error) {
      console.error("AI question answering error:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  app.post("/api/ai/unburdening-visualization", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { partId, burden } = req.body;
      if (!partId || !burden) {
        return res.status(400).json({ error: "partId and burden required" });
      }
      
      const part = await storage.getPart(partId);
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      if (part.type !== "exile") {
        return res.status(400).json({ error: "Unburdening visualizations are for exile parts" });
      }
      
      const visualization = await aiInsights.generateUnburdeningVisualization(part, burden);
      res.json({ visualization });
    } catch (error) {
      console.error("AI visualization generation error:", error);
      res.status(500).json({ error: "Failed to generate visualization" });
    }
  });

  app.post("/api/ai/protector-appreciation", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { partId } = req.body;
      if (!partId) {
        return res.status(400).json({ error: "partId required" });
      }
      
      const part = await storage.getPart(partId);
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      
      if (part.type === "exile") {
        return res.status(400).json({ error: "Appreciation messages are for protector parts" });
      }
      
      const appreciation = await aiInsights.suggestProtectorAppreciation(part);
      res.json({ appreciation });
    } catch (error) {
      console.error("AI appreciation generation error:", error);
      res.status(500).json({ error: "Failed to generate appreciation" });
    }
  });

  // New AI Service Routes for Collaborative Features
  app.post("/api/ai/protocol-guidance", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { protocolType, currentStep, userResponse } = req.body;
      if (!protocolType || !currentStep) {
        return res.status(400).json({ error: "protocolType and currentStep required" });
      }
      
      const result = await aiService.getProtocolGuidance(protocolType, currentStep, userResponse);
      res.json(result);
    } catch (error) {
      console.error("Protocol guidance error:", error);
      res.status(500).json({ error: "Failed to get protocol guidance" });
    }
  });

  app.post("/api/ai/parts-dialogue-analysis", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { dialogue, partType, userId } = req.body;
      if (!dialogue || !userId) {
        return res.status(400).json({ error: "dialogue and userId required" });
      }
      
      const result = await aiService.analyzePartsDialogue(dialogue, partType);
      
      // Optionally save the analysis as an AI insight
      if (req.body.saveInsight) {
        await storage.createAIInsight({
          userId,
          context: `Parts dialogue with ${partType || "internal part"}`,
          insight: result.analysis,
          citations: result.citations,
          saved: true,
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Parts dialogue analysis error:", error);
      res.status(500).json({ error: "Failed to analyze dialogue" });
    }
  });

  app.post("/api/ai/wound-identification", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { description, symptoms } = req.body;
      if (!description) {
        return res.status(400).json({ error: "description required" });
      }
      
      const result = await aiService.identifyWound(description, symptoms);
      res.json(result);
    } catch (error) {
      console.error("Wound identification error:", error);
      res.status(500).json({ error: "Failed to identify wound" });
    }
  });

  app.post("/api/ai/unburdening-visualization-new", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { burden } = req.body;
      if (!burden) {
        return res.status(400).json({ error: "burden required" });
      }
      
      const result = await aiService.getUnburdeningVisualization(burden);
      res.json(result);
    } catch (error) {
      console.error("Unburdening visualization error:", error);
      res.status(500).json({ error: "Failed to generate visualization" });
    }
  });

  app.post("/api/ai/reparenting-phrases", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { woundType, exileAge, situation } = req.body;
      if (!woundType) {
        return res.status(400).json({ error: "woundType required" });
      }
      
      const result = await aiService.getReparentingPhrases(woundType, exileAge, situation);
      res.json(result);
    } catch (error) {
      console.error("Reparenting phrases error:", error);
      res.status(500).json({ error: "Failed to generate reparenting phrases" });
    }
  });

  app.post("/api/ai/ifs-question", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: "question required" });
      }
      
      const result = await aiService.answerIFSQuestion(question);
      res.json(result);
    } catch (error) {
      console.error("IFS question error:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  app.post("/api/ai/part-conversation", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { partType, userMessage, conversationHistory, partName } = req.body;
      if (!partType || !userMessage) {
        return res.status(400).json({ error: "partType and userMessage required" });
      }
      
      const result = await aiService.respondAsPart(
        partType,
        userMessage,
        conversationHistory || [],
        partName
      );
      res.json(result);
    } catch (error) {
      console.error("Part conversation error:", error);
      res.status(500).json({ error: "Failed to respond as part" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
