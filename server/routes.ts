import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as aiInsights from "./ai-insights";
import { aiService } from "./ai-service";
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
  loginCredentialsSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth Routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const credentials = loginCredentialsSchema.parse(req.body);
      const { username, password, role } = credentials;
      
      let user = await storage.getUserByUsername(username);
      
      if (!user) {
        user = await storage.createUser({
          username,
          password,
          displayName: username,
          role,
        });
      }
      
      if (user.password !== password || user.role !== role) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // User Routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const role = req.query.role as string | undefined;
      const requestingUserId = req.query.requestingUserId as string | undefined;
      
      if (!requestingUserId) {
        return res.status(401).json({ error: "Unauthorized - requesting user required" });
      }
      
      const requestingUser = await storage.getUser(requestingUserId);
      if (!requestingUser || requestingUser.role !== "therapist") {
        return res.status(403).json({ error: "Forbidden - therapist access only" });
      }
      
      const users = await storage.getAllUsers(role);
      res.json(users.map(u => ({ ...u, password: undefined })));
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const requestingUserId = req.query.requestingUserId as string | undefined;
      
      if (!requestingUserId) {
        return res.status(401).json({ error: "Unauthorized - requesting user required" });
      }
      
      const requestingUser = await storage.getUser(requestingUserId);
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

  // Session Routes
  app.get("/api/sessions", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const sessions = await storage.getSessionsByUserId(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/sessions/:id", async (req: Request, res: Response) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/sessions/:id", async (req: Request, res: Response) => {
    try {
      const session = await storage.updateSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Activity Routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const activities = await storage.getActivitiesByUserId(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const activity = await storage.getActivity(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const activity = await storage.updateActivity(req.params.id, req.body);
      if (!activity) {
        return res.status(404).json({ error: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Parts Routes
  app.get("/api/parts", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const parts = await storage.getPartsByUserId(userId);
      res.json(parts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/parts/:id", async (req: Request, res: Response) => {
    try {
      const part = await storage.getPart(req.params.id);
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/parts", async (req: Request, res: Response) => {
    try {
      const partData = insertPartSchema.parse(req.body);
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

  app.patch("/api/parts/:id", async (req: Request, res: Response) => {
    try {
      const part = await storage.updatePart(req.params.id, req.body);
      if (!part) {
        return res.status(404).json({ error: "Part not found" });
      }
      res.json(part);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/parts/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deletePart(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Part not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Journal Entry Routes
  app.get("/api/journal-entries", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const entries = await storage.getJournalEntriesByUserId(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/journal-entries/:id", async (req: Request, res: Response) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/journal-entries", async (req: Request, res: Response) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
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

  app.patch("/api/journal-entries/:id", async (req: Request, res: Response) => {
    try {
      const entry = await storage.updateJournalEntry(req.params.id, req.body);
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Daily Anxiety Check-in Routes
  app.get("/api/anxiety-checkins", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const checkins = await storage.getDailyAnxietyCheckins(userId, limit);
      res.json(checkins);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/anxiety-checkins", async (req: Request, res: Response) => {
    try {
      const checkinData = insertDailyAnxietyCheckinSchema.parse(req.body);
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
  app.get("/api/body-sensations", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      // Ownership is enforced by storage layer - only returns sensations for this userId
      const sensations = await storage.getBodySensations(userId);
      res.json(sensations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/body-sensations", async (req: Request, res: Response) => {
    try {
      const sensationData = insertBodySensationSchema.parse(req.body);
      
      // Validate userId is provided
      if (!sensationData.userId) {
        return res.status(400).json({ error: "userId required" });
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

  app.delete("/api/body-sensations/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required for deletion" });
      }
      
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
  app.get("/api/anxiety-timeline", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const timeline = await storage.getAnxietyTimeline(userId);
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/anxiety-timeline", async (req: Request, res: Response) => {
    try {
      const eventData = insertAnxietyTimelineSchema.parse(req.body);
      
      if (!eventData.userId) {
        return res.status(400).json({ error: "userId required" });
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

  app.patch("/api/anxiety-timeline/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required for update" });
      }
      
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

  app.delete("/api/anxiety-timeline/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required for deletion" });
      }
      
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
  app.get("/api/grounding-progress", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId query parameter required" });
      }
      
      const progress = await storage.getGroundingTechniqueProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Get grounding progress error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/grounding-progress", async (req: Request, res: Response) => {
    try {
      const insertResult = insertGroundingTechniqueProgressSchema.safeParse(req.body);
      
      if (!insertResult.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: insertResult.error.flatten() 
        });
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

  app.patch("/api/grounding-progress/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "userId required for update" });
      }
      
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
  app.get("/api/ai-insights", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const insights = await storage.getAIInsightsByUserId(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/ai-insights/generate", async (req: Request, res: Response) => {
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

  app.post("/api/ai-insights", async (req: Request, res: Response) => {
    try {
      const insightData = insertAIInsightSchema.parse(req.body);
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
  app.get("/api/media", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const media = await storage.getMediaByUserId(userId);
      res.json(media);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/media", async (req: Request, res: Response) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
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
  app.get("/api/lessons", async (req: Request, res: Response) => {
    try {
      const lessons = await storage.getAllLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id", async (req: Request, res: Response) => {
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

  app.post("/api/lessons", async (req: Request, res: Response) => {
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

  app.get("/api/lessons/:id/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getLessonActivitiesByLessonId(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lesson-activities", async (req: Request, res: Response) => {
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

  app.get("/api/lesson-progress", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }
      
      const progress = await storage.getLessonProgressByUserId(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lesson-progress", async (req: Request, res: Response) => {
    try {
      const progressData = insertLessonProgressSchema.parse(req.body);
      const progress = await storage.createLessonProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/lesson-progress/:id", async (req: Request, res: Response) => {
    try {
      const updated = await storage.updateLessonProgress(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Collaborative Session Routes
  app.get("/api/sessions/:sessionId/messages", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getSessionMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions/:sessionId/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertSessionMessageSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      const message = await storage.createSessionMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/sessions/:sessionId/notes", async (req: Request, res: Response) => {
    try {
      const notes = await storage.getSessionNotes(req.params.sessionId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/sessions/:sessionId/notes", async (req: Request, res: Response) => {
    try {
      const noteData = insertSessionNoteSchema.parse({
        ...req.body,
        sessionId: req.params.sessionId,
      });
      const note = await storage.createSessionNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.patch("/api/sessions/:sessionId/notes/:id", async (req: Request, res: Response) => {
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
  app.post("/api/ai/journal-reflection", async (req: Request, res: Response) => {
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

  app.post("/api/ai/parts-analysis", async (req: Request, res: Response) => {
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

  app.post("/api/ai/ask-question", async (req: Request, res: Response) => {
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

  app.post("/api/ai/unburdening-visualization", async (req: Request, res: Response) => {
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

  app.post("/api/ai/protector-appreciation", async (req: Request, res: Response) => {
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
  app.post("/api/ai/protocol-guidance", async (req: Request, res: Response) => {
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

  app.post("/api/ai/parts-dialogue-analysis", async (req: Request, res: Response) => {
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

  app.post("/api/ai/wound-identification", async (req: Request, res: Response) => {
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

  app.post("/api/ai/unburdening-visualization-new", async (req: Request, res: Response) => {
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

  app.post("/api/ai/reparenting-phrases", async (req: Request, res: Response) => {
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

  app.post("/api/ai/ifs-question", async (req: Request, res: Response) => {
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

  app.post("/api/ai/part-conversation", async (req: Request, res: Response) => {
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
