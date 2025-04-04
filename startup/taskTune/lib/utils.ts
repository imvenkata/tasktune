export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}

