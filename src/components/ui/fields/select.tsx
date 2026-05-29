import { type ComponentProps, type ReactNode, type UIEvent, useEffect, useState, useMemo, useRef } from "react";
import { CaretDown, X } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";

import type { Option } from "@/@types/option";

import { ForEach } from "@/components/utils/foreach";
import { useDebounce } from "@/hooks/use-debounce";
import { ShowIf } from "@/components/utils/show";

import { type FieldContainerProps, fieldInputClassName, FieldContainer } from "./container";
import { PopoverContent, PopoverTrigger, Popover } from "../popover";
import { TextFieldPrimitive } from "./text-field";
import { Typography } from "../typography";
const OPTION_HEIGHT = 44;
const selectInputClassName = twMerge(
  "h-full min-h-0 w-full flex-1",
  "rounded-none border-0 bg-transparent px-0 py-0 shadow-none",
  "focus:border-transparent focus:bg-transparent focus:ring-0"
);
type MessagesProps = {
  notFound?: string;
  loadingMore?: string;
};
type FallbackTextOptionProps = {
  placeholder: string;
  children?: ReactNode;
  className?: string;
};
function FallbackTextOption({ placeholder, className, children }: FallbackTextOptionProps) {
  const hasValue = Boolean(children);
  return (
    <Typography
      className={twMerge("flex min-h-0 flex-1 items-center text-left", className)}
      color={hasValue ? "base" : "muted"}
      as="span"
      size="sm"
    >
      {children ?? placeholder}
    </Typography>
  );
}
type SelectItemProps<TData, TOption extends Option<TData> = Option<TData>> = {
  onClick: (option: TOption | null) => void;
  active?: boolean;
  option: TOption;
  descriptionField?: keyof TData | "none";
} & Omit<ComponentProps<"li">, "onClick">;
function SelectItem<TData, TOption extends Option<TData> = Option<TData>>({
  descriptionField = "none",
  className,
  onClick,
  option,
  active,
  ...props
}: SelectItemProps<TData, TOption>) {
  const description = descriptionField !== "none" && option.data ? option.data[descriptionField] : undefined;
  return (
    <li {...props} aria-selected={active} role="option">
      <button
        className={twMerge(
          "flex w-full cursor-pointer flex-col justify-center gap-0.5 rounded-lg px-3 py-2 transition-colors duration-200",
          "data-[state=true]:bg-accent-primary/15 data-[state=false]:hover:bg-white/5",
          className
        )}
        onClick={() => onClick(option.value ? option : null)}
        data-state={active}
        type="button"
      >
        <Typography
          className="data-[state=true]:text-accent-primary data-[state=false]:text-ink cursor-pointer text-left"
          data-state={active}
          variant="medium"
          size="sm"
        >
          {option.label}
        </Typography>

        <ShowIf if={!!description}>
          <Typography
            className="data-[state=true]:text-accent-primary/80 data-[state=false]:text-ink-muted cursor-pointer text-left"
            data-state={active}
            size="xs"
          >
            {description as string}
          </Typography>
        </ShowIf>
      </button>
    </li>
  );
}
export type SelectFieldProps<TData, TOption extends Option<TData> = Option<TData>> = {
  options?: TOption[];
  value?: TOption | null;
  onChange?: (option: TOption | null) => void;
  onInputChange?: (value: string) => void;
  messages?: MessagesProps;
  searchable?: boolean;
  visible?: number;
  descriptionField?: keyof TData | "none";
  hasMore?: boolean;
  clearable?: boolean;
  isLoadingMore?: boolean;
  onReachEnd?: () => void;
  reachEndOffset?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
} & Omit<FieldContainerProps, "children">;
export function SelectFieldPrimitive<TData, TOption extends Option<TData> = Option<TData>>({
  descriptionField = "none",
  isLoadingMore = false,
  reachEndOffset = 24,
  searchable = true,
  clearable = true,
  hasMore = false,
  onInputChange,
  placeholder,
  visible = 5,
  onReachEnd,
  className,
  messages,
  onChange,
  disabled,
  options,
  error,
  value,
  name,
  id
}: SelectFieldProps<TData, TOption>) {
  const fieldRef = useRef<HTMLInputElement>(null);
  const reachEndTriggeredRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TOption | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const inputId = id ?? name;
  const hasError = Boolean(error);
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(disabled || !options ? false : nextOpen);
  };
  const closeSelect = () => setOpen(false);
  const handleDebouncedChange = useDebounce(setFilter, 250);
  const handlerOption = (
    option: TOption | null,
    args?: {
      preventDefault?: boolean;
    }
  ) => {
    if (args?.preventDefault !== true) {
      onChange?.(option);
    }
    setSelected(option);
    if (fieldRef.current && option !== null) {
      fieldRef.current.placeholder = option.label;
    } else if (fieldRef.current && option === null) {
      fieldRef.current.placeholder = placeholder ?? "";
    }
  };
  const onChangeSelectOption = (option: TOption | null) => {
    handlerOption(option);
    setFilter(null);
    closeSelect();
  };
  const onClear = (args?: { preventDefault?: boolean }) => {
    handlerOption(null, args);
    if (fieldRef.current) {
      fieldRef.current.placeholder = placeholder ?? "";
      fieldRef.current.value = "";
    }
    if (args?.preventDefault !== true) {
      fieldRef.current?.focus();
    }
    setFilter(null);
  };
  const filteredOptions = useMemo(() => {
    if (!options) return [];
    if (!filter?.trim().length) {
      return options;
    }
    return options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));
  }, [options, filter]);
  const handleOptionsScroll = (event: UIEvent<HTMLUListElement>) => {
    if (!onReachEnd || !hasMore || isLoadingMore) {
      return;
    }
    const element = event.currentTarget;
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    if (distanceToBottom <= reachEndOffset && !reachEndTriggeredRef.current) {
      reachEndTriggeredRef.current = true;
      onReachEnd();
    }
  };
  useEffect(() => {
    onInputChange?.(filter ?? "");
  }, [filter, onInputChange]);
  useEffect(() => {
    if (!isLoadingMore) {
      reachEndTriggeredRef.current = false;
    }
  }, [isLoadingMore, hasMore, filteredOptions.length]);
  useEffect(() => {
    if (value === null && fieldRef?.current?.value) {
      onClear({ preventDefault: true });
      return;
    }
    if (value !== null && value?.value === selected?.value) {
      return;
    }
    handlerOption(value ?? null, { preventDefault: true });
  }, [value]);
  return (
    <Popover onOpenChange={handleOpenChange} modal={false} open={open}>
      <PopoverTrigger
        render={(triggerProps) => (
          <div
            {...triggerProps}
            className={fieldInputClassName(
              hasError,
              twMerge(
                "flex min-h-0 w-full cursor-pointer items-center gap-0 pr-2",
                open && !hasError && "border-accent-primary/45 ring-accent-primary/12 bg-surface-alt ring-2",
                disabled && "cursor-not-allowed opacity-60",
                className
              )
            )}
            aria-haspopup="listbox"
            aria-expanded={open}
            id={inputId}
          >
            <ShowIf if={!searchable}>
              <FallbackTextOption placeholder={placeholder ?? "Selecione uma opção"}>{selected?.label}</FallbackTextOption>
            </ShowIf>

            <ShowIf if={searchable}>
              <TextFieldPrimitive
                className={twMerge(selectInputClassName, "cursor-pointer disabled:cursor-not-allowed")}
                onChange={(inputValue) => handleDebouncedChange(inputValue)}
                placeholder={placeholder ?? "Selecione uma opção"}
                value={filter ?? selected?.label ?? ""}
                disabled={disabled}
                ref={fieldRef}
                error={error}
                id={inputId}
                name={name}
              />
            </ShowIf>

            <ShowIf if={Boolean(selected) && clearable}>
              <button
                className={twMerge(
                  "text-ink-muted hover:text-accent-primary flex shrink-0 cursor-pointer rounded-md p-1 transition-colors duration-200",
                  disabled && "cursor-not-allowed"
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  onClear({ preventDefault: false });
                }}
                aria-label="Limpar seleção"
                tabIndex={-1}
                type="button"
              >
                <X weight="bold" size={16} />
              </button>
            </ShowIf>

            <button
              className={twMerge(
                "text-ink-muted hover:text-accent-primary flex shrink-0 cursor-pointer rounded-md p-1 transition-colors duration-200",
                disabled && "cursor-not-allowed"
              )}
              onClick={(event) => {
                event.stopPropagation();
                handleOpenChange(!open);
              }}
              aria-label={open ? "Fechar opções" : "Abrir opções"}
              tabIndex={-1}
              type="button"
            >
              <CaretDown
                className={twMerge("transition-transform duration-200", open ? "rotate-180" : "")}
                weight="bold"
                size={16}
              />
            </button>
          </div>
        )}
        nativeButton={false}
        disabled={disabled}
      />

      <PopoverContent initialFocus={false} sideOffset={4} align="start">
        <ul
          className="inline-flex w-full flex-col gap-0.5 overflow-y-auto"
          style={{ maxHeight: OPTION_HEIGHT * visible }}
          onScroll={handleOptionsScroll}
          role="listbox"
        >
          <ShowIf if={!filteredOptions.length}>
            <li className="flex h-10 w-full items-center rounded-lg px-3 py-1" role="option">
              <Typography color="muted" size="sm">
                {messages?.notFound || "Nenhuma opção encontrada!"}
              </Typography>
            </li>
          </ShowIf>

          <ShowIf if={Boolean(filteredOptions.length)}>
            <ForEach items={filteredOptions}>
              {(option) => (
                <SelectItem
                  active={selected?.value === option.value}
                  descriptionField={descriptionField}
                  onClick={onChangeSelectOption}
                  key={option.value}
                  option={option}
                />
              )}
            </ForEach>
          </ShowIf>

          <ShowIf if={Boolean(filteredOptions.length) && isLoadingMore}>
            <li className="flex h-10 w-full items-center rounded-lg px-3 py-1" role="option" aria-disabled>
              <Typography color="muted" size="sm">
                {messages?.loadingMore || "Carregando mais opções..."}
              </Typography>
            </li>
          </ShowIf>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
export function SelectField<TData, TOption extends Option<TData> = Option<TData>>({
  className,
  error,
  label,
  name,
  id,
  ...props
}: SelectFieldProps<TData, TOption>) {
  return (
    <FieldContainer className={className} label={label} error={error} name={name} id={id}>
      <SelectFieldPrimitive {...props} error={error} label={label} name={name} id={id} />
    </FieldContainer>
  );
}
