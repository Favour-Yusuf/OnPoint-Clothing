import Link from "next/link";
import { signOut } from "@/lib/actions/auth";
import { deleteAddress } from "@/lib/actions/account";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/account/address-form";
import { TrashIcon } from "@/components/ui/icons";
import type { Address, Order } from "@/lib/types";

export function AccountView({
  fullName,
  email,
  addresses,
  recentOrders,
}: {
  fullName: string | null;
  email: string;
  addresses: Address[];
  recentOrders: Order[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-12">
      <div className="flex items-center justify-between border-b border-foreground/10 pb-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
            Signed in as
          </p>
          <h1 className="mt-1 font-serif text-2xl font-light text-foreground">{fullName || email}</h1>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="md">
            Sign Out
          </Button>
        </form>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
            Recent Orders
          </h2>
          <Link href="/account/orders" className="font-sans text-xs text-foreground/60 hover:text-foreground">
            View All
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-foreground/50">You haven&rsquo;t placed an order yet.</p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 font-sans text-sm">
                <div>
                  <p className="text-foreground">{order.orderNumber}</p>
                  <p className="text-foreground/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-foreground/70 capitalize">{order.status.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-sans text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">
          Saved Addresses
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start justify-between border border-foreground/10 p-4">
              <div className="font-sans text-sm text-foreground/70">
                <p className="text-foreground">{address.fullName}</p>
                <p>{address.address1}</p>
                {address.address2 ? <p>{address.address2}</p> : null}
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>
              <form action={deleteAddress}>
                <input type="hidden" name="addressId" value={address.id} />
                <button
                  type="submit"
                  aria-label="Remove address"
                  className="text-foreground/40 transition-colors hover:text-burgundy-light"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
          <AddressForm />
        </div>
      </section>
    </div>
  );
}
