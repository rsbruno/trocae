import { type ReactNode, Fragment } from "react";

import { ShowIf } from "./show";

export interface ForEachProps<T> {
  children: (item: T, props?: { index?: number; isLast?: boolean }) => ReactNode;
  lastComponent?: ReactNode;
  fallbackRepeat?: number;
  items: T[] | undefined;
  fallBack?: ReactNode;
  isLoading?: boolean;
  limit?: number;
}

export const ForEach = <T,>({
  fallbackRepeat = 1,
  lastComponent,
  isLoading,
  children,
  fallBack,
  items,
  limit
}: ForEachProps<T>) => {
  if (isLoading) return Array.from(Array(fallbackRepeat)).map((index) => <Fragment key={index}>{fallBack}</Fragment>);
  if (!items?.length && !isLoading) return null;
  const limitedItems = limit ? items?.slice(0, limit) : items;
  return (
    <>
      {limitedItems?.map((item, index) => (
        <Fragment key={index}>{children(item, { isLast: limitedItems.length - 1 === index, index })}</Fragment>
      ))}
      <ShowIf if={!!limit && (items?.length ?? 0) > limit && !!lastComponent}>{lastComponent}</ShowIf>
    </>
  );
};
