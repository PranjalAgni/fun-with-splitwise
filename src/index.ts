import Splitwise from "splitwise";
import fs from "fs";
import { IExpense } from "./interface";

const config = {
  userId: 37000083,
  groupId: 61041898,
};

async function getAllExpenses(sw: any) {
  const data = await sw.getExpenses();
  fs.writeFileSync("data.json", JSON.stringify(data, null, 3), "utf8");
}

async function getGroups(sw: any) {
  const data = await sw.getGroups();
  fs.writeFileSync("group.json", JSON.stringify(data, null, 3), "utf8");
}

function getMonthNameFromDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
}

function parseAmount(amount: string) {
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? 0 : parsed;
}

function calculateMonthlySpend() {
  // expense
  // i have trimmed data
  //
  const groupExpenses = JSON.parse(
    fs.readFileSync("flat.json", "utf8")
  ) as IExpense[];
  const totalMonthlyExpenses: { [key: string]: number } = {};
  const userMonthlyExpenses: { [key: string]: number } = {};

  // console.log("expenses: ", groupExpense);
  for (const expense of groupExpenses) {
    const month = getMonthNameFromDate(expense.created_at);
    if (
      expense.creation_method === "payment" ||
      expense.creation_method === "debt_consolidation"
    )
      continue;
    if (!totalMonthlyExpenses[month]) {
      totalMonthlyExpenses[month] = 0;
    }

    if (!totalMonthlyExpenses[month]) {
      userMonthlyExpenses[month] = 0;
    }

    const isCreatedByMe = expense.created_by.id === config.userId;
    let num = null;
    if (isCreatedByMe) {
      num = Number(expense.cost);
    } else {
      const repaymentInfo = expense.repayments.find(
        (info) => info.from === config.userId
      );
      num = Number(repaymentInfo?.amount);
    }

    if (isCreatedByMe) {
      const totalRepayment = expense.repayments.reduce((acc, current) => {
        return acc + parseAmount(current.amount);
      }, 0);

      const userShare = parseAmount(expense.cost) - totalRepayment;
      userMonthlyExpenses[month] += userShare;
    } else {
      const repaymentInfo = expense.repayments.find(
        (info) => info.from === config.userId
      );
      userMonthlyExpenses[month] += parseAmount(repaymentInfo?.amount!);
    }

    if (!Number.isNaN(num)) {
      totalMonthlyExpenses[month] += num;
    }

    totalMonthlyExpenses[month] = parseFloat(
      totalMonthlyExpenses[month].toFixed(2)
    );

    userMonthlyExpenses[month] = parseFloat(
      userMonthlyExpenses[month].toFixed(2)
    );
  }

  fs.writeFileSync(
    "trend.json",
    JSON.stringify(totalMonthlyExpenses, null, 3),
    "utf8"
  );

  fs.writeFileSync(
    "moretrend.json",
    JSON.stringify(userMonthlyExpenses, null, 3),
    "utf8"
  );
}

function filterExpensesByUserAndGroup(
  expenses: IExpense[],
  options: { userId: number; groupId: number }
) {
  const filteredExpenses = expenses
    .filter(
      (expense) =>
        expense?.group_id === options.groupId &&
        expense.users.some((user) => user.user_id === options.userId)
    )
    .map((expense) => {
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
        updated_at: expense.updated_at,
        updated_by: {
          id: expense.updated_by?.id,
          first_name: expense.updated_by?.first_name,
          last_name: expense.updated_by?.last_name,
        },
        category: expense.category,
        users: expense.users,
      };
    });

  fs.writeFileSync(
    "flat.json",
    JSON.stringify(filteredExpenses, null, 3),
    "utf8"
  );
}

async function getExpensesByGroupId(id: string) {
  const sw = Splitwise({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    group_id: id,
  });

  const data = await sw.getExpenses({ user_id: "37000083", limit: 500 });
  filterExpensesByUserAndGroup(data, { userId: 37000083, groupId: 61041898 });
  fs.writeFileSync("block3803.json", JSON.stringify(data, null, 3), "utf8");
}
async function main() {
  // userid = 37000083;
  // block3/803 group = 61041898
  const sw = Splitwise({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
  });

  // await getAllExpenses(sw);
  // await getGroups(sw);
  // await getExpensesByGroupId("61041898");
  calculateMonthlySpend();
}

main();
