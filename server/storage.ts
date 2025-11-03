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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
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
      ...insertMedia,
      id,
      createdAt: new Date(),
    };
    this.media.set(id, mediaItem);
    return mediaItem;
  }
}

export const storage = new MemStorage();
