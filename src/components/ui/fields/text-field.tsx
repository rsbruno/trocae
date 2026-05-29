import { type InputHTMLAttributes, type ChangeEvent, forwardRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { ShowIf } from "@/components/utils/show";

import { type FieldContainerProps, fieldInputClassName, FieldContainer } from "./container";
export type TextFieldProps = Omit<FieldContainerProps, "children"> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name"> & {
    name: string;
    onChange?: (text: string) => void;
    mask?: (value: string | number) => string;
    unmask?: (value: string) => string;
    value?: string | number | null;
    prefix?: string;
  };
export const TextFieldPrimitive = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ type = "text", className, onChange, unmask, value, error, mask, name, id, ...props }, ref) => {
    const [text, setText] = useState("");
    const inputId = id ?? name;
    const hasError = Boolean(error);
    function onChangeText(e: ChangeEvent<HTMLInputElement>) {
      const next = mask ? mask(e.target.value) : e.target.value;
      onChange?.(unmask ? unmask(next) : next);
      setText(next);
    }
    useEffect(() => {
      if (value === undefined) return;
      if (value == null) {
        setText("");
        return;
      }
      const nextText = mask ? mask(value) : String(value);
      if (nextText !== text) setText(nextText);
    }, [value, mask, text]);
    return (
      <input
        {...props}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={fieldInputClassName(hasError, className)}
        autoComplete={props.autoComplete ?? "off"}
        aria-invalid={hasError || undefined}
        onChange={onChangeText}
        id={inputId}
        value={text}
        name={name}
        type={type}
        ref={ref}
      />
    );
  }
);
TextFieldPrimitive.displayName = "TextFieldPrimitive";
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, prefix, error, label, name, id, ...props }, ref) => {
    return (
      <FieldContainer label={label} error={error} name={name} id={id}>
        <div className={twMerge("flex w-full items-center", prefix && "gap-2")}>
          <ShowIf if={Boolean(prefix)}>
            <span className="text-ink-secondary shrink-0 pl-1 text-sm select-none">{prefix}</span>
          </ShowIf>
          <TextFieldPrimitive
            className={twMerge(prefix && "flex-1", className)}
            error={error}
            label={label}
            name={name}
            ref={ref}
            id={id}
            {...props}
          />
        </div>
      </FieldContainer>
    );
  }
);
TextField.displayName = "TextField";
