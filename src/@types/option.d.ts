export type Option<TData = unknown> = {
  label: string;
  value: string;
  data?: TData;
};

export type Options<TData = unknown> = Option<TData>[];
