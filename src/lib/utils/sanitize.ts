export function sanitizeInput(input: string): string {
  return input
    .slice(0, 200)
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}
