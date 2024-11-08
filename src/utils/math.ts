export function parseAmount(amount: string) {
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? 0 : parsed;
}
