import type { ColorClasses, TodoCard } from './types';

export const colorClasses: ColorClasses = {
  slate: {
    bg: 'bg-white',
    border: 'border-slate-300',
    border_b: 'border-b-slate-300',
    text: 'text-slate-600',
    caret: 'caret-slate-600'
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-300',
    border_b: 'border-b-teal-300',
    text: 'text-teal-600',
    caret: 'caret-teal-600'
  },
  sky: {
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    border_b: 'border-b-sky-300',
    text: 'text-sky-600',
    caret: 'caret-sky-600'
  }
};

export const TODOS: TodoCard[] = [
  { todoTitle: 'Today', color: 'slate', bg: 'bg-white' },
  { todoTitle: 'Next', color: 'teal', bg: 'bg-teal-50' },
  { todoTitle: 'Someday', color: 'sky', bg: 'bg-sky-50' }
];
