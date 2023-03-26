import {
  Form,
  Link,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserSession, logout } from "@/session.server";
import { isAfter } from "date-fns";
import { json } from "@remix-run/node";
import { DefaultPageLayout } from "@/components/templates/default-layout";
import { CustomCheckbox } from "@/components/atoms/checkbox";
import { useState } from "react";
import { getQuestById } from "@/api/get-quest";

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

export const action = async ({ request, params }: ActionArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const req = await getQuestById(userSession.token, params?.questId);
  const tasks = req.tasks;

  const body = await request.formData();
  const formEntries = Object.fromEntries(body.entries());
  const updatedTaskId = Object.keys(formEntries)[0];
  const updatedTask = tasks.find(
    (task: { id: string }) => task.id === updatedTaskId,
  );
  updatedTask.completed = !updatedTask.completed;
  const previousTaskIndex = tasks.findIndex(
    (task: { id: string }) => task.id === updatedTaskId,
  );
  tasks.splice(previousTaskIndex, 1, updatedTask);

  try {
    const req = await fetch(
      `http://localhost:3000/api/quests/${params?.questId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${userSession.token}`,
        },
        body: JSON.stringify({
          ...formEntries,
          tasks: tasks,
        }),
      },
    );
  } catch (error) {
    console.error(error);
  }
  return json({ tasks });
};

export default function _index() {
  const matches = useMatches();
  // data coming from the root loader function
  const data = matches.find(match => match.id === "root");
  const { userSession } = data?.data || {};
  const { quests, error } = useLoaderData();
  const submit = useSubmit();
  const handleChange = (e: {
    currentTarget:
      | FormData
      | URLSearchParams
      | HTMLFormElement
      | HTMLButtonElement
      | HTMLInputElement
      | { [name: string]: string }
      | null;
  }) => {
    submit(e.currentTarget, { replace: true });
  };
  const [clickedQuestId, setClickedQuestId] = useState<string | null>(null);
  const [isQuestVisible, setIsQuestVisible] = useState<boolean>(false);
  return (
    <div className="w-full">
      {userSession ? (
        <div>
          <DefaultPageLayout title="Home">
            {error && <div>{error}</div>}
            {quests && (
              <div className=" flex max-h-[700px] min-h-fit w-fit gap-5 rounded border border-[#363636] bg-[#262626] p-5">
                <div className="flex flex-col gap-5 ">
                  <h3 className="text-[20px] ">Quests</h3>
                  <ul className="flex flex-col gap-5 ">
                    {quests.docs
                      .filter(
                        (quests: { pinned: boolean }) => quests.pinned === true,
                      )
                      .map(
                        (quest: {
                          id: string;
                          title: string;
                          tasks: string;
                        }) => (
                          <li
                            key={quest.id}
                            className=" relative flex w-72 flex-col justify-between rounded border border-[#363636] bg-[#262626] p-5 hover:cursor-pointer"
                            onClick={() => {
                              if (clickedQuestId === quest.id) {
                                setIsQuestVisible(!isQuestVisible);
                              } else {
                                setClickedQuestId(quest.id);
                                setIsQuestVisible(true);
                              }
                            }}>
                            <div className="flex justify-between text-[14px]">
                              {quest.title} -{" "}
                              {
                                quest.tasks.filter(
                                  (task: { completed: boolean }) =>
                                    task.completed === true,
                                ).length
                              }
                              /{quest.tasks.length}
                              <img
                                className={`transform ${
                                  clickedQuestId === quest.id && isQuestVisible
                                    ? "rotate-90"
                                    : "rotate-0"
                                } transition-transform duration-300`}
                                src="/assets/icons/drop-arrow.svg"
                                alt="arrow icon"
                              />
                            </div>
                            <span
                              className={
                                clickedQuestId === quest.id &&
                                isQuestVisible &&
                                quest.tasks.length > 0
                                  ? "absolute top-[61px] left-0 block h-[1px] w-full bg-[#363636] "
                                  : "hidden"
                              }></span>

                            <div
                              className={
                                clickedQuestId === quest.id &&
                                isQuestVisible &&
                                quest.tasks.length > 0
                                  ? "mt-10 block flex flex-col gap-3"
                                  : "hidden"
                              }>
                              {quest.tasks.map(
                                (task: {
                                  id: string;
                                  title: string;
                                  completed: boolean;
                                }) => (
                                  <Form
                                    onChange={handleChange}
                                    method="post"
                                    className=" flex items-start gap-[10px]"
                                    key={task.id}>
                                    <input
                                      type="hidden"
                                      name={task.id}
                                      value="false"
                                    />
                                    <input
                                      type="hidden"
                                      name="action"
                                      value="update-task"
                                    />
                                    <CustomCheckbox
                                      className="mt-[3px]"
                                      id={task.id}
                                      checked={task.completed}
                                      name={task.id}
                                    />
                                    <label
                                      className=" w-56 cursor-pointer text-[14px]"
                                      htmlFor={task.id}>
                                      {task.title}
                                    </label>
                                  </Form>
                                ),
                              )}
                            </div>
                          </li>
                        ),
                      )}
                  </ul>
                </div>
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
