import { Container } from "@/components/ui/container";

export default function ShopLoading() {
  return (
    <div className="bg-background pt-16 lg:pt-20">
      <Container className="py-12 sm:py-16">
        <div className="h-3 w-20 animate-pulse bg-foreground/10" />
        <div className="mt-4 h-10 w-64 animate-pulse bg-foreground/10" />
        <div className="mt-4 h-4 w-96 max-w-full animate-pulse bg-foreground/10" />
      </Container>
      <Container>
        <div className="border-b border-foreground/10 py-5">
          <div className="h-4 w-24 animate-pulse bg-foreground/10" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 py-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="aspect-4/5 w-full animate-pulse bg-foreground/10" />
              <div className="h-3 w-3/4 animate-pulse bg-foreground/10" />
              <div className="h-3 w-1/3 animate-pulse bg-foreground/10" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
