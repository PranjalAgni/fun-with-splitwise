import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().min(1000).max(65535).optional().default(3000),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  USER_ID: z.coerce.number(),
  GROUP_ID: z.coerce.number(),
  CLAUDE_ORG_ID: z.coerce.string(),
  CLAUDE_CONV_ID: z.coerce.string(),
  CLAUDE_COOKIE: z.coerce.string(),
  CLAUDE_PARENT_MESSAGE_UUID: z.coerce.string(),
});

const env = envSchema.parse(process.env);

export default env;
