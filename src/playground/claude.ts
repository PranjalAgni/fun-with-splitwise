// initial prompt already set

fetch(
  "https://claude.ai/api/organizations/18c661ba-6c5b-4fb2-82b4-1a5daf01946c/chat_conversations/902dd416-01e1-4084-9861-3826c8d345e7/completion",
  {
    headers: {
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
      cookie: "<COOKIE_HERE>",
      Referer: "https://claude.ai/chat/902dd416-01e1-4084-9861-3826c8d345e7",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: '{"prompt":"Chimta utensil","parent_message_uuid":"80cb8d4e-2b20-4e81-bdb2-d2c63a8a07ef","timezone":"Asia/Calcutta","personalized_styles":[{"name":"Normal","prompt":"Normal","summary":"Default responses from Claude","isDefault":true,"type":"default","key":"Default"}],"attachments":[],"files":[],"sync_sources":[],"rendering_mode":"messages"}',
    method: "POST",
  }
)
  .then(async (response) => {
    const stream = response.body;
    const reader = stream?.getReader();

    await readChunkss(reader!);
  })
  .catch(console.error);

async function readChunkss(reader: ReadableStreamDefaultReader<Uint8Array>) {
  try {
    const response = await reader.read();
    const { value, done } = response;
    if (done) {
      console.log("Stream finished");
      return false;
    } else {
      // Convert the chunk value to a string
      const chunkString = new TextDecoder().decode(value);
      // Log the chunk string
      console.log("got:", chunkString);
    }
  } catch (error) {
    console.error("Error occured reading stream: ", error);
    return false;
  }

  return true;
}
