import { NavLink } from "@remix-run/react";

interface Props {
  to: string;
  children: React.ReactNode;
}

export default function NavItem({ to, children }: Props) {
  const activeClassName =
    "flex h-12 items-center p-3 bg-gradient-to-r from-[#7369F1] to-[#9747FF]";
  const inactiveClassName = "flex h-12 items-center p-3 hover:bg-[#222222]";
  return (
    <div>
      <NavLink
        className={({ isActive }) =>
          isActive ? activeClassName : inactiveClassName
        }
        to={to}>
        {children}
      </NavLink>
    </div>
  );
}
