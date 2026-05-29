import { type InputHTMLAttributes, type ChangeEvent, forwardRef, useState, Fragment } from "react";
import { EyeSlashIcon, EyeIcon } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

import { ShowIf } from "@/components/utils/show";

import { type FieldContainerProps, fieldInputClassName, FieldContainer } from "./container";
export type PasswordFieldProps = Omit<FieldContainerProps, "children"> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name" | "type"> & {
    name: string;
    onChange?: (password: string) => void;
  };
export const PasswordFieldPrimitive = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ defaultValue, className, onChange, value, error, name, id, ...props }, ref) => {
    const [internal, setInternal] = useState(() => (defaultValue != null ? String(defaultValue) : ""));
    const [visible, setVisible] = useState(false);
    const inputId = id ?? name;
    const hasError = Boolean(error);
    const inputValue = value !== undefined ? value : internal;
    function onChangePassword(e: ChangeEvent<HTMLInputElement>) {
      const next = e.target.value;
      if (value === undefined) setInternal(next);
      onChange?.(next);
    }
    return (
      <Fragment>
        <input
          {...props}
          className={fieldInputClassName(hasError, twMerge("pr-12", className))}
          aria-describedby={error ? `${inputId}-error` : undefined}
          type={visible ? "text" : "password"}
          aria-invalid={hasError || undefined}
          onChange={onChangePassword}
          value={inputValue}
          id={inputId}
          name={name}
          ref={ref}
        />

        <button
          className="text-ink-muted hover:text-accent-primary absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer rounded-md p-1 transition-colors duration-200 active:scale-95"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          tabIndex={-1}
          type="button"
        >
          <ShowIf if={visible}>
            <EyeSlashIcon weight="regular" size={18} />
          </ShowIf>
          <ShowIf if={!visible}>
            <EyeIcon weight="regular" size={18} />
          </ShowIf>
        </button>
      </Fragment>
    );
  }
);

PasswordFieldPrimitive.displayName = "PasswordFieldPrimitive";

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, loading, error, label, name, id, ...props }, ref) => {
    return (
      <FieldContainer loading={loading} label={label} error={error} name={name} id={id}>
        <PasswordFieldPrimitive className={className} error={error} label={label} name={name} ref={ref} id={id} {...props} />
      </FieldContainer>
    );
  }
);

PasswordField.displayName = "PasswordField";
