import { auth } from "@/utils/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { Role, Session } from "../../prisma/generated/browser";
import { prisma } from "@/db/client";

export const createTRPCContext = cache(async () => {
  const header = await headers();
  const session = await auth.api.getSession({
    headers: header,
  });
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {
    session: session,
    prisma,
    headers: header,
  };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * cek jika user sudah authenticated
 */
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  return next({
    ctx: {
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = baseProcedure.use(isAuthenticated);

const isAdmin = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const role = ctx.session.user.role as Role;

  if (role !== "OWNER" && role !== "MANAGER") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not authorized to access this resource",
    });
  }

  return next({
    ctx,
  });
});

export const adminProcedure = baseProcedure.use(isAdmin);

const isCashier = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }

  const role = ctx.session.user.role as Role;

  if (!["CASHIER", "OWNER", "MANAGER"].includes(role)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "User is not authorized to access this resource",
    });
  }

  return next({
    ctx,
  });
});

export const cashierProcedure = baseProcedure.use(isCashier);
