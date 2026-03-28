import { eq, and, like, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  jobs,
  applications,
  messages,
  notifications,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== USER QUERIES ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "mobile"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.dob !== undefined) {
      values.dob = user.dob;
      updateSet.dob = user.dob;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== JOB QUERIES ==========

export async function getActiveJobs() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "active"))
    .orderBy(desc(jobs.createdAt));
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJob(jobData: typeof jobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(jobs).values(jobData);
  return result;
}

// ========== APPLICATION QUERIES ==========

export async function getApplicationsByApplicant(applicantId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(applications)
    .where(eq(applications.applicantId, applicantId))
    .orderBy(desc(applications.appliedAt));
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllApplications(filters?: {
  status?: string;
  position?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(applications.status, filters.status as any));
  }

  if (filters?.position) {
    conditions.push(like(applications.visionName, `%${filters.position}%`));
  }

  if (filters?.search) {
    conditions.push(like(applications.city, `%${filters.search}%`));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.appliedAt));
  }

  return db
    .select()
    .from(applications)
    .orderBy(desc(applications.appliedAt));
}

export async function createApplication(
  appData: typeof applications.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(applications).values(appData);
  return result;
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(applications)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(applications.id, applicationId));
}

// ========== MESSAGE QUERIES ==========

export async function getMessagesByApplication(applicationId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.applicationId, applicationId))
    .orderBy(asc(messages.createdAt));
}

export async function getUnreadMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.recipientId, userId),
        eq(messages.isRead, false)
      )
    )
    .orderBy(desc(messages.createdAt));
}

export async function createMessage(msgData: typeof messages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(messages).values(msgData);
}

export async function markMessageAsRead(messageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(messages)
    .set({ isRead: true })
    .where(eq(messages.id, messageId));
}

// ========== NOTIFICATION QUERIES ==========

export async function getNotificationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    )
    .orderBy(desc(notifications.createdAt));
}

export async function createNotification(
  notifData: typeof notifications.$inferInsert
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(notifications).values(notifData);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId));
}

// ========== ANALYTICS QUERIES ==========

export async function getApplicationStats() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(applications);

  const stats = {
    total: result.length,
    byStatus: {
      pending: result.filter((a) => a.status === "pending").length,
      reviewed: result.filter((a) => a.status === "reviewed").length,
      selected: result.filter((a) => a.status === "selected").length,
      rejected: result.filter((a) => a.status === "rejected").length,
    },
    byPosition: {} as Record<string, number>,
    byCity: {} as Record<string, number>,
  };

  result.forEach((app) => {
    if (app.visionName) {
      stats.byPosition[app.visionName] =
        (stats.byPosition[app.visionName] || 0) + 1;
    }
    if (app.city) {
      stats.byCity[app.city] = (stats.byCity[app.city] || 0) + 1;
    }
  });

  return stats;
}
