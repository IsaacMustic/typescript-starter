import { trpc } from "@/lib/trpc";

export function useUser() {
  const { data: session } = trpc.auth.getSession.useQuery();

  return {
    user: session?.user ?? null,
    session,
    isLoading: !session,
  };
}
