"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { RouterOutputs } from "@/lib/trpc";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export type Todo = Omit<
  RouterOutputs["todo"]["getAll"]["todos"][number],
  "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export function TodoItem({ todo }: { todo: Todo }) {
  const utils = trpc.useUtils();
  const { mutate: toggleComplete, isPending: isToggling } = trpc.todo.toggleComplete.useMutation({
    onMutate: async ({ id }) => {
      await utils.todo.getAll.cancel();
      const previousData = utils.todo.getAll.getData({
        limit: 50,
        offset: 0,
      });
      utils.todo.getAll.setData({ limit: 50, offset: 0 }, (old) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      toast.success("Todo updated");
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        utils.todo.getAll.setData({ limit: 50, offset: 0 }, context.previousData);
      }
      toast.error(err.message || "Failed to update todo");
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = trpc.todo.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.todo.getAll.cancel();
      const previousData = utils.todo.getAll.getData({
        limit: 50,
        offset: 0,
      });
      utils.todo.getAll.setData({ limit: 50, offset: 0 }, (old) => {
        if (!old) return old;
        return {
          ...old,
          todos: old.todos.filter((t) => t.id !== id),
        };
      });
      return { previousData };
    },
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      toast.success("Todo deleted");
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        utils.todo.getAll.setData({ limit: 50, offset: 0 }, context.previousData);
      }
      toast.error(err.message || "Failed to delete todo");
    },
  });

  return (
    <Card
      variant="interactive"
      className={cn("p-4 transition-smooth animate-in", todo.completed && "opacity-75")}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleComplete({ id: todo.id })}
          disabled={isToggling}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium transition-smooth",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTodo({ id: todo.id })}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          aria-label="Delete todo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
