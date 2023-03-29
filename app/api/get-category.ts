import getEnv from "@/utils/get-env";
import { json } from "@remix-run/server-runtime";

const env = getEnv();

export async function getCategoryById(token: string, categoryId?: string) {
  if (!categoryId) return false;
  try {
    const req = await fetch(`${env.API_URL}/api/categories/${categoryId}`, {
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
