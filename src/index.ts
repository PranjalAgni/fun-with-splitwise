import { initalizeServer } from "./app.js";
import env from "./config/env.js";

async function main() {
  const app = await initalizeServer();

  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

main();
