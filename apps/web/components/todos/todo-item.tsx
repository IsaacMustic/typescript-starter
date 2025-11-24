"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { RouterOutputs } from "@/lib/trpc";
import { trpc } from "@/lib/trpc";

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
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => toggleComplete({ id: todo.id })}
            disabled={isToggling}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          />
          <div className="flex-1">
            <p className={todo.completed ? "line-through text-muted-foreground" : "font-medium"}>
              {todo.title}
            </p>
            {todo.description && (
              <p className="text-sm text-muted-foreground">{todo.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteTodo({ id: todo.id })}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Card>
  );
}
