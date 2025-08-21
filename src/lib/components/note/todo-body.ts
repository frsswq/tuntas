import type { TodoItem } from '@/lib/types';
import { delay } from '@/lib/utils';

const MAX_LINES = 3;
const LINE_HEIGHT = 28;
const REMOVING_DURATION = 300;
const READDING_DELAY = 50;

// weakMap??
const styleCache = new WeakMap<HTMLTextAreaElement, number>();

const getLineHeight = (el: HTMLTextAreaElement): number => {
  if (styleCache.has(el)) {
    return styleCache.get(el)!;
  }

  const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || LINE_HEIGHT;
  styleCache.set(el, lineHeight);
  return lineHeight;
};

const getVisualLineCount = (el: HTMLTextAreaElement): number => {
  const lineHeight = getLineHeight(el);
  return Math.ceil(el.scrollHeight / lineHeight);
};

export const resizeTextArea = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  const lineHeight = getLineHeight(el);
  const maxHeight = lineHeight * MAX_LINES;
  el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
};

export const handleTextareaKeydown = (e: KeyboardEvent) => {
  if (
    e.key === 'Enter' &&
    getVisualLineCount(e.currentTarget as HTMLTextAreaElement) >= MAX_LINES
  ) {
    e.preventDefault();
  }
};

export const handleTextareaInput = async (e: Event, todoItem: TodoItem): Promise<void> => {
  const el = e.currentTarget as HTMLTextAreaElement;
  el.style.height = 'auto';

  if (getVisualLineCount(el) > MAX_LINES) {
    while (el.value.length > 0 && getVisualLineCount(el) > MAX_LINES) {
      el.value = el.value.slice(0, -1);
      el.style.height = 'auto';
    }
    el.setSelectionRange(el.value.length, el.value.length);
  }

  resizeTextArea(el);
  todoItem.text = el.value;
};

export const handleCheckboxChange = async (checked: boolean, todoItem: TodoItem): Promise<void> => {
  if (!checked) return;
  todoItem.isRemoving = true;

  await delay(REMOVING_DURATION);

  todoItem.id = `todo-${Date.now()}`;
  todoItem.text = '';
  todoItem.isRemoving = false;
  todoItem.isReadding = true;

  await delay(READDING_DELAY);
  todoItem.isReadding = false;
};
