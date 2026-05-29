import { type RegisterOptions, type FieldValues, useController, type Control, type Path } from "react-hook-form";

import { type SearchInputProps, SearchInput } from "../search-input";

interface SearchInputControlledProps<TFieldValues extends FieldValues, Name extends Path<TFieldValues>> extends Omit<
  SearchInputProps,
  "name" | "value" | "onChange"
> {
  rules?: RegisterOptions<TFieldValues, Name>;
  control: Control<TFieldValues>;
  showError?: boolean;
  name: Name;
}

export function SearchInputControlled<TFieldValues extends FieldValues, Name extends Path<TFieldValues>>({
  showError = true,
  control,
  rules,
  name,
  ...props
}: SearchInputControlledProps<TFieldValues, Name>) {
  const {
    field: { name: fieldName, onChange, value },
    fieldState: { error }
  } = useController<TFieldValues, Name>({
    control,
    rules,
    name
  });

  return (
    <SearchInput {...props} error={showError ? error?.message : undefined} onChange={onChange} name={fieldName} value={value} />
  );
}
