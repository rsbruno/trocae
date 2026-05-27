import { cnMerge } from "tailwind-variants";

export function twMerge(...classes: Parameters<typeof cnMerge>) {
  return cnMerge(...classes)();
}
