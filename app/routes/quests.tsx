import { DefaultPageLayout } from "@/components/templates/default-layout";
import { useOutlet } from "react-router";
import { Link, NavLink, useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getUserSession } from "@/session.server";
import { json } from "@remix-run/node";
import { useState } from "react";
import { getQuests } from "@/api/get-quest";

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await getUserSession(request);

  if (userSession) {
    try {
      const [questsResponse, categoriesResponse] = await Promise.all([
        getQuests(userSession.token, userSession.user.id),
        fetch("http://localhost:3000/api/categories"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${userSession.token}`,
          },
        },
      ]);
      const quests = await questsResponse;
      const categories = await categoriesResponse.json();

      return json({ quests: quests, categories });
    } catch (error) {
      console.error(error);
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  }
  return json({ userSession });
};

export default function Quests() {
  const outlet = useOutlet();
  const matches = useMatches();
  // data coming from the root loader function
  const data = matches.find(match => match.id === "root");
  const { userSession } = data?.data || {};
  const { categories, quests, error } = useLoaderData();
  const [clickedCategoryId, setClickedCategoryId] = useState<string | null>(
    null,
  );
  const [isCategoryVisible, setIsCategoryVisible] = useState<boolean>(false);

  return (
    <div className="w-full">
      <DefaultPageLayout
        title="Quests"
        buttonChildren={
          <Link
            to={`/quests/create`}
            className="flex items-center gap-[6px] rounded border border-[#363636] p-[10px] text-[12px] font-semibold text-[#7369F1] hover:bg-[#1f1f1f]">
            <img src="/assets/icons/plus.svg" alt="plus icon" />
            CREATE NEW
          </Link>
        }>
        <div className="flex h-full max-w-[1024px] rounded border border-[#363636]">
          {userSession ? (
            <nav className="flex w-[30%] flex-col justify-between border-r-[1px] border-[#363636]">
              <ul>
                {categories.docs.map(
                  (category: { id: string; title: string }) => (
                    <li
                      onClick={() => {
                        if (clickedCategoryId === category.id) {
                          setIsCategoryVisible(!isCategoryVisible);
                        } else {
                          setClickedCategoryId(category.id);
                          setIsCategoryVisible(true);
                        }
                      }}
                      className={` relative cursor-pointer border-b border-[#363636] bg-[#171717] py-5 px-5 text-[16px]`}
                      key={category.id}>
                      <div className={`flex flex-col gap-10 `}>
                        <div className="flex justify-between">
                          <h4 className="flex items-center gap-2">
                            {category.title}
                            {
                              <span>
                                (
                                {
                                  quests.docs.filter(
                                    (quest: {
                                      category: { id: string };
                                      completed: boolean;
                                    }) =>
                                      quest.category.id === category.id &&
                                      quest.completed === false,
                                  ).length
                                }
                                )
                              </span>
                            }
                          </h4>
                          <img
                            className={`transform ${
                              clickedCategoryId === category.id &&
                              isCategoryVisible
                                ? "rotate-90"
                                : "rotate-0"
                            } transition-transform duration-300`}
                            src="/assets/icons/drop-arrow.svg"
                            alt="arrow icon"
                          />
                        </div>

                        <ul
                          className="text-[14px]"
                          style={{
                            display:
                              clickedCategoryId === category.id &&
                              isCategoryVisible &&
                              quests.docs.filter(
                                (quest: {
                                  category: { id: string };
                                  completed: boolean;
                                }) =>
                                  quest.category.id === category.id &&
                                  quest.completed === false,
                              ).length > 0
                                ? "block"
                                : "none",
                          }}>
                          <span
                            className={
                              clickedCategoryId === category.id &&
                              isCategoryVisible
                                ? "absolute top-16 left-0 block h-[1px] w-full bg-[#363636] "
                                : "hidden"
                            }></span>
                          {quests && quests.docs.length > 0 ? (
                            quests.docs
                              .filter(
                                (quest: {
                                  category: { id: string };
                                  completed: boolean;
                                }) =>
                                  quest.category.id === category.id &&
                                  quest.completed === false,
                              )
                              .map((quest: { id: string; title: string }) => (
                                <li key={quest.id}>
                                  <NavLink
                                    to={`/quests/${quest.id}`}
                                    className="block w-full rounded p-3 text-[#fff] hover:bg-[#363636] hover:text-[#fff]">
                                    {quest.title}
                                  </NavLink>
                                </li>
                              ))
                          ) : (
                            <li>
                              <span className="block w-full rounded p-3 text-[#fff] hover:bg-[#363636] hover:text-[#fff]">
                                No quests
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  ),
                )}
              </ul>
              <div
                className="relative cursor-pointer border-t border-[#363636] bg-[#171717] py-5 px-5 text-[16px]"
                onClick={() => {
                  if (clickedCategoryId === "completed") {
                    setIsCategoryVisible(!isCategoryVisible);
                  } else {
                    setClickedCategoryId("completed");
                    setIsCategoryVisible(true);
                  }
                }}>
                <div className="flex flex-col gap-10 ">
                  <div className="flex justify-between">
                    <h4 className="flex items-center gap-2">
                      Completed{" "}
                      {
                        <span>
                          (
                          {
                            quests.docs.filter(
                              (quest: { completed: boolean }) =>
                                quest.completed,
                            ).length
                          }
                          )
                        </span>
                      }{" "}
                    </h4>
                    <img
                      className={`transform ${
                        clickedCategoryId === "completed" && isCategoryVisible
                          ? "rotate-90"
                          : "rotate-0"
                      } transition-transform duration-300`}
                      src="/assets/icons/drop-arrow.svg"
                      alt="arrow icon"
                    />
                  </div>
                  <span
                    className={
                      clickedCategoryId === "completed" && isCategoryVisible
                        ? "absolute top-16 left-0 block h-[1px] w-full bg-[#363636] "
                        : "hidden"
                    }></span>

                  <ul
                    className={
                      clickedCategoryId === "completed" &&
                      isCategoryVisible &&
                      quests.docs.filter(
                        (quest: { completed: boolean }) => quest.completed,
                      ).length > 0
                        ? "block text-[14px]"
                        : "hidden"
                    }>
                    {quests.docs
                      .filter(
                        (quest: { completed: boolean }) => quest.completed,
                      )
                      .map((quest: { id: string; title: string }) => (
                        <Link
                          to={`/quests/${quest.id}`}
                          className="block w-full rounded p-3 text-[#fff] hover:bg-[#363636] hover:text-[#fff]"
                          key={quest.id}>
                          {quest.title}
                        </Link>
                      ))}
                  </ul>
                </div>
              </div>
            </nav>
          ) : (
            <div>
              <h2>You need an account to start playing your life</h2>
              <Link to={"/register"}>Register</Link> or{" "}
              <Link to={"/login"}>Login</Link>
            </div>
          )}

          <div className=" w-[70%] p-9 pl-12">{outlet}</div>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
