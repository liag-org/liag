import getEnv from "@/utils/get-env";
import { json } from "@remix-run/server-runtime";

const env = getEnv();

export async function getProducts(token: string) {
  try {
    const req = await fetch(`${env.API_URL}/api/products`, {
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
