import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string; sub: string }>;
}

async function getSubCategoryName(categoryId: string, subId: string): Promise<{ categoryName: string; subName: string } | null> {
  try {
    // Fetch active categories
    const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/get-active-category`, { next: { revalidate: 3600 } });
    const catJson = await catRes.json();
    let categoryName = "";
    if (catJson.success && Array.isArray(catJson.data)) {
      const cat = catJson.data.find((c: any) => c._id === categoryId);
      if (cat) categoryName = cat.title;
    }

    // Fetch active subcategories
    const subRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/category/get-active-subCategory?categoryId=${categoryId}&page=-1&limit=100`,
      { next: { revalidate: 3600 } }
    );
    const subJson = await subRes.json();
    let subName = "";
    if (subJson.success && Array.isArray(subJson.data)) {
      const sub = subJson.data.find((s: any) => s._id === subId);
      if (sub) subName = sub.title;
    }

    return { categoryName, subName };
  } catch (e) {
    console.error("Layout fetch subcategory failed", e);
  }
  return null;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { category, sub } = await params;
  const names = await getSubCategoryName(category, sub);
  
  const subName = names?.subName;
  const categoryName = names?.categoryName;

  const title = subName 
    ? `Bixright | Buy ${subName}`
    : "Bixright | Shop Products";
  const description = subName
    ? `Shop premium ${subName} online under ${categoryName || "electronics"} at Bixright. Discover the best models, reviews, prices, and enjoy fast free shipping.`
    : "Discover premium quality electronics products at Bixright.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    }
  };
}

export default function SubCategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
