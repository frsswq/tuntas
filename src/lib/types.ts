import type { ObjectId } from 'mongodb';

interface ColorSet {
  bg?: string;
  border: string;
  border_b: string;
  text: string;
  caret: string;
}

export interface ColorClasses {
  slate: ColorSet;
  teal: ColorSet;
  sky: ColorSet;
}

export type ColorName = keyof ColorClasses;

export interface TodoItem {
  todoId: string;
  text: string;
  isRemoving?: boolean;
  isReadding?: boolean;
}

export interface TodoList {
  _id?: string;
  listId: string;
  todoHeader: string;
  todoItems: TodoItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TodoBodyProps {
  index: number;
  color?: ColorName;
}

export interface TodoMainProps {
  index: number;
  color?: ColorName;
  containerClass?: string;
}

export interface TodoHeaderProps {
  index: number;
  color?: ColorName;
}

export interface TodoCard {
  todoTitle: string;
  color: ColorName;
  bg: string;
}

export type Direction = 'none' | 'left' | 'right';

export interface TodoSchema {
  _id?: ObjectId;
  userId?: string;
  listId: string;
  todoHeader: string;
  todoItems: TodoItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
