import { NavLink } from "@remix-run/react";

interface Props {
  to: string;
  children: React.ReactNode;
}

export default function NavItem({ to, children }: Props) {
  return (
    <div>
      <NavLink
        className="flex h-12 items-center p-3 hover:bg-[#363636]"
        to={to}>
        {children}
      </NavLink>
    </div>
  );
}
