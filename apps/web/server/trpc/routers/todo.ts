import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { todos } from "@/server/db/schema";
import { publicProcedure, router } from "../init";
import { isAuthenticated } from "../middleware/auth";
import { logging } from "../middleware/logging";
import { rateLimit } from "../middleware/rate-limit";

const protectedProcedure = publicProcedure.use(isAuthenticated).use(rateLimit).use(logging);

export const todoRouter = router({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        completed: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const conditions = [eq(todos.userId, ctx.user.id)];
      if (input.completed !== undefined) {
        conditions.push(eq(todos.completed, input.completed));
      }

      const results = await ctx.db.query.todos.findMany({
        where: and(...conditions),
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(todos.createdAt)],
      });

      const total = await ctx.db
        .select({ count: todos.id })
        .from(todos)
        .where(and(...conditions));

      return {
        todos: results,
        total: total.length,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const todo = await ctx.db.query.todos.findFirst({
        where: and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)),
      });

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      return todo;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const [newTodo] = await ctx.db
        .insert(todos)
        .values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
        })
        .returning();

      return newTodo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const { id, ...updates } = input;

      const [updatedTodo] = await ctx.db
        .update(todos)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(and(eq(todos.id, id), eq(todos.userId, ctx.user.id)))
        .returning();

      if (!updatedTodo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      return updatedTodo;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      await ctx.db.delete(todos).where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)));

      return { success: true };
    }),

  toggleComplete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const todo = await ctx.db.query.todos.findFirst({
        where: and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)),
      });

      if (!todo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Todo not found",
        });
      }

      const [updatedTodo] = await ctx.db
        .update(todos)
        .set({
          completed: !todo.completed,
          updatedAt: new Date(),
        })
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning();

      return updatedTodo;
    }),

  deleteCompleted: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    await ctx.db.delete(todos).where(and(eq(todos.userId, ctx.user.id), eq(todos.completed, true)));

    return { success: true };
  }),
});
