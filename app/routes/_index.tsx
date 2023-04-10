import {
  Form,
  Link,
  useLoaderData,
  useMatches,
  useSubmit,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserSession } from "@/session.server";
import { json } from "@remix-run/node";
import { DefaultPageLayout } from "@/components/templates/default-layout";
import { CustomCheckbox } from "@/components/atoms/checkbox";
import { useState } from "react";
import { getQuestById, getQuests } from "@/api/get-quest";
import getEnv from "@/utils/get-env";

export const loader = async ({ request }: { request: Request }) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  try {
    const req = await getQuests(userSession.token, userSession.user.id);
    return json({ userSession, quests: req.docs });
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
};

export const action = async ({ request }: ActionArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const body = await request.formData();
  const formEntries = Object.fromEntries(body.entries());
  const questId = formEntries.questId;
  const req = await getQuestById(userSession.token, questId as string);
  const tasks = req.tasks;

  const updatedTaskId = Object.keys(formEntries)[1];
  const updatedTask = tasks.find(
    (task: { id: string }) => task.id === updatedTaskId,
  );

  updatedTask.completed = !updatedTask.completed;
  const previousTaskIndex = tasks.findIndex(
    (task: { id: string }) => task.id === updatedTaskId,
  );

  tasks.splice(previousTaskIndex, 1, updatedTask);
  const env = getEnv();

  try {
    const req = await fetch(`${env.API_URL}/api/quests/${questId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${userSession.token}`,
      },
      body: JSON.stringify({
        ...formEntries,
        tasks: tasks,
      }),
    });
    return json({ status: "success" });
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 400 });
  }
};

export default function _index() {
  const matches = useMatches();
  // data coming from the root loader function
  const data = matches.find(match => match.id === "root");
  const { user } = data?.data || {};
  const { quests } = useLoaderData();

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
      {user ? (
        <div>
          <DefaultPageLayout title="Home">
            {quests && (
              <div className=" flex max-h-[700px] min-h-fit w-fit gap-5 rounded border border-[#363636] bg-[#262626] p-5">
                <div className="flex flex-col gap-5 ">
                  <h3 className="text-[20px] ">Quests</h3>
                  <ul className="flex flex-col gap-5 ">
                    {quests
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
                            className=" relative flex w-72 flex-col justify-between rounded border border-[#363636] bg-[#262626]  ">
                            <div
                              className="flex h-full w-full justify-between p-5 text-[14px] hover:cursor-pointer "
                              onClick={() => {
                                if (clickedQuestId === quest.id) {
                                  setIsQuestVisible(!isQuestVisible);
                                } else {
                                  setClickedQuestId(quest.id);
                                  setIsQuestVisible(true);
                                }
                              }}>
                              <div className="flex w-[90%] justify-between">
                                <Link
                                  className="truncate hover:underline"
                                  title={quest.title}
                                  to={"/quests/" + quest.id}>
                                  {quest.title}
                                </Link>
                                <p>
                                  {
                                    quest.tasks.filter(
                                      (task: { completed: boolean }) =>
                                        task.completed === true,
                                    ).length
                                  }
                                  /{quest.tasks.length}
                                </p>
                              </div>
                              <img
                                className={`w-2 transform ${
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
                                  ? "flex flex-col gap-3 p-5"
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
                                      name={"questId"}
                                      value={quest.id}
                                    />
                                    <input
                                      type="hidden"
                                      name={task.id}
                                      value="false"
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
