export interface Category {
  id: string;
  name: string;
  color: string;       // base color string (hex or CSS var)
  textColor: string;   // text color for contrast
}

export interface Todo {
  id: string;
  title: string;
  note: string;
  categoryId: string;
  dueDate: string;     // ISO date string or ''
  completed: boolean;
  completedAt: string; // ISO date string or ''
  createdAt: string;   // ISO date string
}
