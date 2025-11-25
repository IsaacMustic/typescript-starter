"use client";

import { CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { type Todo, TodoItem } from "./todo-item";

export function TodoList() {
  const { data, isLoading } = trpc.todo.getAll.useQuery({
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.todos.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No todos yet"
        description="Create your first todo to get started!"
      />
    );
  }

  // tRPC serializes Date objects as strings over JSON, but TypeScript infers Date from schema
  // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed due to tRPC serialization
  const todos = data.todos as any as Todo[];

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
