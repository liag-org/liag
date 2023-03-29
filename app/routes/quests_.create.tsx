import { Form, Link } from "@remix-run/react";
import type { ActionArgs, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json, useActionData } from "react-router";
import { getUserSession } from "@/session.server";
import { PrimaryButton, SecondaryButton } from "@/components/atoms/button";
import {
  PrimaryInputField,
  SecondaryInputField,
  TextAreaInputField,
} from "@/components/molecules/input-field";
import { SelectField } from "@/components/molecules/select-field";
import { useState } from "react";
import { DefaultPageLayout } from "@/components/templates/default-layout";
import getEnv from "@/utils/get-env";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");

  const body = await request.formData();
  const formEntries = Object.fromEntries(body.entries());
  const parsedTasks = JSON.parse(formEntries.tasks as string);
  const env = getEnv();
  try {
    const req = await fetch(`${env.API_URL}/api/quests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${userSession.token}`,
      },
      body: JSON.stringify({
        ...formEntries,
        tasks: parsedTasks,
        category: formEntries.category,
        owner: userSession.user.id,
      }),
    });
    return redirect("/quests");
  } catch (error) {
    console.error("---> Error on create quest", error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
};

export const loader = async ({ request }: { request: Request }) => {
  const userSession = await getUserSession(request);
  const env = getEnv();
  if (!userSession) return redirect("/login");
  try {
    const req = await fetch(`${env.API_URL}/api/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${userSession.token}`,
      },
    });
    return json({ userSession, categories: await req.json() });
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
};

export default function CreateQuest() {
  const [task, setTask] = useState<{ title: string; completed: boolean }>({
    title: "",
    completed: false,
  });
  const [tasks, setSubTasks] = useState<
    { title: string; completed: boolean }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  return (
    <div className="w-full">
      <DefaultPageLayout title={"Create new quest"}>
        <Form
          method={"post"}
          className=" flex h-fit w-[400px] flex-col gap-5 rounded border border-[#363636] p-5">
          <h2 className="text-[24px]">New quest</h2>
          <PrimaryInputField
            label="Title"
            type="text"
            name="title"
            placeholder="Title of the quest..."
          />
          <SelectField
            name="category"
            label="Category"
            placeholder="Select a category"
          />
          <input type="hidden" name="tasks" value={JSON.stringify(tasks)} />
          <div className="flex max-w-[360px] items-center justify-between">
            <div className="flex">
              <img src="/assets/icons/flag.svg" alt="" />
              <SecondaryInputField
                value={newTask}
                label=""
                name=""
                placeholder="Add new tasks"
                onChange={(e: string) => {
                  setTask({ title: e, completed: false });
                  setNewTask(e);
                }}
              />
            </div>
            <SecondaryButton
              className="flex h-10 items-center text-[14px]"
              name="Add task"
              disabled={newTask === ""}
              onClick={() => {
                setSubTasks([...tasks, task]);
                setTask({ title: "", completed: false });
                setNewTask("");
              }}
            />
          </div>
          <div
            className="
          flex flex-col gap-3
          ">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-3 text-[14px]">
                {task.title}
                <img
                  className="h-[14px] w-[14px] cursor-pointer"
                  src="/assets/icons/close.svg"
                  alt="close icon"
                  onClick={() => {
                    setSubTasks(tasks.filter((_, i) => i !== index));
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-5">
            <PrimaryInputField
              className="w-full"
              type="number"
              name="golds"
              label="Golds Earned"
              placeholder="0"
              unit="Golds"
            />
            <PrimaryInputField
              className="w-full"
              type="number"
              name="xp"
              label="Xp Earned"
              placeholder="0"
              unit="Xp"
            />
          </div>
          <TextAreaInputField
            label="Description"
            placeholder="Add a description..."
            name="description"
          />
          <PrimaryButton
            className=""
            type="submit"
            name="create"
            onClick={() => {
              <div>
                <h1>Success</h1>
              </div>;
            }}>
            CREATE
          </PrimaryButton>
        </Form>
      </DefaultPageLayout>
    </div>
  );
}
