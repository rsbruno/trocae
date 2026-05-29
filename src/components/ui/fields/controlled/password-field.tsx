import { type RegisterOptions, type FieldValues, useController, type Control, type Path } from "react-hook-form";

import { type PasswordFieldProps, PasswordField } from "../password-field";

interface PasswordFieldControlledProps<TFieldValues extends FieldValues, Name extends Path<TFieldValues>> extends Omit<
  PasswordFieldProps,
  "name"
> {
  rules?: RegisterOptions<TFieldValues, Name>;
  control: Control<TFieldValues>;
  showError?: boolean;
  name: Name;
}

export function PasswordFieldControlled<TFieldValues extends FieldValues, Name extends Path<TFieldValues>>({
  showError = true,
  control,
  rules,
  name,
  ...props
}: PasswordFieldControlledProps<TFieldValues, Name>) {
  const {
    field: { name: fieldName, onChange, value },
    fieldState: { error }
  } = useController<TFieldValues, Name>({
    control,
    rules,
    name
  });

  return (
    <PasswordField {...props} error={showError ? error?.message : undefined} onChange={onChange} name={fieldName} value={value} />
  );
}
