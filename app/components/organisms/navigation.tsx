import { Form, useMatches } from "@remix-run/react";
import NavItem from "../molecules/nav-item";

export default function Navbar() {
  const matches = useMatches();
  const data = matches.find(match => match.id === "root");
  const { user } = data?.data || {};

  return (
    <div className="flex h-full w-64 flex-col justify-between bg-[#171717] ">
      <div>
        <div className="p-8">
          {user && (
            <div className="flex flex-col gap-3">
              <div className="rounded bg-gradient-to-r from-[#AE8626] via-[#F7EF8A] to-[#EDC967] p-1 ">
                <img
                  className="rounded"
                  src={`http://localhost:3000${user.avatar.url}`}
                  alt="PP zak"
                />
              </div>
              <div className="font-bold capitalize">{user.firstName}</div>
              <div className="">
                <span className="font-bold">Niveau :</span> {"2"}
              </div>
              <div>
                <span className="font-bold text-[#E4BC2F]">Golds</span> :{" "}
                {user.golds}
              </div>
            </div>
          )}
        </div>
        <hr className="border-[#363636]" />
        <div className="flex flex-col">
          <NavItem to={"/"}>Home</NavItem>
          <NavItem to={"/quests"}>Quest</NavItem>
          <NavItem to={"/inventory"}>Inventory</NavItem>
          <NavItem to={"/shop"}>Shop</NavItem>
        </div>
      </div>
      <Form className="p-4" action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
