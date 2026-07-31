export function todayString(): string {
  return new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

export function dateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(dateString(d));
  }
  return days;
}

export function shortDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayString();
}
