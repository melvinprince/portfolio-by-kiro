"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove parameters
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Navigate to the new URL
      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const getParam = useCallback(
    (key: string): string | undefined => {
      return searchParams.get(key) || undefined;
    },
    [searchParams]
  );

  const getParamAsNumber = useCallback(
    (key: string): number | undefined => {
      const value = searchParams.get(key);
      if (!value) return undefined;
      const num = parseInt(value, 10);
      return isNaN(num) ? undefined : num;
    },
    [searchParams]
  );

  const getAllParams = useCallback(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const clearParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    updateParams,
    getParam,
    getParamAsNumber,
    getAllParams,
    clearParams,
  };
}
