import { DefaultPageLayout } from "@/components/templates/default-layout";
import { getUserSession } from "@/session.server";
import { Form, useMatches } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

export const action = async ({ request }: ActionArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const body = await request.formData();
  const formEntries = Object.fromEntries(body.entries());
  const id = formEntries.id;
  console.log("formEntries", formEntries);

  const updateProfileId = Object.keys(formEntries)[1];
  const updatedProfile = formEntries[updateProfileId];
  console.log("updatedName", updatedProfile);

  try {
    const req = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${userSession.token}`,
      },
      body: JSON.stringify({
        ...formEntries,
        formEntries: updatedProfile,
      }),
    });
    return json({ status: "success" });
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
};

export default function Character() {
  const matches = useMatches();
  const data = matches.find(match => match.id === "root");
  const { user } = data?.data || {};

  return (
    <div>
      <DefaultPageLayout title={"Character"}>
        <div className="flex flex-col gap-10">
          <h1>{user.firstName} </h1>
          <Form
            method="post"
            className="flex w-80 flex-col justify-start gap-5">
            <input type="hidden" name="id" value={user.id} />
            <input
              className="rounded-md border border-gray-300 px-4 py-2 text-[#333]"
              type="text"
              name="firstName"
              defaultValue={user.firstName}
            />
            <input
              className="rounded-md border border-gray-300 px-4 py-2 text-[#333]"
              type="text"
              name="lastName"
              defaultValue={user.lastName}
            />
            <input
              className="rounded-md border border-gray-300 px-4 py-2 text-[#333]"
              type="text"
              name="email"
              defaultValue={user.email}
            />

            <button type="submit">Update</button>
          </Form>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
