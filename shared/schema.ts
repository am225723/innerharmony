import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["therapist", "client"] }).notNull().default("client"),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  therapistId: varchar("therapist_id").notNull(),
  clientId: varchar("client_id").notNull(),
  title: text("title").notNull(),
  status: text("status", { enum: ["scheduled", "active", "completed", "cancelled"] }).notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const parts = pgTable("parts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  type: text("type", { enum: ["manager", "firefighter", "exile"] }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  emotions: text("emotions").array(),
  bodyLocation: text("body_location"),
  color: text("color"),
  age: text("age"),
  positionX: text("position_x"),
  positionY: text("position_y"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  partId: varchar("part_id"),
  protocol: text("protocol", { enum: ["six_fs", "witnessing", "unburdening", "letter", "free"] }).notNull(),
  step: text("step"),
  content: text("content").notNull(),
  responses: jsonb("responses"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  type: text("type", { enum: ["parts_mapping", "six_fs", "meditation", "witnessing", "unburdening", "letter_writing", "body_mapping", "creative_expression"] }).notNull(),
  title: text("title").notNull(),
  status: text("status", { enum: ["not_started", "in_progress", "completed"] }).notNull().default("not_started"),
  data: jsonb("data"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  partId: varchar("part_id"),
  journalEntryId: varchar("journal_entry_id"),
  context: text("context").notNull(),
  insight: text("insight").notNull(),
  citations: text("citations").array(),
  saved: boolean("saved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id"),
  type: text("type", { enum: ["image", "audio", "video"] }).notNull(),
  url: text("url").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["introduction", "understanding_parts", "self_leadership", "unburdening", "advanced", "protocols", "healing", "integration"] }).notNull(),
  track: text("track", { enum: ["foundations", "deepening", "therapeutic"] }).notNull().default("foundations"),
  order: text("order").notNull(),
  content: jsonb("content").notNull(),
  estimatedMinutes: text("estimated_minutes"),
  safetyLevel: text("safety_level", { enum: ["gentle", "moderate", "intensive"] }).default("gentle"),
  traumaWarning: boolean("trauma_warning").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessonActivities = pgTable("lesson_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["reflection", "journaling", "parts_work", "meditation", "exercise", "protocol", "assessment", "grounding"] }).notNull(),
  order: text("order").notNull(),
  content: jsonb("content").notNull(),
  isProtocol: boolean("is_protocol").default(false),
  requiresSafetyCheck: boolean("requires_safety_check").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  status: text("status", { enum: ["not_started", "in_progress", "completed"] }).notNull().default("not_started"),
  activitiesCompleted: text("activities_completed").array().default(sql`ARRAY[]::text[]`),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const protocolSteps = pgTable("protocol_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  activityId: varchar("activity_id").notNull(),
  lessonActivityId: varchar("lesson_activity_id"),
  protocolType: text("protocol_type", { enum: ["six_fs", "unburdening", "reparenting", "grounding", "self_assessment"] }).notNull(),
  stepNumber: text("step_number").notNull(),
  stepName: text("step_name").notNull(),
  completed: boolean("completed").default(false),
  response: text("response"),
  safetyCheckPassed: boolean("safety_check_passed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const woundProfiles = pgTable("wound_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  partId: varchar("part_id"),
  woundType: text("wound_type", { enum: ["rejection", "abandonment", "injustice", "betrayal", "neglect"] }).notNull(),
  description: text("description"),
  originStory: text("origin_story"),
  coreBeliefs: text("core_beliefs").array(),
  triggers: text("triggers").array(),
  protectorStrategies: text("protector_strategies").array(),
  healingProgress: text("healing_progress", { enum: ["identified", "exploring", "healing", "integrated"] }).default("identified"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const selfAssessments = pgTable("self_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  assessmentType: text("assessment_type", { enum: ["eight_cs", "parts_check", "safety_check", "grounding_check"] }).notNull(),
  scores: jsonb("scores").notNull(),
  inSelf: boolean("in_self"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartSchema = createInsertSchema(parts).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAIInsightSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertLessonActivitySchema = createInsertSchema(lessonActivities).omit({
  id: true,
  createdAt: true,
});

export const insertLessonProgressSchema = createInsertSchema(lessonProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertProtocolStepSchema = createInsertSchema(protocolSteps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWoundProfileSchema = createInsertSchema(woundProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSelfAssessmentSchema = createInsertSchema(selfAssessments).omit({
  id: true,
  createdAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const loginCredentialsSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["therapist", "client"]),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Part = typeof parts.$inferSelect;
export type InsertPart = z.infer<typeof insertPartSchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = z.infer<typeof insertAIInsightSchema>;
export type Media = typeof media.$inferSelect;
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type LessonActivity = typeof lessonActivities.$inferSelect;
export type InsertLessonActivity = z.infer<typeof insertLessonActivitySchema>;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type ProtocolStep = typeof protocolSteps.$inferSelect;
export type InsertProtocolStep = z.infer<typeof insertProtocolStepSchema>;
export type WoundProfile = typeof woundProfiles.$inferSelect;
export type InsertWoundProfile = z.infer<typeof insertWoundProfileSchema>;
export type SelfAssessment = typeof selfAssessments.$inferSelect;
export type InsertSelfAssessment = z.infer<typeof insertSelfAssessmentSchema>;
export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;
