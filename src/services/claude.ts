import env from "../config/env.js";
import { prompt } from "../config/prompt.js";

export class ClaudeService {
  private baseURL: string;
  private headers: Record<string, string>;
  private query: string;
  constructor() {
    this.baseURL = `https://claude.ai/api/organizations/${env.CLAUDE_ORG_ID}/chat_conversations/${env.CLAUDE_CONV_ID}/completion`;
    this.headers = this.buildHeaders();
    this.query = "";
  }
  private buildHeaders() {
    return {
      accept: "text/event-stream, text/event-stream",
      "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
      baggage:
        "sentry-environment=production,sentry-release=56f4eaa7e209ceb415c062dfa2bd0cc18ea1a3bb,sentry-public_key=58e9b9d0fc244061a1b54fe288b0e483,sentry-trace_id=0c416b4c952a401d877c865bfb31f1df",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "sentry-trace": "0c416b4c952a401d877c865bfb31f1df-a8ae09ec0e2cada8-0",
      cookie: env.CLAUDE_COOKIE,
      Referer: "https://claude.ai/chat/902dd416-01e1-4084-9861-3826c8d345e7",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };
  }

  private buildPayload() {
    return {
      prompt: this.query,
      parent_message_uuid: env.CLAUDE_PARENT_MESSAGE_UUID,
      timezone: "Asia/Calcutta",
      personalized_styles: [
        {
          name: "Normal",
          prompt: "Normal",
          summary: "Default responses from Claude",
          isDefault: true,
          type: "default",
          key: "Default",
        },
      ],
      attachments: [],
      files: [],
      sync_sources: [],
      rendering_mode: "messages",
    };
  }

  private buildPrompt(expenseDescription: string) {
    return "\n" + expenseDescription + "\n";
    // return prompt + "\n" + expenseDescription;
  }
  private async doRequest() {
    const response = await fetch(this.baseURL, {
      headers: this.headers,
      body: JSON.stringify(this.buildPayload()),
      method: "POST",
    });

    return response;
  }

  private parseEvent(event: string) {
    console.log("event: %s", event);
    const dataMatch = event.match(/data:\s*(\{.*\})/);
    if (!dataMatch || dataMatch.length < 2) {
      throw new Error("Unable to extract data from event string.");
    }

    const dataString = dataMatch[1].trim();
    const parsedData = JSON.parse(dataString);
    console.log("data: %s", dataString);
    const type = parsedData.type;

    if (type === "content_block_start") {
      const text = parsedData.content_block.text;
      return text;
    } else if (type === "content_block_delta") {
      const text = parsedData.delta.text;
      return text;
    } else if (type === "content_block_stop") {
      // now no need to process more
      console.log("DONE...");
    }
  }

  public async askClaude(expenseDescription: string) {
    this.query = this.buildPrompt(expenseDescription);
    const response = await this.doRequest();
    const stream = response.body;
    let reader = stream?.getReader();
    let answer = "";
    while (true) {
      const { done, value } = await reader?.read()!;
      if (done) {
        break;
      } else {
        const chunkString = new TextDecoder().decode(value, { stream: true });
        const result = this.parseEvent(chunkString);
        if (result && result.length > 0) answer += result;
      }
    }

    return answer;
  }
}
