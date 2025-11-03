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
}

export const storage = new DatabaseStorage();
