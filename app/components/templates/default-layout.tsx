interface Props {
  title: string;
  children: React.ReactNode;
  buttonChildren?: React.ReactNode;
}

export const DefaultPageLayout = ({
  title,
  children,
  buttonChildren,
}: Props) => {
  return (
    <section className="flex h-full w-full flex-col gap-8 p-16">
      <div className="flex gap-8">
        <h2 className="text-[24px]">{title}</h2>
        {buttonChildren}
      </div>
      <div className="h-full w-full">{children}</div>
    </section>
  );
};
