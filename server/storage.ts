import {
  type User,
  type InsertUser,
  type Session,
  type InsertSession,
  type Activity,
  type InsertActivity,
  type Part,
  type InsertPart,
  type JournalEntry,
  type InsertJournalEntry,
  type AIInsight,
  type InsertAIInsight,
  type Media,
  type InsertMedia,
  type Lesson,
  type InsertLesson,
  type LessonActivity,
  type InsertLessonActivity,
  type LessonProgress,
  type InsertLessonProgress,
  type SessionMessage,
  type InsertSessionMessage,
  type SessionNote,
  type InsertSessionNote,
  type DailyAnxietyCheckin,
  type InsertDailyAnxietyCheckin,
  type BodySensation,
  type InsertBodySensation,
  type GroundingTechniqueProgress,
  type InsertGroundingTechniqueProgress,
  type AnxietyTimeline,
  type InsertAnxietyTimeline,
  type TherapistAssignment,
  type InsertTherapistAssignment,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(role?: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

  getSessionsByUserId(userId: string): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;

  getActivitiesByUserId(userId: string): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined>;

  getPartsByUserId(userId: string): Promise<Part[]>;
  getPart(id: string): Promise<Part | undefined>;
  createPart(part: InsertPart): Promise<Part>;
  updatePart(id: string, updates: Partial<Part>): Promise<Part | undefined>;
  deletePart(id: string): Promise<boolean>;

  getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined>;

  getAIInsightsByUserId(userId: string): Promise<AIInsight[]>;
  createAIInsight(insight: InsertAIInsight): Promise<AIInsight>;

  getMediaByUserId(userId: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;

  getAllLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  getLessonActivitiesByLessonId(lessonId: string): Promise<LessonActivity[]>;
  createLessonActivity(activity: InsertLessonActivity): Promise<LessonActivity>;

  getLessonProgressByUserId(userId: string): Promise<LessonProgress[]>;
  getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined>;
  createLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  updateLessonProgress(id: string, updates: Partial<LessonProgress>): Promise<LessonProgress | undefined>;

  // Collaborative session methods
  getSessionMessages(sessionId: string): Promise<SessionMessage[]>;
  createSessionMessage(message: InsertSessionMessage): Promise<SessionMessage>;
  getSessionNotes(sessionId: string): Promise<SessionNote[]>;
  createSessionNote(note: InsertSessionNote): Promise<SessionNote>;
  updateSessionNote(id: string, updates: Partial<SessionNote>): Promise<SessionNote | undefined>;

  // Daily anxiety check-in methods
  getDailyAnxietyCheckins(userId: string, limit?: number): Promise<DailyAnxietyCheckin[]>;
  createDailyAnxietyCheckin(checkin: InsertDailyAnxietyCheckin): Promise<DailyAnxietyCheckin>;

  // Body sensations methods
  getBodySensations(userId: string): Promise<BodySensation[]>;
  createBodySensation(sensation: InsertBodySensation): Promise<BodySensation>;
  deleteBodySensation(id: string): Promise<boolean>;

  // Anxiety timeline methods
  getAnxietyTimeline(userId: string): Promise<AnxietyTimeline[]>;
  createTimelineEvent(event: InsertAnxietyTimeline): Promise<AnxietyTimeline>;
  updateTimelineEvent(id: string, updates: Partial<AnxietyTimeline>): Promise<AnxietyTimeline | undefined>;
  deleteTimelineEvent(id: string): Promise<boolean>;

  // Grounding technique progress methods
  getGroundingTechniqueProgress(userId: string): Promise<GroundingTechniqueProgress[]>;
  getGroundingTechniqueProgressByName(userId: string, techniqueName: string): Promise<GroundingTechniqueProgress | undefined>;
  createGroundingTechniqueProgress(progress: InsertGroundingTechniqueProgress): Promise<GroundingTechniqueProgress>;
  updateGroundingTechniqueProgress(id: string, updates: Partial<GroundingTechniqueProgress>): Promise<GroundingTechniqueProgress | undefined>;

  // Therapist assignment methods
  getAssignmentsByTherapist(therapistId: string): Promise<TherapistAssignment[]>;
  getAssignmentsByClient(clientId: string): Promise<TherapistAssignment[]>;
  createAssignment(assignment: InsertTherapistAssignment): Promise<TherapistAssignment>;
  updateAssignment(id: string, updates: Partial<TherapistAssignment>): Promise<TherapistAssignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;
  private activities: Map<string, Activity>;
  private parts: Map<string, Part>;
  private journalEntries: Map<string, JournalEntry>;
  private aiInsights: Map<string, AIInsight>;
  private media: Map<string, Media>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.activities = new Map();
    this.parts = new Map();
    this.journalEntries = new Map();
    this.aiInsights = new Map();
    this.media = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(role?: string): Promise<User[]> {
    const allUsers = Array.from(this.users.values());
    if (role) {
      return allUsers.filter(user => user.role === role);
    }
    return allUsers;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getSessionsByUserId(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.therapistId === userId || session.clientId === userId
    );
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId
    );
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    const updated = { ...activity, ...updates };
    this.activities.set(id, updated);
    return updated;
  }

  async getPartsByUserId(userId: string): Promise<Part[]> {
    return Array.from(this.parts.values()).filter(
      (part) => part.userId === userId
    );
  }

  async getPart(id: string): Promise<Part | undefined> {
    return this.parts.get(id);
  }

  async createPart(insertPart: InsertPart): Promise<Part> {
    const id = randomUUID();
    const part: Part = {
      sessionId: null,
      description: null,
      emotions: null,
      bodyLocation: null,
      color: null,
      age: null,
      positionX: null,
      positionY: null,
      ...insertPart,
      id,
      createdAt: new Date(),
    };
    this.parts.set(id, part);
    return part;
  }

  async updatePart(id: string, updates: Partial<Part>): Promise<Part | undefined> {
    const part = this.parts.get(id);
    if (!part) return undefined;
    const updated = { ...part, ...updates };
    this.parts.set(id, updated);
    return updated;
  }

  async deletePart(id: string): Promise<boolean> {
    return this.parts.delete(id);
  }

  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).filter(
      (entry) => entry.userId === userId
    );
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      sessionId: null,
      partId: null,
      step: null,
      ...insertEntry,
      id,
      createdAt: new Date(),
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined> {
    const entry = this.journalEntries.get(id);
    if (!entry) return undefined;
    const updated = { ...entry, ...updates };
    this.journalEntries.set(id, updated);
    return updated;
  }

  async getAIInsightsByUserId(userId: string): Promise<AIInsight[]> {
    return Array.from(this.aiInsights.values()).filter(
      (insight) => insight.userId === userId
    );
  }

  async createAIInsight(insertInsight: InsertAIInsight): Promise<AIInsight> {
    const id = randomUUID();
    const insight: AIInsight = {
      sessionId: null,
      partId: null,
      journalEntryId: null,
      citations: null,
      saved: null,
      ...insertInsight,
      id,
      createdAt: new Date(),
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async getMediaByUserId(userId: string): Promise<Media[]> {
    return Array.from(this.media.values()).filter(
      (m) => m.userId === userId
    );
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const id = randomUUID();
    const mediaItem: Media = {
      sessionId: null,
      metadata: {},
      ...insertMedia,
      id,
      createdAt: new Date(),
    };
    this.media.set(id, mediaItem);
    return mediaItem;
  }
}

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import ws from "ws";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

export class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({ connectionString });
    this.db = drizzle(pool, { schema });
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    return result;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
    return result;
  }

  async getAllUsers(role?: string): Promise<User[]> {
    if (role) {
      const results = await this.db.query.users.findMany({
        where: eq(schema.users.role, role),
      });
      return results;
    }
    const results = await this.db.query.users.findMany();
    return results;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getSessionsByUserId(userId: string): Promise<Session[]> {
    const results = await this.db.query.sessions.findMany({
      where: (sessions, { or, eq }) =>
        or(eq(sessions.therapistId, userId), eq(sessions.clientId, userId)),
    });
    return results;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const result = await this.db.query.sessions.findFirst({
      where: eq(schema.sessions.id, id),
    });
    return result;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await this.db
      .insert(schema.sessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const [updated] = await this.db
      .update(schema.sessions)
      .set(updates)
      .where(eq(schema.sessions.id, id))
      .returning();
    return updated;
  }

  async getActivitiesByUserId(userId: string): Promise<Activity[]> {
    const results = await this.db.query.activities.findMany({
      where: eq(schema.activities.userId, userId),
    });
    return results;
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    const result = await this.db.query.activities.findFirst({
      where: eq(schema.activities.id, id),
    });
    return result;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await this.db
      .insert(schema.activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async updateActivity(id: string, updates: Partial<Activity>): Promise<Activity | undefined> {
    const [updated] = await this.db
      .update(schema.activities)
      .set(updates)
      .where(eq(schema.activities.id, id))
      .returning();
    return updated;
  }

  async getPartsByUserId(userId: string): Promise<Part[]> {
    const results = await this.db.query.parts.findMany({
      where: eq(schema.parts.userId, userId),
    });
    return results;
  }

  async getPart(id: string): Promise<Part | undefined> {
    const result = await this.db.query.parts.findFirst({
      where: eq(schema.parts.id, id),
    });
    return result;
  }

  async createPart(insertPart: InsertPart): Promise<Part> {
    const [part] = await this.db
      .insert(schema.parts)
      .values(insertPart)
      .returning();
    return part;
  }

  async updatePart(id: string, updates: Partial<Part>): Promise<Part | undefined> {
    const [updated] = await this.db
      .update(schema.parts)
      .set(updates)
      .where(eq(schema.parts.id, id))
      .returning();
    return updated;
  }

  async deletePart(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.parts)
      .where(eq(schema.parts.id, id))
      .returning();
    return result.length > 0;
  }

  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    const results = await this.db.query.journalEntries.findMany({
      where: eq(schema.journalEntries.userId, userId),
    });
    return results;
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    const result = await this.db.query.journalEntries.findFirst({
      where: eq(schema.journalEntries.id, id),
    });
    return result;
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const [entry] = await this.db
      .insert(schema.journalEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<JournalEntry | undefined> {
    const [updated] = await this.db
      .update(schema.journalEntries)
      .set(updates)
      .where(eq(schema.journalEntries.id, id))
      .returning();
    return updated;
  }

  async getAIInsightsByUserId(userId: string): Promise<AIInsight[]> {
    const results = await this.db.query.aiInsights.findMany({
      where: eq(schema.aiInsights.userId, userId),
    });
    return results;
  }

  async createAIInsight(insertInsight: InsertAIInsight): Promise<AIInsight> {
    const [insight] = await this.db
      .insert(schema.aiInsights)
      .values(insertInsight)
      .returning();
    return insight;
  }

  async getMediaByUserId(userId: string): Promise<Media[]> {
    const results = await this.db.query.media.findMany({
      where: eq(schema.media.userId, userId),
    });
    return results;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await this.db
      .insert(schema.media)
      .values(insertMedia)
      .returning();
    return mediaItem;
  }

  async getAllLessons(): Promise<Lesson[]> {
    const results = await this.db.query.lessons.findMany();
    return results;
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const result = await this.db.query.lessons.findFirst({
      where: eq(schema.lessons.id, id),
    });
    return result;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await this.db
      .insert(schema.lessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }

  async getLessonActivitiesByLessonId(lessonId: string): Promise<LessonActivity[]> {
    const results = await this.db.query.lessonActivities.findMany({
      where: eq(schema.lessonActivities.lessonId, lessonId),
    });
    return results;
  }

  async createLessonActivity(insertActivity: InsertLessonActivity): Promise<LessonActivity> {
    const [activity] = await this.db
      .insert(schema.lessonActivities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getLessonProgressByUserId(userId: string): Promise<LessonProgress[]> {
    const results = await this.db.query.lessonProgress.findMany({
      where: eq(schema.lessonProgress.userId, userId),
    });
    return results;
  }

  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined> {
    const result = await this.db.query.lessonProgress.findFirst({
      where: (progress, { and, eq }) =>
        and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)),
    });
    return result;
  }

  async createLessonProgress(insertProgress: InsertLessonProgress): Promise<LessonProgress> {
    const [progress] = await this.db
      .insert(schema.lessonProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateLessonProgress(id: string, updates: Partial<LessonProgress>): Promise<LessonProgress | undefined> {
    const [updated] = await this.db
      .update(schema.lessonProgress)
      .set(updates)
      .where(eq(schema.lessonProgress.id, id))
      .returning();
    return updated;
  }

  // Collaborative session methods
  async getSessionMessages(sessionId: string): Promise<SessionMessage[]> {
    const results = await this.db.query.sessionMessages.findMany({
      where: eq(schema.sessionMessages.sessionId, sessionId),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });
    return results;
  }

  async createSessionMessage(insertMessage: InsertSessionMessage): Promise<SessionMessage> {
    const [message] = await this.db
      .insert(schema.sessionMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getSessionNotes(sessionId: string): Promise<SessionNote[]> {
    const results = await this.db.query.sessionNotes.findMany({
      where: eq(schema.sessionNotes.sessionId, sessionId),
      orderBy: (notes, { desc }) => [desc(notes.updatedAt)],
    });
    return results;
  }

  async createSessionNote(insertNote: InsertSessionNote): Promise<SessionNote> {
    const [note] = await this.db
      .insert(schema.sessionNotes)
      .values(insertNote)
      .returning();
    return note;
  }

  async updateSessionNote(id: string, updates: Partial<SessionNote>): Promise<SessionNote | undefined> {
    const [updated] = await this.db
      .update(schema.sessionNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.sessionNotes.id, id))
      .returning();
    return updated;
  }

  // Daily anxiety check-in methods
  async getDailyAnxietyCheckins(userId: string, limit: number = 30): Promise<DailyAnxietyCheckin[]> {
    const results = await this.db.query.dailyAnxietyCheckins.findMany({
      where: eq(schema.dailyAnxietyCheckins.userId, userId),
      orderBy: (checkins, { desc }) => [desc(checkins.checkinDate)],
      limit,
    });
    return results;
  }

  async createDailyAnxietyCheckin(insertCheckin: InsertDailyAnxietyCheckin): Promise<DailyAnxietyCheckin> {
    const [checkin] = await this.db
      .insert(schema.dailyAnxietyCheckins)
      .values(insertCheckin)
      .returning();
    return checkin;
  }

  // Body sensations methods
  async getBodySensations(userId: string): Promise<BodySensation[]> {
    const results = await this.db.query.bodySensations.findMany({
      where: eq(schema.bodySensations.userId, userId),
      orderBy: (sensations, { desc }) => [desc(sensations.createdAt)],
    });
    return results;
  }

  async createBodySensation(insertSensation: InsertBodySensation): Promise<BodySensation> {
    const [sensation] = await this.db
      .insert(schema.bodySensations)
      .values(insertSensation)
      .returning();
    return sensation;
  }

  async deleteBodySensation(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.bodySensations)
      .where(eq(schema.bodySensations.id, id))
      .returning();
    return result.length > 0;
  }

  // Anxiety timeline methods
  async getAnxietyTimeline(userId: string): Promise<AnxietyTimeline[]> {
    const results = await this.db.query.anxietyTimeline.findMany({
      where: eq(schema.anxietyTimeline.userId, userId),
      orderBy: (timeline, { desc }) => [desc(timeline.eventDate)],
    });
    return results;
  }

  async createTimelineEvent(insertEvent: InsertAnxietyTimeline): Promise<AnxietyTimeline> {
    const [event] = await this.db
      .insert(schema.anxietyTimeline)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateTimelineEvent(id: string, updates: Partial<AnxietyTimeline>): Promise<AnxietyTimeline | undefined> {
    const [updated] = await this.db
      .update(schema.anxietyTimeline)
      .set(updates)
      .where(eq(schema.anxietyTimeline.id, id))
      .returning();
    return updated;
  }

  async deleteTimelineEvent(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.anxietyTimeline)
      .where(eq(schema.anxietyTimeline.id, id))
      .returning();
    return result.length > 0;
  }

  // Grounding technique progress methods
  async getGroundingTechniqueProgress(userId: string): Promise<GroundingTechniqueProgress[]> {
    const results = await this.db.query.groundingTechniqueProgress.findMany({
      where: eq(schema.groundingTechniqueProgress.userId, userId),
      orderBy: (progress, { desc }) => [desc(progress.lastPracticedAt)],
    });
    return results;
  }

  async getGroundingTechniqueProgressByName(userId: string, techniqueName: string): Promise<GroundingTechniqueProgress | undefined> {
    const result = await this.db.query.groundingTechniqueProgress.findFirst({
      where: (progress, { and, eq }) => and(
        eq(progress.userId, userId),
        eq(progress.techniqueName, techniqueName)
      ),
    });
    return result;
  }

  async createGroundingTechniqueProgress(insertProgress: InsertGroundingTechniqueProgress): Promise<GroundingTechniqueProgress> {
    const [progress] = await this.db
      .insert(schema.groundingTechniqueProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async updateGroundingTechniqueProgress(id: string, updates: Partial<GroundingTechniqueProgress>): Promise<GroundingTechniqueProgress | undefined> {
    const [updated] = await this.db
      .update(schema.groundingTechniqueProgress)
      .set(updates)
      .where(eq(schema.groundingTechniqueProgress.id, id))
      .returning();
    return updated;
  }

  // Therapist assignment methods
  async getAssignmentsByTherapist(therapistId: string): Promise<TherapistAssignment[]> {
    const results = await this.db.query.therapistAssignments.findMany({
      where: eq(schema.therapistAssignments.therapistId, therapistId),
      orderBy: (assignments, { desc }) => [desc(assignments.createdAt)],
    });
    return results;
  }

  async getAssignmentsByClient(clientId: string): Promise<TherapistAssignment[]> {
    const results = await this.db.query.therapistAssignments.findMany({
      where: eq(schema.therapistAssignments.clientId, clientId),
      orderBy: (assignments, { desc }) => [desc(assignments.dueDate)],
    });
    return results;
  }

  async createAssignment(insertAssignment: InsertTherapistAssignment): Promise<TherapistAssignment> {
    const [assignment] = await this.db
      .insert(schema.therapistAssignments)
      .values(insertAssignment)
      .returning();
    return assignment;
  }

  async updateAssignment(id: string, updates: Partial<TherapistAssignment>): Promise<TherapistAssignment | undefined> {
    const [updated] = await this.db
      .update(schema.therapistAssignments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.therapistAssignments.id, id))
      .returning();
    return updated;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await this.db
      .delete(schema.therapistAssignments)
      .where(eq(schema.therapistAssignments.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
