import { Router, Request, Response } from "express";
import { ExpenseService } from "../services/expense";
import { FLAT_GROUP_ID, NIT_USER_ID, SANDY_USER_ID } from "../config/constants";

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

export default expenseRouter;
