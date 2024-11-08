export function getMonthNameFromDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}
