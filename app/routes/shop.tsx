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
      <DefaultPageLayout title={"Shop"}>
        <div className="">
          <ul className="grid w-full grid-cols-4 grid-rows-4">
            {data?.docs.map(
              (product: {
                id: string;
                name: string;
                image: { url: string; alt: string };
                price: number;
              }) => (
                <li key={product.id} className="flex flex-col items-center">
                  <div className="flex h-[200px] items-center bg-white">
                    <img
                      className="h-full w-full overflow-hidden object-cover"
                      src={`http://localhost:3000${product.image.url}`}
                      alt={product.image.alt}
                    />
                  </div>
                  <div>{product.name}</div>
                  <div>{product.price}</div>
                  <PrimaryButton name={""} className={""}>
                    BUY
                  </PrimaryButton>
                </li>
              ),
            )}
          </ul>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
