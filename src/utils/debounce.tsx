import { useCallback, useRef } from "react";

export function useDebounce(callback: Function, delay: number) {
  const timeoutRef = useRef<any>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
