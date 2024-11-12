import { Router, Request, Response } from "express";
import { ExpenseService } from "../services/expense";

const expenseRouter = Router();

const expenseService = new ExpenseService();

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

export default expenseRouter;
