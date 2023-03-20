import { getUserById } from "@/api/get-user";
import { getUserSession } from "@/session.server";
import { Form, NavLink, useMatches } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import NavItem from "../molecules/nav-item";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const req = await getUserById(userSession.token, params?.userId);
  return json(req);
};

export default function Navbar() {
  const matches = useMatches();
  const data = matches.find(match => match.id === "root");
  const { userSession } = data?.data || {};

  console.log(userSession);
  return (
    <div className="flex h-full w-64 flex-col justify-between bg-[#171717] ">
      <div>
        <div className="p-4">
          {userSession && (
            <div>
              <div>{userSession.user.firstName}</div>
              <div>{userSession.user.golds}</div>
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <NavItem to={"/"}>home</NavItem>
          <NavItem to={"/quests"}>Quest</NavItem>
          <NavItem to={"/shop"}>Shop</NavItem>
        </div>
      </div>
      <Form className="p-4" action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
