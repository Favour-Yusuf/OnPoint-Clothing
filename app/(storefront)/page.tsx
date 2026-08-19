import { Hero } from "@/components/home/hero";
import { BrandStatement } from "@/components/home/brand-statement";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { ExpressionTeaser } from "@/components/home/expression-teaser";
import { CategoryDiscovery } from "@/components/home/category-discovery";
import { BespokeTeaser } from "@/components/home/bespoke-teaser";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Heritage } from "@/components/home/heritage";
import { FinalCTA } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStatement />
      <FeaturedCollection />
      <ExpressionTeaser />
      <CategoryDiscovery />
      <BespokeTeaser />
      <FeaturedProducts />
      <Heritage />
      <FinalCTA />
    </>
  );
}
