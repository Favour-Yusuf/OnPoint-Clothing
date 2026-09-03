import { Hero } from "@/components/home/hero";
import { BrandStatement } from "@/components/home/brand-statement";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { ExpressionTeaser } from "@/components/home/expression-teaser";
import { CategoryDiscovery } from "@/components/home/category-discovery";
import { BespokeTeaser } from "@/components/home/bespoke-teaser";
import { ActiveTeaser } from "@/components/home/active-teaser";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Recognition } from "@/components/home/recognition";
import { FinalCTA } from "@/components/home/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <FeaturedCollection />
      <div aria-hidden="true" className="h-4 bg-foreground" />
      <ExpressionTeaser />
      {/* <CategoryDiscovery /> */}
      <BespokeTeaser />
      <ActiveTeaser />
      <BrandStatement />
      {/* <Recognition /> */}
      <FinalCTA />
    </>
  );
}
