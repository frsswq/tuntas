import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { and, asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { TODOS } from './consts';
import { db } from './server/db';
import { todos } from './server/schema';

const TodoItemSchema = z.object({
  todoId: z.string(),
  text: z.string()
});

const TodoSchema = z.object({
  listId: z.string(),
  todoHeader: z.string(),
  todoItems: z.array(TodoItemSchema).length(10)
});

const TodoArraySchema = z.array(TodoSchema).length(3);

const createDefaultTodos = (userId: string) => {
  const timestamp = Date.now();
  return TODOS.map((todo, tableIndex) => {
    const lowerTitle = todo.todoTitle.toLowerCase();
    return {
      id: `${userId}-${lowerTitle}-${timestamp}`,
      listId: `todos-${lowerTitle}`,
      todoHeader: '',
      todoItems: Array.from({ length: 10 }, (_, index) => ({
        todoId: `todo-${timestamp}-${tableIndex}-${index}`,
        text: ''
      })),
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
};

export const getUserTodos = query(async () => {
  const event = getRequestEvent();
  const { locals } = event;
  const user = locals.user;

  if (!user) {
    throw error(401, 'Not authenticated');
  }

  try {
    const existingTodos = await db
      .select({
        listId: todos.listId,
        todoHeader: todos.todoHeader,
        todoItems: todos.todoItems
      })
      .from(todos)
      .where(eq(todos.userId, user.id))
      .orderBy(asc(todos.listId));

    if (existingTodos.length === 3) {
      return existingTodos.map((todo) => {
        const { listId, todoHeader, todoItems: todoItemsJson } = todo;
        let todoItems = [];

        try {
          todoItems = todoItemsJson ? JSON.parse(todoItemsJson) : [];
        } catch (parseError) {
          console.error('Error parsing todoItems JSON:', parseError);
          todoItems = [];
        }

        return {
          listId,
          todoHeader: todoHeader || '',
          todoItems
        };
      });
    } else {
      await db.delete(todos).where(eq(todos.userId, user.id));
      const defaultTodos = createDefaultTodos(user.id);
      await db.insert(todos).values(
        defaultTodos.map((todo) => ({
          id: todo.id,
          listId: todo.listId,
          todoHeader: todo.todoHeader,
          todoItems: JSON.stringify(todo.todoItems),
          userId: todo.userId,
          createdAt: todo.createdAt,
          updatedAt: todo.updatedAt
        }))
      );
    }
  } catch (err) {
    console.error('Error fetching user todos:', err);
    throw error(500, 'Failed to fetch todos');
  }
});

export const saveUserTodos = command(TodoArraySchema, async (todosData) => {
  const event = getRequestEvent();
  const { locals } = event;
  const user = locals.user;

  if (!user) {
    throw error(401, 'Not authenticated');
  }

  try {
    await db.transaction(async (tx) => {
      const timestamp = new Date();

      for (const todo of todosData) {
        await tx
          .update(todos)
          .set({
            todoHeader: todo.todoHeader,
            todoItems: JSON.stringify(todo.todoItems),
            updatedAt: timestamp
          })
          .where(and(eq(todos.listId, todo.listId), eq(todos.userId, user.id)));
      }
    });

    return { success: true };
  } catch (err) {
    console.error('Error saving todos:', err);
    throw error(500, 'Failed to save todos');
  }
});
