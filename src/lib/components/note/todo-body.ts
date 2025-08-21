import type { TodoItems } from '@/lib/types';

const MAX_LINES = 3;
const LINE_HEIGHT = 28;

const getVisualLineCount = (el: HTMLTextAreaElement): number => {
  const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || LINE_HEIGHT;
  const actualHeight = el.scrollHeight;
  return Math.ceil(actualHeight / lineHeight);
};

export const resizeTextArea = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto';
  const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || LINE_HEIGHT;
  el.style.height = Math.min(el.scrollHeight, lineHeight * MAX_LINES) + 'px';
};

export const handleTextareaKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const el = e.currentTarget as HTMLTextAreaElement;
    const currentLines = getVisualLineCount(el);

    if (currentLines >= MAX_LINES) {
      e.preventDefault();
      return;
    }
  }
};

export const handleTextareaInput = async (e: Event, todoItems: TodoItems): Promise<void> => {
  const el = e.currentTarget as HTMLTextAreaElement;

  el.style.height = 'auto';
  const visualLines = getVisualLineCount(el);
  if (visualLines > MAX_LINES) {
    while (el.value.length > 0 && getVisualLineCount(el) > MAX_LINES) {
      el.value = el.value.slice(0, -1);
      el.style.height = 'auto';
    }
    el.setSelectionRange(el.value.length, el.value.length);
  }

  resizeTextArea(el);

  todoItems.text = el.value;
};

export const handleCheckboxChange = async (
  checked: boolean,
  todoItems: TodoItems
): Promise<void> => {
  if (!checked) return;
  todoItems.isRemoving = true;

  await new Promise((r) => setTimeout(r, 300));

  const emptyTodo = {
    id: `todo-${Date.now()}`,
    text: '',
    isRemoving: false,
    isReadding: true
  };

  Object.assign(todoItems, emptyTodo);

  await new Promise((r) => setTimeout(r, 50));
  todoItems.isReadding = false;
};
