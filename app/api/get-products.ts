import { json } from "@remix-run/server-runtime";

export async function getProducts(token: string) {
  try {
    const req = await fetch(`http://localhost:3000/api/products`, {
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
