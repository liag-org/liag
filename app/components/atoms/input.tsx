import { useRef, useState, useEffect } from "react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  unit?: string;
  unitClass?: string;
}

export const PrimaryInput = ({
  type,
  required,
  name,
  placeholder,
  onChange,
  value,
  disabled,
  unit,
  unitClass,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        autoComplete="off"
        type={type}
        required={required}
        ref={ref}
        name={name}
        id={name}
        className="h-10 w-full rounded border border-[#363636] bg-[#1E1E1E] p-2.5 text-[14px] text-slate-50 placeholder:text-[#9F9F9F] focus:outline-none"
        placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        value={value}
        disabled={disabled}
      />
      <span className={unitClass}>{unit}</span>
    </div>
  );
};

export const SecondaryInput = ({
  type,
  required,
  name,
  placeholder,
  onChange,
  value,
  disabled,
}: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <input
      autoComplete="off"
      type={type}
      required={required}
      ref={ref}
      name={name}
      id={name}
      className="w-fill h-10 rounded border-none bg-transparent p-2.5 text-[14px] text-slate-50 placeholder:text-[#4D4D4D] focus:outline-none"
      placeholder={placeholder}
      onChange={e => onChange?.(e.target.value)}
      value={value}
      disabled={disabled}
    />
  );
};

export const TextAreaInput = ({
  required,
  name,
  placeholder,
  value,
  disabled,
}: Props) => {
  const [height, setHeight] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleChangeTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.scrollHeight < 54 || e.target.value.trim() === "") {
      setHeight("40");
    } else {
      const scHeight = e.target.scrollHeight;
      setHeight(scHeight.toString());
    }
  }

  useEffect(() => {
    if (!ref.current) return;
    const textareaForStyle = ref.current;
    textareaForStyle.style.height = `${height}px`;
  }, [height]);

  return (
    <textarea
      autoComplete="off"
      required={required}
      ref={ref}
      name={name}
      id={name}
      className="w-fill h-10 resize-none overflow-hidden rounded border border-[#363636] bg-[#1E1E1E] p-2.5 text-[14px] text-slate-50 placeholder:text-[#9F9F9F] focus:outline-none"
      placeholder={placeholder}
      onChange={handleChangeTextarea}
      value={value}
      disabled={disabled}
    />
  );
};
