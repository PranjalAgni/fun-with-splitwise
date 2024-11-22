import { initalizeServer } from "./app";
import env from "./config/env";

async function main() {
  // initalizaing the app with settings
  const app = await initalizeServer();

  app.listen(env.PORT, () => {
    console.log(`Server is running on http://localhost:${env.PORT}`);
  });
}

main();
