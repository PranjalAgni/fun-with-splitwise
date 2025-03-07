import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

type Data = {
  llm: {
    expense: string;
    category: string;
  }[];
};

// Read or create db.json
const defaultData = { llm: [] };

export async function initDB() {
  const db = new Low(new JSONFile<Data>("db.json"), defaultData);
  // const db = await JSONFilePreset<Data>("db.json", defaultData);
  // const ss = await db.read();
  // console.log(JSON.stringify(ss));
  return db;
}