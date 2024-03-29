import * as Checkbox from "@radix-ui/react-checkbox";

interface Props {
  name: string;
  checked: boolean;
  id: string;
  className?: string;
}

export const CustomCheckbox = ({ name, checked, id, className }: Props) => {
  return (
    <Checkbox.Root
      defaultChecked={checked}
      value={"on"}
      name={name}
      className={`flex h-[16px] w-[16px] items-center justify-center rounded border border-[#363636] bg-transparent ${className}`}
      id={id}>
      <Checkbox.Indicator className="flex h-full w-full items-center justify-center bg-[#363636]">
        <img
          className="h-[10px] w-[10px]"
          src="/assets/icons/checked.svg"
          alt="checked icon"
        />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};
