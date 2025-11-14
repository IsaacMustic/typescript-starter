import { getServerSession } from "@/server/auth";
import { db } from "@/lib/db";
import type { Session } from "@/lib/auth";

export interface Context {
  db: typeof db;
  session: Session | null;
  user: Session["user"] | null;
}

export async function createContext(): Promise<Context> {
  const session = await getServerSession();

  return {
    db,
    session,
    user: session?.user ?? null,
  };
}

