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

// not types
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

export type ColorName = keyof ColorClasses;

export interface TodoItem {
  id: string;
  text: string;
  isRemoving?: boolean;
  isReadding?: boolean;
}

export interface TodoSchema {
  id: string;
  todoHeader: string;
  todoItems: TodoItem[];
}

export interface TodoBodyProps {
  color?: ColorName;
  todoTitle: string;
  todoItems: TodoItem[];
}

export interface TodoMainProps {
  todoTitle: string;
  color?: ColorName;
  containerClass?: string;
}

export interface TodoHeaderProps {
  todoTitle: string;
  todoHeader: string;
  color?: ColorName;
}

export interface TodoCard {
  todoTitle: string;
  color: ColorName;
  bg: string;
}
