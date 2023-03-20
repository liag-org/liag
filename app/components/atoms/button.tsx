interface Props {
  name: string;
  type?: "button" | "submit" | "reset" | undefined;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const PrimaryButton = ({
  className,
  name,
  type,
  children,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 min-w-[80px] rounded bg-gradient-to-r from-[#7369F1] to-[#a869f1] px-3 ${className}`}
      type={type}>
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  className,
  name,
  type,
  onClick,
  disabled,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${className}`}
      type={type}>
      {name}
    </button>
  );
};
