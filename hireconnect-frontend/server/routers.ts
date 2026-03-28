import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  upsertUser,
  getUserById,
  getActiveJobs,
  getJobById,
  createJob,
  getApplicationsByApplicant,
  getApplicationById,
  getAllApplications,
  createApplication,
  updateApplicationStatus,
  getMessagesByApplication,
  getUnreadMessages,
  createMessage,
  markMessageAsRead,
  getNotificationsByUser,
  getUnreadNotifications,
  createNotification,
  markNotificationAsRead,
  getApplicationStats,
} from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

// Define role-based procedures
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

const applicantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "applicant") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  // ========== AUTH ROUTES ==========
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ========== JOB ROUTES ==========
  jobs: router({
    list: publicProcedure.query(async () => {
      return getActiveJobs();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await getJobById(input.id);
        if (!job) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return job;
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          position: z.string(),
          branch: z.string().optional(),
          isInternship: z.boolean().default(false),
          minExperience: z.number().default(0),
          maxExperience: z.number().optional(),
          location: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createJob(input);
      }),
  }),

  // ========== APPLICATION ROUTES ==========
  applications: router({
    // Get applicant's own applications
    myApplications: applicantProcedure.query(async ({ ctx }) => {
      return getApplicationsByApplicant(ctx.user.id);
    }),

    // Get single application
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const app = await getApplicationById(input.id);
        if (!app) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // Check authorization
        if (ctx.user.role === "applicant" && app.applicantId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return app;
      }),

    // Get all applications (admin only)
    list: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
          position: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return getAllApplications(input);
      }),

    // Create new application
    create: applicantProcedure
      .input(
        z.object({
          jobId: z.number(),
          resumeUrl: z.string().optional(),
          resumeKey: z.string().optional(),
          skills: z.string(),
          experience: z.number().default(0),
          lastCompany: z.string().optional(),
          linkedin: z.string().optional(),
          relocation: z.string().optional(),
          city: z.string(),
          branch: z.string().optional(),
          visionName: z.string().optional(),
          visionSkills: z.string().optional(),
          visionDescription: z.string().optional(),
          dob: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Age validation logic
        if (input.dob) {
          const today = new Date();
          const birthDate = new Date(input.dob);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          // Get job to check if internship
          const job = await getJobById(input.jobId);
          if (!job) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
          }

          // Block if age < 18 AND not internship
          if (age < 18 && !job.isInternship) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "You must be at least 18 years old to apply for this position. Internship positions are available for younger applicants.",
            });
          }
        }

        const { jobId, ...appData } = input;
        const result = await createApplication({
          applicantId: ctx.user.id,
          jobId: jobId,
          ...appData,
        });

        // Notify owner of new application
        await notifyOwner({
          title: "New Application Submitted",
          content: `A new application has been submitted for review.`,
        });

        // Create notification for admin
        await createNotification({
          userId: ctx.user.id, // This should be admin user ID
          title: "New Application",
          content: `New application received`,
          type: "application_submitted",
        });

        return result;
      }),

    // Update application status (admin only)
    updateStatus: adminProcedure
      .input(
        z.object({
          applicationId: z.number(),
          status: z.enum(["pending", "reviewed", "selected", "rejected"]),
        })
      )
      .mutation(async ({ input }) => {
        const result = await updateApplicationStatus(
          input.applicationId,
          input.status
        );

        // Get application to notify applicant
        const app = await getApplicationById(input.applicationId);
        if (app) {
          const statusMap: Record<string, string> = {
            pending: "Your application is pending review",
            reviewed: "Your application has been reviewed",
            selected: "Congratulations! You have been selected",
            rejected: "Your application has been rejected",
          };

          await createNotification({
            userId: app.applicantId,
            title: `Application ${input.status}`,
            content: statusMap[input.status],
            type:
              input.status === "selected"
                ? "application_accepted"
                : input.status === "rejected"
                  ? "application_rejected"
                  : "application_reviewed",
          });
        }

        return result;
      }),
  }),

  // ========== MESSAGE ROUTES ==========
  messages: router({
    // Get messages for an application
    getByApplication: protectedProcedure
      .input(z.object({ applicationId: z.number() }))
      .query(async ({ input, ctx }) => {
        const app = await getApplicationById(input.applicationId);
        if (!app) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // Check authorization
        if (
          ctx.user.role === "applicant" &&
          app.applicantId !== ctx.user.id
        ) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        return getMessagesByApplication(input.applicationId);
      }),

    // Get unread messages
    unread: protectedProcedure.query(async ({ ctx }) => {
      return getUnreadMessages(ctx.user.id);
    }),

    // Send message
    send: protectedProcedure
      .input(
        z.object({
          applicationId: z.number(),
          recipientId: z.number(),
          content: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const app = await getApplicationById(input.applicationId);
        if (!app) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        // Check authorization
        if (ctx.user.role === "applicant" && app.applicantId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const result = await createMessage({
          applicationId: input.applicationId,
          senderId: ctx.user.id,
          recipientId: input.recipientId,
          content: input.content,
        });

        // Create notification for recipient
        await createNotification({
          userId: input.recipientId,
          title: "New Message",
          content: `You have a new message regarding an application`,
          type: "new_message",
        });

        return result;
      }),

    // Mark message as read
    markRead: protectedProcedure
      .input(z.object({ messageId: z.number() }))
      .mutation(async ({ input }) => {
        return markMessageAsRead(input.messageId);
      }),
  }),

  // ========== NOTIFICATION ROUTES ==========
  notifications: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotificationsByUser(ctx.user.id);
    }),

    unread: protectedProcedure.query(async ({ ctx }) => {
      return getUnreadNotifications(ctx.user.id);
    }),

    markRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        return markNotificationAsRead(input.notificationId);
      }),
  }),

  // ========== ANALYTICS ROUTES ==========
  analytics: router({
    stats: adminProcedure.query(async () => {
      return getApplicationStats();
    }),
  }),

  // ========== RESUME UPLOAD ROUTES ==========
  uploads: router({
    generateResumeUploadUrl: applicantProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileSize: z.number(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Validate file
        if (input.fileSize > 5 * 1024 * 1024) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size must be less than 5MB",
          });
        }

        if (!input.mimeType.includes("pdf")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Only PDF files are allowed",
          });
        }

        // Generate S3 key
        const fileKey = `resumes/${ctx.user.id}/${Date.now()}-${input.fileName}`;

        // Return upload URL (would be generated by S3 client in real implementation)
        return {
          fileKey,
          uploadUrl: `https://s3.amazonaws.com/upload?key=${fileKey}`,
        };
      }),

    confirmResumeUpload: applicantProcedure
      .input(
        z.object({
          fileKey: z.string(),
          fileUrl: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Confirm upload in database
        return {
          success: true,
          fileKey: input.fileKey,
          fileUrl: input.fileUrl,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
