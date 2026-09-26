// app/(user)/products/[slug]/page.tsx
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { productService } from "@/app/sercices/user/product.service";
import { Product } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import ProductDetailClient from "./[id]/productDetailClientSide";
import { slugify } from "@/app/utils/slugify";

interface ProductSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to resolve product ID from slug
async function resolveProduct(slugOrId: string): Promise<Product | null> {
  // 1. Direct numeric ID (e.g. /products/1)
  if (/^\d+$/.test(slugOrId)) {
    try {
      const response = await productService.getProductById(slugOrId);
      if (response && response.product) return response.product;
    } catch (e) {
      console.error("Error resolving product by direct ID:", e);
    }
  }

  // 2. Trailing numeric ID in slug (e.g. /products/flazo-rockerz-110-1)
  const trailingMatch = slugOrId.match(/-(\d+)$/);
  if (trailingMatch && trailingMatch[1]) {
    try {
      const response = await productService.getProductById(trailingMatch[1]);
      if (response && response.product) return response.product;
    } catch (e) {
      console.error("Error resolving product by trailing ID:", e);
    }
  }

  // 3. Fallback: Search all products by name matching slug
  try {
    const all = await productService.getAllProducts({ limit: 100 });
    const productList: Product[] = Array.isArray(all) ? all : all?.products || [];
    const found = productList.find(
      (p) => slugify(p.name) === slugOrId || String(p.id) === slugOrId
    );
    if (found) return found;
  } catch (e) {
    console.error("Error searching product by slug name:", e);
  }

  return null;
}

export async function generateMetadata({
  params,
}: ProductSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);

  if (!product) {
    return { title: "Product Not Found | Flazo" };
  }

  return {
    title: `${product.name} | Flazo Audio Flagship`,
    description: product.description ? product.description.substring(0, 160) : product.name,
    openGraph: {
      title: product.name,
      description: product.description ? product.description.substring(0, 160) : product.name,
      images: product.images && product.images.length > 0 ? [getImageUrl(product.images[0])] : [],
      type: "website",
    },
  };
}

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;
  if (!slug) notFound();

  const product = await resolveProduct(slug);
  if (!product) notFound();

  const formattedTags = Array.isArray(product.tags)
    ? product.tags.map((tag: string) => {
        if (typeof tag === "string" && (tag.startsWith('["') || tag.endsWith('"]'))) {
          return tag.replace(/\[|\]|"/g, "").trim();
        }
        return tag;
      })
    : typeof product.tags === "string"
    ? (() => {
        try {
          const parsed = JSON.parse(product.tags);
          return Array.isArray(parsed) ? parsed : [product.tags];
        } catch {
          return (product.tags as string).split(",").map((t: string) => t.trim());
        }
      })()
    : [];

  return <ProductDetailClient product={product} formattedTags={formattedTags} />;
}
