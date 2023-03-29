import { getProducts } from "@/api/get-products";
import { PrimaryButton } from "@/components/atoms/button";
import { DefaultPageLayout } from "@/components/templates/default-layout";
import { getUserSession } from "@/session.server";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  const req = await getProducts(userSession.token);
  return json(req);
};

export default function Shop() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div className=" w-full">
      <DefaultPageLayout title="Shop">
        <div className="max-w-[1280px]">
          <ul className="grid w-fit grid-flow-row grid-cols-4 gap-5 ">
            {data?.docs.map(
              (product: {
                id: string;
                name: string;
                image: { url: string; alt: string };
                price: number;
              }) => (
                <li
                  key={product.id}
                  className=" box-border flex h-80 w-64 flex-col gap-[10px] rounded border border-[#363636] p-5">
                  <div>
                    <div className="flex h-32 items-center justify-center rounded border bg-white">
                      <img
                        className=" w-24  overflow-hidden object-cover"
                        src={`http://localhost:3000${product.image.url}`}
                        alt={product.image.alt}
                      />
                    </div>
                  </div>
                  <div className="flex h-full flex-col justify-between">
                    <div className="underline">{product.name}</div>
                    <div className="flex flex-col">
                      <div>
                        {product.price}{" "}
                        <span className="font-bold text-[#E4BC2F]">Golds</span>
                      </div>
                      <div>
                        <PrimaryButton name={""} className={""}>
                          Buy
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
