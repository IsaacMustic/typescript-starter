import { trpc } from "@/lib/trpc";

export function useSubscription() {
  const { data: subscription, isLoading } = trpc.billing.getSubscription.useQuery();

  return {
    subscription,
    isLoading,
  };
}

