import OpenAI from "openai";
import { prompt } from "../config/prompt";

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

    console.log("query: %s", expenseDescription);
    console.log("oai completion: %s", JSON.stringify(completion));
    return completion;
  }
}
