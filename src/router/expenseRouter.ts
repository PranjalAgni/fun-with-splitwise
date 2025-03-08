import { Router, Request, Response } from "express";
import { ExpenseService } from "../services/expense.js";
import {
  FLAT_GROUP_ID,
  NIT_USER_ID,
  SANDY_USER_ID,
} from "../config/constants.js";
import { OpenAIService } from "../services/openai.js";
import { initDB } from "../cache.js";

// initalizing a router to attach endpoints
const expenseRouter = Router();

const expenseService = new ExpenseService();
const openaiService = new OpenAIService();

expenseRouter.get("/monthly-spendings", async (req: Request, res: Response) => {
  const data = await expenseService.calculateMonthlySpendings();
  res.status(200).json(data);
});

expenseRouter.get(
  "/monthly-descriptions",
  async (req: Request, res: Response) => {
    const data = await expenseService.getMonthlyDescriptions();
    res.status(200).json(data);
  }
);

expenseRouter.get("/sandy", async (req: Request, res: Response) => {
  const s_exp_service = new ExpenseService(FLAT_GROUP_ID, SANDY_USER_ID);
  const data = await s_exp_service.calculateMonthlySpendings();
  res.status(200).json(data);
});

expenseRouter.get(
  "/sandy-monthly-descriptions",
  async (req: Request, res: Response) => {
    const s_exp_service = new ExpenseService(FLAT_GROUP_ID, SANDY_USER_ID);
    const data = await s_exp_service.getMonthlyDescriptions();
    res.status(200).json(data);
  }
);

expenseRouter.get("/nit", async (req: Request, res: Response) => {
  const s_exp_service = new ExpenseService(FLAT_GROUP_ID, NIT_USER_ID);
  const data = await s_exp_service.calculateMonthlySpendings();
  res.status(200).json(data);
});

expenseRouter.get(
  "/nit-monthly-descriptions",
  async (req: Request, res: Response) => {
    const nit_exp_service = new ExpenseService(FLAT_GROUP_ID, NIT_USER_ID);
    const data = await nit_exp_service.getMonthlyDescriptions();
    res.status(200).json(data);
  }
);

expenseRouter.get("/categorizer", async (req: Request, res: Response) => {
  const expenses = await expenseService.readAndParseExpenses();
  const allCategories = [];
  let pos = 0;
  const cache = await initDB();
  let isFromCache = false;
  for (const expense of expenses) {
    if (pos >= 10) {
      break;
    } else {
      let category = "";
      // Check if the expense is already in the cache
      const cachedCategory = cache.data.llm.find(
        (item) => item.expense === expense.description
      );
      if (!cachedCategory) {
        const response = await openaiService.fetchCategoryFromGPT(expense.description);
        cache.data.llm.push({
          expense: expense.description,
          category: response.choices[0].message.content!,
        });

        category = response.choices[0].message.content!;
      } else {
        category = cachedCategory.category;
        isFromCache = true;
      }

      allCategories.push({
        name: expense.description,
        category,
        metadata: {
          msg: isFromCache ? "From Cache" : "From AI",
        },
      });

      pos += 1;
      await cache.write();
    }
  }

  res.status(200).json(allCategories);
});

export default expenseRouter;
