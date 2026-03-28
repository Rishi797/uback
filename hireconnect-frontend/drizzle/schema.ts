import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  date,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * HireConnect Database Schema
 * Complete job application management system with role-based access
 */

// ========== USERS TABLE ==========
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  mobile: varchar("mobile", { length: 15 }),
  dob: date("dob"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["applicant", "admin"]).default("applicant").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========== JOBS TABLE ==========
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  position: varchar("position", { length: 100 }).notNull(),
  branch: varchar("branch", { length: 50 }),
  isInternship: boolean("isInternship").default(false).notNull(),
  minExperience: int("minExperience").default(0),
  maxExperience: int("maxExperience"),
  salaryMin: decimal("salaryMin", { precision: 10, scale: 2 }),
  salaryMax: decimal("salaryMax", { precision: 10, scale: 2 }),
  location: varchar("location", { length: 100 }),
  status: mysqlEnum("status", ["active", "closed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// ========== APPLICATIONS TABLE ==========
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  applicantId: int("applicantId").notNull(),
  jobId: int("jobId").notNull(),
  resumeUrl: text("resumeUrl"),
  resumeKey: varchar("resumeKey", { length: 255 }),
  skills: text("skills"),
  experience: int("experience").default(0),
  lastCompany: varchar("lastCompany", { length: 100 }),
  linkedin: varchar("linkedin", { length: 255 }),
  relocation: varchar("relocation", { length: 10 }),
  city: varchar("city", { length: 100 }),
  branch: varchar("branch", { length: 50 }),
  visionName: varchar("visionName", { length: 255 }),
  visionSkills: text("visionSkills"),
  visionDescription: text("visionDescription"),
  status: mysqlEnum("status", ["pending", "reviewed", "selected", "rejected"])
    .default("pending")
    .notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// ========== MESSAGES TABLE ==========
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ========== NOTIFICATIONS TABLE ==========
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  type: mysqlEnum("type", [
    "application_submitted",
    "application_reviewed",
    "application_accepted",
    "application_rejected",
    "new_message",
  ])
    .notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
