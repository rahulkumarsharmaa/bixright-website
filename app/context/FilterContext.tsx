"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type SelectedFilters = Record<string, Array<string | number>>;

type FilterContextType = {
  filterString: string;
  createSelectedObject: (key: string, values: Array<string | number>) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [filterString, setFilterString] = useState<string>("");

  const createSelectedObject = (
    key: string,
    values: Array<string | number>
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: values,
    }));
  };

  // When selectedFilters changes, rebuild filterString
  useEffect(() => {
    const queryParts: string[] = [];

    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        const isSpecialKey = ["minPrice", "maxPrice", "page", "limit", "sort"].includes(key);
        queryParts.push(
          `${key}${isSpecialKey ? "" : "Id"}=${values.join(",")}`
        );
      }
    });
    const finalString = queryParts.length > 0 ? `&${queryParts.join("&")}` : "";
    setTimeout(() => {
      setFilterString(finalString);
    }, 0);
  }, [selectedFilters]);
  // console.log(filterString, "filterString"  );
  return (
    <FilterContext.Provider
      value={{
        filterString,
        createSelectedObject,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used inside FilterProvider");
  return ctx;
};
