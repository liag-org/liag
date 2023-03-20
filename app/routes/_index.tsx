import { Form, Link, useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getUserSession, logout } from "@/session.server";
import { isAfter } from "date-fns";
import { json } from "@remix-run/node";
import { DefaultPageLayout } from "@/components/templates/default-layout";

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await getUserSession(request);

  if (userSession) {
    const expires = new Date(userSession.exp * 1000);
    const now = new Date();
    const isExpired = isAfter(now, expires);
    if (isExpired) return await logout(request);
    console.info("userSession", userSession);
    try {
      const req = await fetch("http://localhost:3000/api/quests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${userSession.token}`,
        },
      });
      return json({ quests: await req.json() });
    } catch (error) {
      console.error(error);
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  }
  return json({ userSession });
};

export default function _index() {
  const matches = useMatches();
  // data coming from the root loader function
  const data = matches.find(match => match.id === "root");
  const { userSession } = data?.data || {};
  const { quests, error } = useLoaderData();
  return (
    <div className="w-full">
      {userSession ? (
        <div>
          <DefaultPageLayout title="Home">
            {error && <div>{error}</div>}
            {quests && (
              <div>
                {quests.docs.map((quest: { id: string; title: string }) => (
                  <div key={quest.id}>
                    <Link to={`/quests/${quest.id}`}>{quest.title}</Link>
                  </div>
                ))}
              </div>
            )}
          </DefaultPageLayout>
        </div>
      ) : (
        <div>
          <h2>You need an account to start playing your life</h2>
          <Link to={"/register"}>Register</Link> or{" "}
          <Link to={"/login"}>Login</Link>
        </div>
      )}
    </div>
  );
}
