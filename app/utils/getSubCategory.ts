import { subCategoryRules } from "@/app/data/subCategoryRules";

export function getSubCategory(title: string): string {
  const t = title.toLowerCase();

  for (const sub in subCategoryRules) {
    if (subCategoryRules[sub].some((k) => t.includes(k))) {
      return sub;
    }
  }

  return "all-accessories";
}
