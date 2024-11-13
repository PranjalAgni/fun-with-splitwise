import express from "express";
import cors from "cors";
import { SplitwiseService } from "./services/splitwise";
import expenseRouter from "./router/expenseRouter";
import splitwiseRouter from "./router/splitwiseRouter";

export const initalizeServer = async () => {
  const sw = new SplitwiseService();
  await sw.updateGroupExpenses();

  const app = express();
  app.use(cors());

  app.use("/api/v1/expenses", expenseRouter);
  app.use("/api/v1/splitwise", splitwiseRouter);
  return app;
};
