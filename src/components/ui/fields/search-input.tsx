import { type InputHTMLAttributes, type ChangeEvent, forwardRef, useEffect, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

import { type FieldContainerProps, fieldInputClassName, FieldContainer } from "./container";

const hideSearchClearClassName =
  "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden";

export type SearchInputProps = Omit<FieldContainerProps, "children"> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name" | "type"> & {
    name: string;
    onChange?: (text: string) => void;
    value?: string | number | null;
    clearable?: boolean;
  };

export const SearchInputPrimitive = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ clearable = true, className, onChange, value, error, name, id, ...props }, ref) => {
    const [text, setText] = useState("");
    const inputId = id ?? name;
    const hasError = Boolean(error);

    function onChangeText(e: ChangeEvent<HTMLInputElement>) {
      const next = e.target.value;
      onChange?.(next);
      setText(next);
    }

    useEffect(() => {
      if (value === undefined) return;

      if (value == null) {
        setText("");
        return;
      }

      const nextText = String(value);

      if (nextText !== text) setText(nextText);
    }, [value, text]);

    return (
      <input
        {...props}
        className={fieldInputClassName(hasError, twMerge("pl-10", !clearable && hideSearchClearClassName, className))}
        aria-describedby={error ? `${inputId}-error` : undefined}
        autoComplete={props.autoComplete ?? "off"}
        aria-invalid={hasError || undefined}
        onChange={onChangeText}
        type="search"
        id={inputId}
        value={text}
        name={name}
        ref={ref}
      />
    );
  }
);

SearchInputPrimitive.displayName = "SearchInputPrimitive";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, clearable, error, label, name, id, ...props }, ref) => {
    return (
      <FieldContainer label={label} error={error} name={name} id={id}>
        <div className="relative flex w-full items-center">
          <MagnifyingGlass
            className="text-ink-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            weight="regular"
            size={16}
          />
          <SearchInputPrimitive
            className={twMerge("w-full", className)}
            clearable={clearable}
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

SearchInput.displayName = "SearchInput";
