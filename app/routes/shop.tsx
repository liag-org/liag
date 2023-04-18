import { getProducts } from "@/api/get-products";
import { DefaultPageLayout } from "@/components/templates/default-layout";
import { getUserSession } from "@/session.server";
import { useLoaderData, useMatches } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useState } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await getUserSession(request);
  if (!userSession) return redirect("/login");
  if (userSession) {
    try {
      const [productsResponse, classesResponse] = await Promise.all([
        getProducts(userSession.token),
        fetch("http://localhost:3000/api/classes"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${userSession.token}`,
          },
        },
      ]);
      const products = await productsResponse;
      const classes = await classesResponse.json();

      return json({ products, classes });
    } catch (error) {
      console.error(error);
      return json({ error: "Invalid credentials" }, { status: 401 });
    }
  }
  return json({ userSession });
};

export default function Shop() {
  const matches = useMatches();
  // data coming from the root loader function
  const data = matches.find(match => match.id === "root");
  const { userSession } = data?.data || {};
  const { classes, products } = useLoaderData();
  const [selectedClasse, setSelectedClasse] = useState("Tous");

  return (
    <div className=" w-full">
      <DefaultPageLayout title="Shop">
        <div className="mb-5">
          <ul className="flex gap-[10px]">
            {classes.docs.map((classe: { id: string; title: string }) => (
              <button
                onClick={() => setSelectedClasse(classe.title)}
                key={classe.id}
                className={`flex h-10 items-center justify-center rounded border border-[#363636] p-3 ${
                  classe.title === selectedClasse
                    ? "text-[#E4BC2F]"
                    : "text-[#7E7E7E]"
                }`}>
                {classe.title}
              </button>
            ))}
          </ul>
        </div>
        <div className="max-w-[1280px]">
          <ul className="grid h-[450px] w-fit grid-cols-4 grid-rows-2 gap-5 ">
            {products.docs
              .filter((product: { classe: { title: string } }) => {
                if (selectedClasse !== "Tous") {
                  return product.classe.title === selectedClasse;
                } else {
                  return product;
                }
              })
              .map(
                (
                  product: {
                    id: string;
                    name: string;
                    image: { url: string; alt: string };
                    price: number;
                    classe: string;
                    favorite: boolean;
                  },
                  index: number,
                ) => {
                  console.log(product);
                  return (
                    <li
                      key={index}
                      className={`relative w-[220px] rounded border border-[#363636] p-5 ${
                        index === 0 || index === 1
                          ? "col-span-1 row-span-2 "
                          : "col-span-1 row-span-1 "
                      }`}>
                      <div className="absolute right-4 top-4">
                        <img src="/assets/icons/fav.svg" alt="" />
                      </div>

                      <div>
                        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <img
                            className=" h-full w-32 overflow-hidden object-cover"
                            src={product.image.url}
                            alt={product.image.alt}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 w-full -translate-x-1/2 text-center">
                        <div className="underline">{product.name}</div>
                      </div>
                    </li>
                  );
                },
              )}
          </ul>
        </div>
      </DefaultPageLayout>
    </div>
  );
}
