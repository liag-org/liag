import { getUserLevel } from "@/utils/get-user-level";
import { Form, Link, useMatches } from "@remix-run/react";
import NavItem from "../molecules/nav-item";

export default function Navbar() {
  const matches = useMatches();
  const data = matches.find(match => match.id === "root");
  const { user, levels } = data?.data || {};
  console.log(levels);
  const matchedLevel = getUserLevel(
    levels.docs.sort(
      (a: { level: number }, b: { level: number }) => a.level - b.level,
    ),

    user?.xp,
  );
  console.log(matchedLevel);

  return (
    <div className="flex h-full w-64 flex-col justify-between bg-[#171717]">
      <div>
        <div className="p-6">
          {user && (
            <div className="flex flex-col gap-3">
              <div className="rounded bg-gradient-to-r from-[#AE8626] via-[#F7EF8A] to-[#EDC967] p-1 ">
                <img className="rounded" src={user.avatar?.url} alt="PP" />
              </div>
              <div className="capitalize">{user.firstName}</div>
              <div>
                <span className="font-bold text-[#E4BC2F]">Golds</span> :{" "}
                {user.golds}
              </div>
              <div className="">
                <span>Niveau :</span> {matchedLevel?.level}
              </div>
              <div className="h-5">
                <div className="h-[6px] rounded bg-[#7e7e7e]">
                  <div
                    className="h-full rounded bg-[#69a2f1]"
                    style={{
                      width: `${
                        ((user.xp - matchedLevel.currentLevelXp) /
                          matchedLevel?.expToNextLevel) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[14px] text-[#69a2f1]">
                  <div>{user.xp - matchedLevel.currentLevelXp} xp</div>
                  <div>{matchedLevel?.expToNextLevel} xp</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <hr className="border-[#363636]" />
        <div className="flex flex-col">
          <NavItem to={"/"}>Home</NavItem>
          <div className="relative">
            <NavItem className=" flex justify-between" to={"/quests"}>
              Quest
            </NavItem>
            <Link
              to={`/quests/create`}
              className="absolute right-[12px] top-2/4 flex -translate-y-2/4 items-center gap-2 rounded border border-[#FAFAFA] p-1 pr-2 text-[12px] font-semibold text-[#FAFAFA] hover:bg-[#363636]">
              <img src="/assets/icons/plus-white.svg" alt="plus icon" />
              NEW
            </Link>
          </div>
          <NavItem to={"/inventory"}>Inventory</NavItem>
          <NavItem to={"/shop"}>Shop</NavItem>
          <NavItem to={"/character"}>Character</NavItem>
        </div>
      </div>
      <Form className="p-4" action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
