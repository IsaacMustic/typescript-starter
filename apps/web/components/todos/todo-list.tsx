"use client";

import { trpc } from "@/lib/trpc";
import { TodoItem } from "./todo-item";
import type { todos } from "@/server/db/schema";

type Todo = typeof todos.$inferSelect;

export function TodoList() {
  const { data, isLoading } = trpc.todo.getAll.useQuery({
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return <div className="p-4">Loading todos...</div>;
  }

  if (!data || data.todos.length === 0) {
    return (
      <div className="p-4 border rounded-lg text-center text-muted-foreground">
        No todos yet. Create your first one!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.todos.map((todo: Todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

