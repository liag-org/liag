import { Form, useMatches } from "@remix-run/react";
import NavItem from "../molecules/nav-item";

export default function Navbar() {
  const matches = useMatches();
  const data = matches.find(match => match.id === "root");
  const { user } = data?.data || {};

  return (
    <div className="flex h-full w-64 flex-col justify-between bg-[#171717] ">
      <div>
        <div className="p-4">
          {user && (
            <div>
              <img
                src={`http://localhost:3000${user.avatar.url}`}
                alt="PP zak"
              />
              <div>{user.firstName}</div>
              <div>{user.golds}</div>
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
