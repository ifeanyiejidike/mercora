"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import { publicCommerceApi } from "@/lib/api/public-commerce";

type AddToCartButtonProps = {
  storeSlug: string;
  productId: string;
  defaultVariantId?: string | null;
};

export default function AddToCartButton({
  storeSlug,
  productId,
  defaultVariantId,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await publicCommerceApi.addCartItem(storeSlug, {
        product_id: productId,
        variant_id: defaultVariantId || undefined,
        quantity,
      });

      setSuccessMessage("Added to cart.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-14 items-center rounded-2xl border border-white/14 bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="inline-flex h-full w-12 items-center justify-center text-lg font-semibold text-white transition hover:bg-white/[0.06]"
          >
            −
          </button>
          <div className="inline-flex h-full min-w-[56px] items-center justify-center border-x border-white/10 px-4 text-sm font-semibold text-white">
            {quantity}
          </div>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="inline-flex h-full w-12 items-center justify-center text-lg font-semibold text-white transition hover:bg-white/[0.06]"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => void handleAddToCart()}
          disabled={isLoading}
          className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </>
          )}
        </button>
      </div>

      {successMessage ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </span>

          <Link
            href={`/_stores/${storeSlug}/cart`}
            className="font-semibold text-white underline underline-offset-4"
          >
            View cart
          </Link>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}
    </div>
  );
}