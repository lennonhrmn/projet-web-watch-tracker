import React, { useState, PropsWithChildren } from "react";

interface InputProps {
  id: string;
  onChange: any;
  value: string;
  label: string;
  type?: string;
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  id,
  onChange,
  value,
  label,
  type = "text",
  children
}) => {
  const [inputHasValue, setInputHasValue] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputHasValue(event.target.value !== "");
    onChange(event);
  };

  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        type={type}
        onChange={handleInputChange}
        className="
          block
          rounded-md
          px-2
          pt-1
          pb-1
          w-full
          text-md
          text-white
          bg-neutral-700
          apparence-none
          focus:outline-none
          focus:ring-0
        "
        placeholder=" "
      />
      <label
        className={`
          absolute
          text-md
          text-zinc-400
          duration-150
          origin-[0]
          left-6
          ${inputHasValue ? "top-1 text-sm" : "top-1"}
          ${inputHasValue ? "text-zinc-400" : "text-gray-400"}
          ${inputHasValue ? "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100" : ""}
          ${inputHasValue ? "peer-focus:translate-y-0 peer-focus:scale-100" : ""}
          transition-all
          pointer-events-none
          transform
          -translate-y-0
        `}
        htmlFor={id}
      >
        {label}
      </label>
      {children && ( 
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default Input;
