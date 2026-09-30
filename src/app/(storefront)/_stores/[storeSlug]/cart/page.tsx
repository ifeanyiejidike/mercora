"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatMoney, publicCommerceApi } from "@/lib/api/public-commerce";
import type { PublicCart, PublicCartItem } from "@/types/public-commerce";

function getCartItemName(item: PublicCartItem) {
  return (
    item.product_name ||
    item.product_title ||
    (item.product_snapshot?.name as string) ||
    (item.product?.name as string) ||
    "Cart item"
  );
}

function getCartItemImage(item: PublicCartItem) {
  return (
    item.image_url ||
    (item.product_snapshot?.image_url as string) ||
    (item.product_snapshot?.primary_image_url as string) ||
    (item.product?.image_url as string) ||
    ""
  );
}

function getCartItemPrice(item: PublicCartItem) {
  return (
    item.total_price_amount ||
    item.unit_price_amount ||
    (item.product_snapshot?.total_price_amount as string) ||
    (item.product_snapshot?.unit_price_amount as string) ||
    ""
  );
}

export default function StorefrontCartPage() {
  const params = useParams<{ storeSlug: string }>();
  const storeSlug = params.storeSlug;

  const [cart, setCart] = useState<PublicCart | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState("");
  const [error, setError] = useState("");

  const currency: string =
    cart?.currency || cart?.presentment_currency || cart?.base_currency || "NGN";

  const items = useMemo(() => cart?.items || [], [cart]);

  const loadCart = async () => {
    try {
      const nextCart = await publicCommerceApi.getCart(storeSlug);
      setCart(nextCart);

      if (nextCart.guest_email) {
        setGuestEmail(String(nextCart.guest_email));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load cart.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, [storeSlug]);

  const handleResolveCart = async () => {
    setError("");

    try {
      const nextCart = await publicCommerceApi.resolveCart(storeSlug, {
        guest_email: guestEmail,
      });
      setCart(nextCart);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update cart.");
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    setBusyItemId(itemId);
    setError("");

    try {
      await publicCommerceApi.updateCartItem(storeSlug, itemId, { quantity });
      await loadCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update item.");
    } finally {
      setBusyItemId("");
    }
  };

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.06fr_0.94fr]">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                <ShoppingCart className="h-4 w-4" />
                Buyer cart
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Review your cart
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Adjust quantities, keep your buyer email attached to the cart,
                and continue to checkout when ready.
              </p>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              {error ? (
                <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-10 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    Your cart is empty
                  </h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-300">
                    Add products from the storefront first, then return here.
                  </p>
                  <Link
                    href={`/_stores/${storeSlug}/products`}
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white"
                  >
                    Browse products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="h-24 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:h-24 sm:w-24">
                        {getCartItemImage(item) ? (
                          <img
                            src={getCartItemImage(item)}
                            alt={getCartItemName(item)}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-white">
                          {getCartItemName(item)}
                        </h2>

                        <div className="mt-2 text-sm text-slate-400">
                          {formatMoney(getCartItemPrice(item), currency)}
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex h-11 items-center rounded-xl border border-white/10 bg-white/[0.03]">
                            <button
                              type="button"
                              disabled={busyItemId === item.id}
                              onClick={() =>
                                void handleQuantityChange(
                                  item.id,
                                  Math.max(0, item.quantity - 1),
                                )
                              }
                              className="inline-flex h-full w-11 items-center justify-center text-white transition hover:bg-white/[0.06]"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <div className="inline-flex h-full min-w-[52px] items-center justify-center border-x border-white/10 px-4 text-sm font-semibold text-white">
                              {item.quantity}
                            </div>

                            <button
                              type="button"
                              disabled={busyItemId === item.id}
                              onClick={() =>
                                void handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="inline-flex h-full w-11 items-center justify-center text-white transition hover:bg-white/[0.06]"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            disabled={busyItemId === item.id}
                            onClick={() => void handleQuantityChange(item.id, 0)}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition hover:bg-red-500/15"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <h2 className="text-xl font-semibold text-white">Buyer details</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Attach your email to keep access to checkout, orders, and receipts.
              </p>

              <div className="mt-5 space-y-3">
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
                />

                <button
                  type="button"
                  onClick={() => void handleResolveCart()}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Save buyer email
                </button>
              </div>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
              <h2 className="text-xl font-semibold text-white">Summary</h2>

              <div className="mt-5 space-y-3">
                <SummaryRow
                  label="Subtotal"
                  value={formatMoney(cart?.subtotal_amount, currency)}
                />
                <SummaryRow
                  label="Discount"
                  value={formatMoney(cart?.discount_amount, currency)}
                />
                <SummaryRow
                  label="Shipping"
                  value={formatMoney(cart?.shipping_amount, currency)}
                />
                <SummaryRow
                  label="Tax"
                  value={formatMoney(cart?.tax_amount, currency)}
                />
                <SummaryRow
                  label="Total"
                  value={formatMoney(cart?.gross_amount, currency)}
                  emphasized
                />
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/_stores/${storeSlug}/checkout`}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white ${
                    items.length === 0
                      ? "cursor-not-allowed bg-white/[0.06] opacity-60"
                      : "bg-[image:var(--brand-gradient)] shadow-[0_16px_38px_rgba(79,70,229,0.34)]"
                  }`}
                >
                  Proceed to checkout
                </Link>

                <Link
                  href={`/_stores/${storeSlug}/products`}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/14 bg-white/[0.03] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Continue shopping
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm font-semibold ${
          emphasized ? "text-white" : "text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}