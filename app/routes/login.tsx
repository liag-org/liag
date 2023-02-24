import type { ActionArgs } from "@remix-run/server-runtime";
import { Link, Form } from "@remix-run/react";
import { json } from "@remix-run/node";
import { FormField } from "@/components/molecules/form-field";
import { createUserSession } from "@/session.server";
import { CustomCheckbox } from "@/components/atoms/checkbox";

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const formData = Object.fromEntries(body.entries());
  try {
    const req = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    });
    const data = await req.json();
    if (data.errors) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    } else {
      return createUserSession({ request, data });
    }
  } catch (error) {
    return json({ error: "Invalid credentials" }, { status: 401 });
  }
};

export default function Login() {
  return (
    <section className="flex h-screen">
      <div className=" flex w-1/2 flex-col items-center justify-center gap-12 bg-[#171717]">
        <h1 className="text-[24px] font-bold tracking-[0.225em] text-[#7369F1]">
          LIAG
        </h1>
        <Form method={"post"} className="mx-auto flex w-[360px] flex-col gap-8">
          <FormField
            placeholder="adress@mail.com"
            label={"Email"}
            name={"email"}
            type={"email"}
          />
          <FormField
            placeholder="**********"
            label={"Password"}
            name={"password"}
            type={"password"}
          />
          <div className="flex gap-2">
            <CustomCheckbox />
            <p className="w-5/6 text-[12px] font-normal text-[#9F9F9F]">
              Stay connected
            </p>
          </div>
          <button
            className=" text-14 h-10 rounded bg-[#7369F1] font-semibold text-slate-50 hover:bg-[#554dc8]"
            type={"submit"}>
            Connection
          </button>
        </Form>
        <div className="flex gap-1">
          <h3 className="text-12 text-[#9F9F9F]">Forget password?</h3>
          <Link className="text-12 text-[#7369F1]" to={"/register"}>
            Click here
          </Link>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center bg-[#121212] p-16">
        <img
          className="h-full w-full overflow-hidden object-cover"
          src="/assets/images/liag-light.png"
          alt="dark background"
        />
      </div>
    </section>
  );
}
