import getEnv from "@/utils/get-env";
import { json } from "@remix-run/server-runtime";

const env = getEnv();

export async function getQuests(token: string, ownerId?: string) {
  if (!ownerId) return false;
  try {
    const req = await fetch(
      `${env.API_URL}/api/quests?where[owner][equals]=${ownerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
      },
    );
    return await req.json();
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
}

export async function getQuestById(token: string, questId?: string) {
  if (!questId) return false;
  try {
    const req = await fetch(`${env.API_URL}/api/quests/${questId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
    });
    return await req.json();
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
}
