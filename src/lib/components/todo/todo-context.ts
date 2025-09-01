import type { TodoSchema } from '@/lib/types';
import { getContext, setContext } from 'svelte';

const TODO_KEY = Symbol('todo-context');

export const setTodoContext = (context: TodoSchema[]) => {
  setContext(TODO_KEY, context);
};

export const getTodoContext = (): TodoSchema[] => {
  return getContext(TODO_KEY);
};
