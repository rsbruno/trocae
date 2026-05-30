export function sortBy<T>(items: T[], key: keyof T, direction: "asc" | "desc" = "asc"): T[] {
  return [...items].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    switch (true) {
      case typeof valueA === "number" && typeof valueB === "number":
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      case typeof valueA === "string" && typeof valueB === "string":
        return direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      default:
        return 0;
    }
  });
}
