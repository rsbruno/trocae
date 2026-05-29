import { type RegisterOptions, type FieldValues, useController, type Control, type Path } from "react-hook-form";

import { type TextFieldProps, TextField } from "../text-field";

interface TextFieldControlledProps<TFieldValues extends FieldValues, Name extends Path<TFieldValues>> extends Omit<
  TextFieldProps,
  "name"
> {
  rules?: RegisterOptions<TFieldValues, Name>;
  control: Control<TFieldValues>;
  showError?: boolean;
  name: Name;
}

export function TextFieldControlled<TFieldValues extends FieldValues, Name extends Path<TFieldValues>>({
  showError = true,
  control,
  rules,
  name,
  ...props
}: TextFieldControlledProps<TFieldValues, Name>) {
  const {
    field: { name: fieldName, onChange, value },
    fieldState: { error }
  } = useController<TFieldValues, Name>({
    control,
    rules,
    name
  });

  return (
    <TextField {...props} error={showError ? error?.message : undefined} onChange={onChange} name={fieldName} value={value} />
  );
}
