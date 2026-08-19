import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center bg-background pt-16 lg:pt-20">
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="font-display text-7xl font-light text-foreground/20 sm:text-8xl">404</p>
        <h1 className="font-display text-3xl font-light text-foreground sm:text-4xl">This page isn&rsquo;t on the rack.</h1>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/55">
          The page you&rsquo;re looking for may have moved or no longer exists.
        </p>
        <Button href="/shop">Continue Shopping</Button>
      </Container>
    </div>
  );
}
