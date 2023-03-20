import { getQuestById } from "@/api/get-quest";
import { PrimaryButton } from "@/components/atoms/button";
import { CustomCheckbox } from "@/components/atoms/checkbox";
import { getUserSession } from "@/session.server";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "react-router";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const req = await getQuestById(userSession.token, params?.questId);
  return json(req);
};

export const action = async ({ request, params }: ActionArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const req = await getQuestById(userSession.token, params?.questId);
  const tasks = req.tasks;

  const body = await request.formData();

  switch (body.get("action")) {
    case "completed":
      {
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
                completed: true,
              }),
            },
          );
        } catch (error) {
          console.error(error);
        }
      }
      break;
    case "update-task":
      {
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
      }
      break;
    default:
      break;
  }

  return json({ tasks });
};

export default function Quest() {
  const data = useLoaderData<typeof loader>();
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

  return (
    <div className="flex h-full justify-between">
      <div className="flex w-full flex-col gap-10">
        <h2 className="text-[24px]">{data.title}</h2>
        <div className="w-[60%]">
          <h3 className="mb-5 border-b-[1px] border-[#363636] pb-[6px] text-[14px] text-[#9F9F9F]">
            Description
          </h3>
          <div className="w-[80%] text-[14px] italic leading-[22px] text-[#C8C6E4]">
            {data.description}
          </div>
        </div>
        <div className="w-[60%]">
          <h3 className="mb-5 border-b-[1px] border-[#363636] pb-[6px] text-[14px] text-[#9F9F9F]">
            Objectifs
          </h3>
          <div className="flex flex-col gap-3 text-[14px]">
            {data?.tasks.map(
              (task: { id: string; title: string; completed: boolean }) => (
                <Form
                  onChange={handleChange}
                  method="post"
                  className="flex items-start gap-[10px] "
                  key={task.id}>
                  <input type="hidden" name={task.id} value="false" />
                  <input type="hidden" name="action" value="update-task" />
                  <CustomCheckbox
                    className="mt-[3px]"
                    id={task.id}
                    checked={task.completed}
                    name={task.id}
                  />
                  <label className="cursor-pointer" htmlFor={task.id}>
                    {task.title}
                  </label>
                </Form>
              ),
            )}
          </div>
        </div>
        <div className="w-[60%]">
          <h3 className="mb-5 border-b-[1px] border-[#363636] pb-[6px] text-[14px] text-[#9F9F9F]">
            Récompenses
          </h3>
          <div className="flex w-[80%] flex-col gap-2 text-[14px]">
            <p>
              {data.xp} <span className="font-bold text-[#69D0F1]">XP</span>
            </p>
            <p>
              {data.gold} <span className="font-bold text-[#E4BC2F]">Gold</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-48 flex-col justify-between">
        <button
          onClick={() => {
            data.pinned = !data.pinned;
            console.log(data.pinned);
          }}
          className="flex h-fit w-fit items-center gap-2 self-end whitespace-nowrap rounded border border-[#363636] py-[10px] px-3 text-[14px] ">
          <img
            className="h-[18px] w-[18px]"
            src="/assets/icons/pin.svg"
            alt="pin icon"
          />
          {data.pinned ? "Pinned" : "Pin"}
        </button>
        <Form method="post">
          <input type="hidden" name="action" value="completed" />
          <PrimaryButton
            className=" text-[14px] font-bold"
            name="complete"
            type="submit">
            COMPLETE
          </PrimaryButton>
        </Form>
      </div>
    </div>
  );
}
