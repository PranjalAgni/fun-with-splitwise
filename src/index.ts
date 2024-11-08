import { SplitwiseService } from "./services/splitwise";
import { ExpenseService } from "./services/expense";

async function main() {
  const sw = new SplitwiseService();
  await sw.updateGroupExpenses();
  const expenseService = new ExpenseService();
  await expenseService.calculateMonthlySpendings();
}

main();
