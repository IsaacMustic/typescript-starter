"use client";

import { TodoList } from "@/components/todos/todo-list";
import { TodoForm } from "@/components/todos/todo-form";

export default function TodosPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Todos</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tasks and stay organized
        </p>
      </div>

      <TodoForm />
      <TodoList />
    </div>
  );
}

