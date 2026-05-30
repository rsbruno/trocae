import { type ReactNode, useEffect, useRef } from "react";

import { ShowIf } from "./show";

type InfiniteScrollProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  isLoading?: boolean;
  fallback?: ReactNode;
  children?: ReactNode;
};

export function InfiniteScroll({
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  isLoading,
  fallback,
  children
}: InfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage || isLoading) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void fetchNextPage();
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  return (
    <>
      {children}
      <ShowIf if={hasNextPage}>
        <div className="h-px w-full shrink-0 opacity-0" ref={loadMoreRef} aria-hidden />
      </ShowIf>
    </>
  );
}
