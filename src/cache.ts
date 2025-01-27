import { JSONFilePreset } from "lowdb/node";

type Data = {
  llm: {
    expense: string;
    category: string;
  }[];
};

// Read or create db.json
const defaultData = { llm: [] };

export async function initDB() {
  const db = await JSONFilePreset<Data>("db.json", defaultData);
  const ss = await db.read();
  console.log(JSON.stringify(ss));
  return db;
}
