import { type RegisterOptions, type FieldValues, useController, type Control, type Path } from "react-hook-form";

import type { Option } from "@/@types/option";

import { type SelectFieldProps, SelectField } from "../select";

interface SelectFieldControlledProps<
  TFieldValues extends FieldValues,
  Name extends Path<TFieldValues>,
  TData = unknown,
  TOption extends Option<TData> = Option<TData>
> extends Omit<SelectFieldProps<TData, TOption>, "name" | "value" | "onChange"> {
  rules?: RegisterOptions<TFieldValues, Name>;
  control: Control<TFieldValues>;
  showError?: boolean;
  name: Name;
}

export function SelectFieldControlled<
  TFieldValues extends FieldValues,
  Name extends Path<TFieldValues>,
  TData = unknown,
  TOption extends Option<TData> = Option<TData>
>({ showError = true, control, rules, name, ...props }: SelectFieldControlledProps<TFieldValues, Name, TData, TOption>) {
  const {
    field: { name: fieldName, onChange, value },
    fieldState: { error }
  } = useController<TFieldValues, Name>({
    control,
    rules,
    name
  });

  return (
    <SelectField {...props} error={showError ? error?.message : undefined} onChange={onChange} name={fieldName} value={value} />
  );
}
