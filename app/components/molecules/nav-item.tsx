import { Link, NavLink } from "@remix-run/react";

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavItem({ to, children, className }: Props) {
  const activeClassName =
    "flex h-14 items-center p-3 bg-gradient-to-r from-[#7369F1] to-[#9747FF]";
  const inactiveClassName = "flex h-14 items-center p-3 hover:bg-[#222222]";
  return (
    <div>
      <NavLink
        className={({ isActive }) =>
          `${isActive ? activeClassName : inactiveClassName} ${className}`
        }
        to={to}>
        {children}
      </NavLink>
    </div>
  );
}
