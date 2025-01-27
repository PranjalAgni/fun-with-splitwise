import OpenAI from "openai";
import { prompt } from "../config/prompt.js";

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  public async askOpenAI(expenseDescription: string) {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      n: 1,
      messages: [
        { role: "developer", content: prompt },
        { role: "user", content: expenseDescription },
      ],
    });

    return completion;
  }
}
