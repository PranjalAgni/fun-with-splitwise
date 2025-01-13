export function getMonthNameFromDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

export function getYearFromDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { year: "2-digit" }).format(date);
}
