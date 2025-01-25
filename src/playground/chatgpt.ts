// function getConversationId() {
//   return "6759cae8-852c-800c-9be1-9e25e480e947";
// }
const g = require("./i5bamk05qmvsi6c3.js");
function chatRequirementTokens() {
  return {
    "openai-sentinel-proof-token": "<TOKEN_HERE>",
    "openai-sentinel-turnstile-token": "<TOKEN_HERE>",
  };
}

function buildHeaders(cookieMap: Map<string, string>, token: string) {
  return {
    accept: "text/event-stream",
    "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "oai-device-id": cookieMap.get("oai-did")!,
    "oai-language": "en-US",
    "openai-sentinel-chat-requirements-token": token,
    pragma: "no-cache",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    cookie: cookieMap.get("_COOKIE_IS_")!,
    Referer: "https://chatgpt.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };
}

function buildPayload(message: string) {
  return {
    action: "next",
    messages: [
      {
        id: "aaa229ff-2914-45aa-95ff-68138c9c282b",
        author: {
          role: "user",
        },
        content: {
          content_type: "text",
          parts: message || [
            "Okay so I want to build a cool app using Bun and typescript",
          ],
        },
        metadata: {
          serialization_metadata: {
            custom_symbol_offsets: [],
          },
        },
        create_time: null,
      },
    ],
    parent_message_id: "aaa123e0-f395-4e96-a6b8-05f606cce21d",
    model: "text-davinci-002-render-sha",
    timezone_offset_min: -330,
    timezone: "Asia/Calcutta",
    conversation_mode: {
      kind: "primary_assistant",
    },
    force_paragen: false,
    force_paragen_model_slug: "",
    force_rate_limit: false,
    reset_rate_limits: false,
    system_hints: [],
    supported_encodings: ["v1"],
    conversation_origin: null,
    client_contextual_info: {
      is_dark_mode: true,
      time_since_loaded: 216,
      page_height: 430,
      page_width: 1728,
      pixel_ratio: 2,
      screen_height: 1117,
      screen_width: 1728,
    },
    paragen_stream_type_override: null,
    paragen_cot_summary_display_override: "allow",
    supports_buffering: true,
  };
}

async function readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
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

async function main(cookie: Map<string, string>, sentinelToken: string) {
  const URL = "https://chatgpt.com/backend-anon/conversation/";
  const message = "Okay so I want to build a cool app using Bun and typescript";
  const response = await fetch(URL, {
    headers: buildHeaders(cookie, sentinelToken),
    body: JSON.stringify(buildPayload(message)),
    method: "POST",
    referrer: "https://chatgpt.com/c/6759cae8-852c-800c-9be1-9e25e480e947",
    referrerPolicy: "strict-origin-when-cross-origin",
    mode: "cors",
    credentials: "include",
  });

  const stream = response.body;
  if (!stream) throw new Error("Stream is empty");
  const reader = stream?.getReader();
  let isRead = await readChunks(reader);
  while (isRead) {
    isRead = await readChunks(reader);
  }
}

async function fetchCookies() {
  const URL = "https://chatgpt.com/";
  const response = await fetch(URL, {
    headers: {
      "Cache-Control": "no-cache",
      "USER-AGENT":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
    method: "GET",
  });

  const cookiesMap = new Map<string, string>();
  let cookieString = "";
  for (let [key, value] of response.headers.entries()) {
    if (key.includes("cookie")) {
      cookieString += value + ";";
      for (const segment of value.split(";")) {
        if (segment.includes("=")) {
          const [k, v] = segment.split("=").map((str) => str.trim());
          cookiesMap.set(k, v);
        }
      }

      cookiesMap.set("_COOKIE_IS_", cookieString);
    }
  }

  return cookiesMap;
}

async function fetchSentinelToken(cookies: Map<string, string>) {
  const URL = "https://chatgpt.com/backend-anon/sentinel/chat-requirements";
  const response = await fetch(URL, {
    headers: {
      "oai-device-id": cookies.get("oai-did")!,
      "oai-language": "en-US",
      origin: "https://chat.openai.com",
      referer: "https://chat.openai.com/",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
    method: "POST",
  });

  const data = await response.json();
  console.log(data);
  return data;
}

async function AwtsmoosGPTify({
  prompt = "Hi! Tell me about the Atzmut, but spell it Awtsmoos",
  parent_message_id,
  conversation_id,
  callback = null,
}: {
  prompt: string;
  parent_message_id: string;
  conversation_id: string;
  callback: any;
}) {
  var session = await getSession();

  var token = session.accessToken;
  var convo = await getConversation(conversation_id, token);
  if (!parent_message_id) parent_message_id = convo?.current_node;

  async function getConversation(conversation_id: string, token: string) {
    return await (
      await fetch(
        "https://chatgpt.com/backend-api/conversation/" + conversation_id,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            authorization: "Bearer " + token,
          },
          method: "GET",
        }
      )
    ).json();
  }

  async function getSession() {
    return await (await fetch("https://chatgpt.com/api/auth/session")).json();
  }

  async function awtsmoosifyTokens() {
    const z = await g.bk(); //chat requirements

    const r = await g.bi(z.turnstile.bx); //turnstyle token
    const arkose = await g.bl.getEnforcementToken(z);
    const p = await g.bm.getEnforcementToken(z); //p token

    //A = fo(e.chatReq, l ?? e.arkoseToken, e.turnstileToken, e.proofToken, null)

    return g.fX(z, arkose, r, p, null);
  }
  const t = {
    action: "next",
    messages: [
      {
        id: generateUID(),
        author: {
          role: "user",
        },
        content: {
          content_type: "text",
          parts: [prompt],
        },
        metadata: {
          serialization_metadata: {
            custom_symbol_offsets: [],
          },
        },
        create_time: performance.now(),
      },
    ],
    conversation_id,
    parent_message_id,
    model: "auto",
    timezone_offset_min: 300,
    timezone: "America/New_York",
    suggestions: [],
    history_and_training_disabled: false,
    conversation_mode: {
      kind: "primary_assistant",
      plugin_ids: null,
    },
    force_paragen: false,
    force_paragen_model_slug: "",
    force_rate_limit: false,
    reset_rate_limits: false,
    system_hints: [],
    force_use_sse: true,
    supported_encodings: ["v1"],
    conversation_origin: null,
    client_contextual_info: {
      is_dark_mode: false,
      time_since_loaded: 121,
      page_height: 625,
      page_width: 406,
      pixel_ratio: 1,
      screen_height: 768,
      screen_width: 1366,
    },
    paragen_stream_type_override: null,
    paragen_cot_summary_display_override: "allow",
    supports_buffering: true,
  };

  function generateUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  await sendIt(await awtsmoosifyTokens(), t);

  async function sendIt(headers: any, body: any) {
    var g = await fetch("https://chatgpt.com/backend-api/conversation", {
      headers: {
        accept: "text/event-stream",
        "accept-language": "en-US,en;q=0.9",
        authorization: "Bearer " + token,
        "content-type": "application/json",

        ...headers,
      },
      body: JSON.stringify(t),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    await logStream(g);
  }

  async function logStream(response: any) {
    var hasCallback = typeof callback == "function";
    var myCallback = hasCallback ? callback : () => {};
    // Check if the response is okay
    if (!response.ok) {
      console.error("Network response was not ok:", response.statusText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    var curEvent = null;
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log("Stream finished");
        break;
      }

      // Decode the current chunk and add to the buffer
      buffer += decoder.decode(value, { stream: true });

      // Split buffer into lines
      const lines = buffer.split("\n");

      // Process each line
      for (let line of lines) {
        line = line.trim(); // Remove whitespace

        // Check if the line starts with "event:" or "data:"
        if (line.startsWith("event:")) {
          const event = line.substring(6).trim(); // Extract event type
          curEvent = event;
        } else if (line.startsWith("data:")) {
          const data = line.substring(5).trim(); // Extract data

          // Attempt to parse the data as JSON
          try {
            const jsonData = JSON.parse(data);
            if (!hasCallback) console.log("Parsed JSON Data:", jsonData);
            myCallback?.({ data: jsonData, event: curEvent });
          } catch (e) {
            if (!hasCallback) console.warn("Data is not valid JSON:", data);
            myCallback({ dataNoJSON: data, event: curEvent, error: e });
          }
        }
      }

      // Clear the buffer if the last line was complete
      if (lines[lines.length - 1].trim() === "") {
        buffer = "";
      } else {
        // Retain incomplete line for next iteration
        buffer = lines[lines.length - 1];
      }
    }
  }
}

(async function () {
  // const cookies = await fetchCookies();
  // const sentinelTokens = await fetchSentinelToken(cookies);
  // await main(cookies, sentinelTokens.token);

  await AwtsmoosGPTify({
    prompt: "Is this working?",
    conversation_id: "6759cae8-852c-800c-9be1-9e25e480e947",
    parent_message_id: "",
    callback: null,
  });
})();

// type: sentinel token

// turnstile token
// proof token
