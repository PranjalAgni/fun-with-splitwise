import express from "express";
import cors from "cors";
import expenseRouter from "./router/expenseRouter";
import { SplitwiseService } from "./services/splitwise";

export const initalizeServer = async () => {
  const sw = new SplitwiseService();
  await sw.updateGroupExpenses();

  const app = express();
  app.use(cors());

  app.use("/api/v1/expenses", expenseRouter);
  return app;
};
