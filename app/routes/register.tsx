import type { ActionArgs } from "@remix-run/server-runtime";
import { Link, Form } from "@remix-run/react";
import { PrimaryInputField } from "@/components/molecules/input-field";
import { redirect } from "@remix-run/server-runtime";
import { CustomCheckbox } from "@/components/atoms/checkbox";

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const formData = Object.fromEntries(body.entries());
  try {
    const req = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    });
    return redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

export default function Register() {
  return (
    <section className="flex h-screen">
      <div className="flex w-1/2 items-center justify-center bg-[#121212] p-16">
        <img
          className="h-full w-full overflow-hidden object-cover"
          src="/assets/images/liag-dark.png"
          alt="dark background"
        />
      </div>
      <div className=" flex w-1/2 flex-col items-center justify-center gap-12 bg-[#171717]">
        <h1 className="text-[24px] font-bold tracking-[0.225em] text-[#7369F1]">
          LIAG
        </h1>
        <Form method={"post"} className="mx-auto flex w-[360px] flex-col gap-8">
          <div className="flex flex-row gap-6">
            <PrimaryInputField
              placeholder="John"
              className="w-[168px]"
              label={"First name"}
              name={"firstName"}
            />
            <PrimaryInputField
              placeholder="Do"
              className="w-[168px]"
              label={"Last name"}
              name={"lastName"}
            />
          </div>
          <PrimaryInputField
            placeholder="adress@mail.com"
            label={"Email"}
            name={"email"}
            type={"email"}
          />
          <PrimaryInputField
            placeholder="**********"
            label={"Password"}
            name={"password"}
            type={"password"}
          />
          <div className="flex gap-2">
            <CustomCheckbox id="check-box" name={""} checked={false} />
            <label
              htmlFor="check-box"
              className="w-5/6 text-[10px] font-normal text-[#9F9F9F]">
              Creating an account means you’re okay with our{" "}
              <span className="text-[#7369F1]">
                Terms of Service, Privacy Policy
              </span>
              , and our default
              <span className="text-[#7369F1]"> Notification Settings.</span>
            </label>
          </div>
          <button
            className=" h-10 rounded bg-[#7369F1] text-[14px] font-semibold text-slate-50 hover:bg-[#554dc8]"
            type={"submit"}>
            Create account
          </button>
        </Form>
        <div className="flex gap-1">
          <h3 className="text-[14px] text-[#9F9F9F]">Already member?</h3>
          <Link className="text-[14px] text-[#7369F1]" to={"/login"}>
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
