import fs from "fs/promises";
import path from "path";
import Splitwise from "splitwise";
import { FLAT_SPLITWISE_GROUP_EXPENSES } from "../config/constants.js";
import env from "../config/env.js";

export class SplitwiseService {
  private sw: any;
  private groupId: number;
  private userId: number;
  private dataDir: string;

  constructor() {
    this.groupId = env.GROUP_ID;
    this.userId = env.USER_ID;
    this.dataDir = path.join(import.meta.dirname, "../", "../", "data");
    this.sw = Splitwise({
      consumerKey: env.CONSUMER_KEY,
      consumerSecret: env.CONSUMER_SECRET,
    });
  }

  public async updateGroupExpenses({ limit = 500 } = {}) {
    const data = await this.sw.getExpenses({
      user_id: this.userId,
      group_id: this.groupId,
      limit,
    });

    if (!data) {
      throw new Error("Unable to fetch expenses from splitwise");
    }

    await this.writeExpenses(FLAT_SPLITWISE_GROUP_EXPENSES, data);
  }

  private async writeExpenses(filename: string, data: Object) {
    await fs.writeFile(
      path.join(this.dataDir, filename),
      JSON.stringify(data, null, 3),
      "utf8"
    );

    console.log("Wrote expenses to file");
  }
}
