import fs from "fs/promises";
import path from "path";
import { FLAT_SPLITWISE_GROUP_EXPENSES } from "../config/constants";
import env from "../config/env";
import { IExpense } from "../interface";
import { getMonthNameFromDate } from "../utils/date";
import { parseAmount } from "../utils/math";

export class ExpenseService {
  private groupId: number;
  private userId: number;
  private dataDir: string;

  constructor(groupId: number = env.GROUP_ID, userId: number = env.USER_ID) {
    this.groupId = groupId;
    this.userId = userId;
    this.dataDir = path.join(__dirname, "../", "../", "data");
  }

  private filterExpensesById(expenses: IExpense[]): IExpense[] {
    const userExpenses = expenses.filter(
      (expense) =>
        expense.group_id === this.groupId &&
        expense.users.some((user) => user.user_id === this.userId)
    );

    return userExpenses;
  }

  public async readAndParseExpenses(): Promise<IExpense[]> {
    const data = await fs.readFile(
      path.join(this.dataDir, FLAT_SPLITWISE_GROUP_EXPENSES),
      "utf8"
    );
    const expenses = JSON.parse(data) as IExpense[];
    return this.filterExpensesById(expenses).map((expense) => {
      return {
        id: expense.id,
        group_id: expense.group_id,
        description: expense.description,
        details: expense.details,
        payment: expense.payment,
        creation_method: expense.creation_method,
        cost: expense.cost,
        currency_code: expense.currency_code,
        repayments: expense.repayments,
        created_at: expense.created_at,
        created_by: {
          id: expense.created_by.id,
          first_name: expense.created_by.first_name,
          last_name: expense.created_by.last_name,
        },
        category: expense.category,
        users: expense.users,
      };
    });
  }

  public async calculateMonthlySpendings() {
    const expenses = await this.readAndParseExpenses();
    const monthlyExpense: { [key: string]: number } = {};

    for (const expense of expenses) {
      if (
        expense.creation_method === "payment" ||
        expense.creation_method === "debt_consolidation"
      ) {
        continue;
      }

      const month = getMonthNameFromDate(expense.created_at);
      if (!monthlyExpense[month]) {
        monthlyExpense[month] = 0;
      }

      const isCreatedByMe = expense.created_by.id === this.userId;

      if (isCreatedByMe) {
        const totalRepayment = expense.repayments.reduce((acc, current) => {
          return acc + parseAmount(current.amount);
        }, 0);

        const userShare = parseAmount(expense.cost) - totalRepayment;
        monthlyExpense[month] += userShare;
      } else {
        const repaymentInfo = expense.repayments.find(
          (info) => info.from === this.userId
        );
        monthlyExpense[month] += parseAmount(repaymentInfo?.amount!);
      }

      monthlyExpense[month] = parseAmount(monthlyExpense[month].toFixed(2));
    }

    return monthlyExpense;
  }

  public async getMonthlyDescriptions() {
    const expenses = await this.readAndParseExpenses();
    const expenseDescriptions: {
      [key: string]: Array<{ title: string; cost: number }>;
    } = {};

    for (const expense of expenses) {
      if (
        expense.creation_method === "payment" ||
        expense.creation_method === "debt_consolidation"
      ) {
        continue;
      }

      const month = getMonthNameFromDate(expense.created_at);
      if (!expenseDescriptions[month]) {
        expenseDescriptions[month] = [];
      }

      const isCreatedByMe = expense.created_by.id === this.userId;

      if (isCreatedByMe) {
        const totalRepayment = expense.repayments.reduce((acc, current) => {
          return acc + parseAmount(current.amount);
        }, 0);

        const userShare = parseAmount(expense.cost) - totalRepayment;
        expenseDescriptions[month].push({
          title: expense.description,
          cost: userShare,
        });
      } else {
        const repaymentInfo = expense.repayments.find(
          (info) => info.from === this.userId
        );
        expenseDescriptions[month].push({
          title: expense.description,
          cost: parseAmount(repaymentInfo?.amount!),
        });
      }
    }

    return expenseDescriptions;
  }
}
