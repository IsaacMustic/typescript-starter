"use client";

import { trpc } from "@/lib/trpc";
import type { todos } from "@/server/db/schema";

type Todo = typeof todos.$inferSelect;

export function TodoItem({ todo }: { todo: Todo }) {
  const utils = trpc.useUtils();
  const { mutate: toggleComplete } = trpc.todo.toggleComplete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });
  const { mutate: deleteTodo } = trpc.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });

  return (
    <div className="p-4 border rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete({ id: todo.id })}
          className="w-4 h-4"
        />
        <div>
          <p className={todo.completed ? "line-through text-muted-foreground" : ""}>
            {todo.title}
          </p>
          {todo.description && (
            <p className="text-sm text-muted-foreground">{todo.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => deleteTodo({ id: todo.id })}
        className="text-destructive hover:underline text-sm"
      >
        Delete
      </button>
    </div>
  );
}

