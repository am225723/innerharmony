import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
          description: "Visualizing internal parts system",
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
          description: `Completed ${activityTitle}`,
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
        `${j.protocol}: ${j.responses?.find ? 'Completed' : 'In progress'}`
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

  const httpServer = createServer(app);

  return httpServer;
}
