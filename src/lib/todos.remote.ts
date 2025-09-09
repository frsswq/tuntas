import { command, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { TODOS } from './consts';
import { db } from './server/db';

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
      listId: `todos-${lowerTitle}`,
      todoHeader: '',
      todoItems: Array.from({ length: 10 }, (_, index) => ({
        todoId: `todo-${timestamp}-${tableIndex}-${index}`,
        text: ''
      })),
      userId
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
      .collection('todos')
      .find({ userId: user?.id })
      .sort({ listId: 1 })
      .toArray();

    if (existingTodos.length === 3) {
      return existingTodos.map((todo) => ({
        listId: todo.listId,
        todoHeader: todo.todoHeader || '',
        todoItems: todo.todoItems || []
      }));
    } else {
      await db.collection('todos').deleteMany({ userId: user.id });
      const defaultTodos = createDefaultTodos(user.id);
      await db.collection('todos').insertMany(defaultTodos);

      return defaultTodos.map((todo) => ({
        listId: todo.listId,
        todoHeader: todo.todoHeader,
        todoItems: todo.todoItems
      }));
    }
  } catch (err) {
    console.error('Error fetching user todos:', err);
    error(500, 'Failed to fetch todos');
  }
});

export const saveUserTodos = command(TodoArraySchema, async (todos) => {
  const event = getRequestEvent();
  const { locals } = event;
  const user = locals.user;

  if (!user) {
    throw error(401, 'Not authenticated');
  }

  try {
    await db.collection('todos').deleteMany({ userId: user.id });

    const toInsert = todos.map((t) => ({
      ...t,
      userId: user.id
    }));

    await db.collection('todos').insertMany(toInsert);

    return { success: true };
  } catch (err) {
    console.error('Error saving todos:', err);
    throw error(500, 'Failed to save todos');
  }
});
