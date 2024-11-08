import { z } from "zod";

const envSchema = z.object({
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  USER_ID: z.coerce.number(),
  GROUP_ID: z.coerce.number(),
});

const env = envSchema.parse(process.env);

export default env;
