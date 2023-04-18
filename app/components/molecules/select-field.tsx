import { CustomSelect } from "@/atoms/select";
import { Label } from "@/atoms/label";

interface Props {
  label: string;
  name: string;
  className?: string;
  placeholder?: string;
  options: { title: string; id: string }[];
}

export const SelectField = ({
  label,
  name,
  className,
  placeholder,
  options,
}: Props) => {
  return (
    <div className={`flex max-w-[360px] flex-col gap-2 ${className}`}>
      <Label label={label} htmlFor={name} />
      <CustomSelect placeholder={placeholder} name={name} options={options} />
    </div>
  );
};
