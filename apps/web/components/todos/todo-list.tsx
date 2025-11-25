"use client";

import { CheckSquare } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { type Todo, TodoItem } from "./todo-item";

interface TodoListProps {
  searchQuery?: string;
  filter?: "all" | "active" | "completed";
  sortBy?: "date" | "title" | "status";
}

export function TodoList({ searchQuery = "", filter = "all", sortBy = "date" }: TodoListProps) {
  const { data, isLoading } = trpc.todo.getAll.useQuery({
    limit: 100,
    offset: 0,
    completed: filter === "all" ? undefined : filter === "completed",
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
  const allTodos = (data?.todos as any as Todo[]) ?? [];

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = allTodos;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(query) ||
          (todo.description && todo.description.toLowerCase().includes(query))
      );
    }

    // Apply status filter (already done by backend, but we need to handle "all")
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "status":
          if (a.completed === b.completed) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return a.completed ? 1 : -1;
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return sorted;
  }, [allTodos, searchQuery, filter, sortBy]);

  if (filteredAndSortedTodos.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={CheckSquare}
        title={searchQuery ? "No todos found" : "No todos yet"}
        description={
          searchQuery
            ? "Try adjusting your search or filters"
            : "Create your first todo to get started!"
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {filteredAndSortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
