import type { MetaFunction, LoaderArgs, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18next from "@/i18next.server";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { isAfter } from "date-fns";
import { getUserSession, logout } from "@/session.server";

import styles from "./glossy/global.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  const userSession = await getUserSession(request);
  let isExpired;

  if (userSession) {
    console.info("userSession", "exist");
    const expires = new Date(userSession.exp * 1000);
    const now = new Date();
    isExpired = isAfter(now, expires);
    if (isExpired) return await logout(request);
  }

  return json({ locale, userSession, isExpired });
};

export const handle = {
  i18n: "common",
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(locale).then(() => {
      console.log("Language changed to", locale);
    });
  }, [locale, i18n]);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <title>LIAG</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#121212] text-slate-50 font-inter ">
        <div>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
