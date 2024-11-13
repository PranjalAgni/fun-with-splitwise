import { Router, Request, Response } from "express";
import { SplitwiseService } from "../services/splitwise";

const splitwiseRouter = Router();

splitwiseRouter.get("/refresh", async (_req: Request, res: Response) => {
  try {
    const sw = new SplitwiseService();
    await sw.updateGroupExpenses();
    res.status(200).json({ message: "Refreshed" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

export default splitwiseRouter;
