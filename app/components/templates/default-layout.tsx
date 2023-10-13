import Navbar from "../organisms/navigation";

interface Props {
  title: string;
  children: React.ReactNode;
  buttonChildren?: React.ReactNode;
  className?: string;
}

export const DefaultPageLayout = ({
  title,
  children,
  buttonChildren,
  className,
}: Props) => {
  return (
    <section className="flex h-screen">
      <Navbar />
      <div className="flex h-full w-full flex-col gap-8 p-16">
        <div className="flex gap-8">
          <h2 className="h-11 text-[24px]">{title}</h2>
          {buttonChildren}
        </div>
        <div className={`h-full w-full ${className}`}>{children}</div>
      </div>
    </section>
  );
};
