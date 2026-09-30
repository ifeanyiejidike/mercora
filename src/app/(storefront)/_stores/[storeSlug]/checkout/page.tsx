"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  formatMoney,
  getPaymentCheckoutUrl,
  publicCommerceApi,
} from "@/lib/api/public-commerce";
import type {
  PublicCart,
  PublicCheckoutSession,
  PublicOrder,
} from "@/types/public-commerce";

type AddressState = {
  recipient_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state_region: string;
  postal_code: string;
  country_code: string;
  delivery_instructions: string;
};

const emptyAddress: AddressState = {
  recipient_name: "",
  phone_number: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state_region: "",
  postal_code: "",
  country_code: "NG",
  delivery_instructions: "",
};

export default function StorefrontCheckoutPage() {
  const params = useParams<{ storeSlug: string }>();
  const router = useRouter();
  const storeSlug = params.storeSlug;

  const [cart, setCart] = useState<PublicCart | null>(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [buyerNote, setBuyerNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("merchant_direct");
  const [provider, setProvider] = useState("flutterwave");
  const [shippingAddress, setShippingAddress] = useState<AddressState>(emptyAddress);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<AddressState>(emptyAddress);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currency: string =
    cart?.currency || cart?.presentment_currency || cart?.base_currency || "NGN";

  const cartItems = useMemo(() => cart?.items || [], [cart]);

  useEffect(() => {
    const run = async () => {
      try {
        const nextCart = await publicCommerceApi.getCart(storeSlug);
        setCart(nextCart);
        if (nextCart.guest_email) {
          setEmail(String(nextCart.guest_email));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load checkout.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [storeSlug]);

  const updateShippingField = <K extends keyof AddressState>(
    key: K,
    value: AddressState[K],
  ) => {
    setShippingAddress((current) => ({ ...current, [key]: value }));
  };

  const updateBillingField = <K extends keyof AddressState>(
    key: K,
    value: AddressState[K],
  ) => {
    setBillingAddress((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!cart?.id) {
      setError("Cart is not ready.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await publicCommerceApi.resolveCart(storeSlug, {
        guest_email: email,
      });

      const checkoutSession: PublicCheckoutSession =
        await publicCommerceApi.createCheckoutSession(storeSlug, {
          cart_id: cart.id,
          payment_mode: paymentMode,
          selected_provider:
            paymentMode === "platform_managed" ? provider : undefined,
          email,
          phone_number: phoneNumber,
          shipping_address: shippingAddress,
          billing_address: billingSameAsShipping ? shippingAddress : billingAddress,
        });

      const order: PublicOrder = await publicCommerceApi.createOrder(storeSlug, {
        checkout_session_id: checkoutSession.id,
        buyer_note: buyerNote,
      });

      const payment = await publicCommerceApi.initializePayment(
        storeSlug,
        order.order_number,
        paymentMode === "platform_managed" ? { provider } : {},
        email,
      );

      if (paymentMode === "platform_managed") {
        const checkoutUrl = getPaymentCheckoutUrl(payment);

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }

        router.push(
          `/_stores/${storeSlug}/checkout/pending?orderRef=${encodeURIComponent(
            order.order_number,
          )}&email=${encodeURIComponent(email)}`,
        );
        return;
      }

      router.push(
        `/_stores/${storeSlug}/payment/manual/${encodeURIComponent(
          order.order_number,
        )}?email=${encodeURIComponent(email)}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to complete checkout.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-neutral-1 text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.06fr_0.94fr]">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <div className="border-b border-white/10 px-6 py-6 sm:px-8">
              <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">
                Checkout
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Complete buyer details, choose a payment mode, and continue into payment.
              </p>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {error ? (
                <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-10 text-center">
                  <h2 className="text-2xl font-semibold text-white">
                    Your cart is empty
                  </h2>
                </div>
              ) : (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Email"
                      value={email}
                      onChange={setEmail}
                      type="email"
                      placeholder="you@example.com"
                    />
                    <InputField
                      label="Phone number"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      placeholder="+234..."
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField
                      label="Payment mode"
                      value={paymentMode}
                      onChange={setPaymentMode}
                      options={[
                        { label: "Merchant direct", value: "merchant_direct" },
                        { label: "Platform managed", value: "platform_managed" },
                      ]}
                    />

                    {paymentMode === "platform_managed" ? (
                      <SelectField
                        label="Provider"
                        value={provider}
                        onChange={setProvider}
                        options={[
                          { label: "Flutterwave", value: "flutterwave" },
                          { label: "Paystack", value: "paystack" },
                          { label: "Opay", value: "opay" },
                        ]}
                      />
                    ) : (
                      <div />
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                      Buyer note
                    </label>
                    <textarea
                      rows={4}
                      value={buyerNote}
                      onChange={(event) => setBuyerNote(event.target.value)}
                      placeholder="Optional note"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
                    />
                  </div>

                  <AddressCard
                    title="Shipping address"
                    address={shippingAddress}
                    onChange={updateShippingField}
                  />

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                      className="mt-1 h-4 w-4"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">
                        Billing address same as shipping
                      </div>
                      <p className="mt-1 text-xs leading-6 text-slate-400">
                        Untick this if you want a separate billing address.
                      </p>
                    </div>
                  </label>

                  {!billingSameAsShipping ? (
                    <AddressCard
                      title="Billing address"
                      address={billingAddress}
                      onChange={updateBillingField}
                    />
                  ) : null}

                  <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--brand-gradient)] px-6 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(79,70,229,0.34)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(79,70,229,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </>
              )}
            </div>
          </section>

          <aside className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,22,48,0.78),rgba(8,12,28,0.96))] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.24)]">
            <h2 className="text-xl font-semibold text-white">Order summary</h2>

            <div className="mt-5 space-y-3">
              <SummaryRow
                label="Items"
                value={String(cartItems.length)}
              />
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
          </aside>
        </div>
      </section>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-neutral-2 px-4 text-sm text-white outline-none focus:border-indigo-400/50"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-2 text-slate-300"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AddressCard({
  title,
  address,
  onChange,
}: {
  title: string;
  address: AddressState;
  onChange: <K extends keyof AddressState>(
    key: K,
    value: AddressState[K],
  ) => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <InputField
          label="Recipient name"
          value={address.recipient_name}
          onChange={(value) => onChange("recipient_name", value)}
        />
        <InputField
          label="Phone"
          value={address.phone_number}
          onChange={(value) => onChange("phone_number", value)}
        />
        <InputField
          label="Address line 1"
          value={address.address_line_1}
          onChange={(value) => onChange("address_line_1", value)}
        />
        <InputField
          label="Address line 2"
          value={address.address_line_2}
          onChange={(value) => onChange("address_line_2", value)}
        />
        <InputField
          label="City"
          value={address.city}
          onChange={(value) => onChange("city", value)}
        />
        <InputField
          label="State / Region"
          value={address.state_region}
          onChange={(value) => onChange("state_region", value)}
        />
        <InputField
          label="Postal code"
          value={address.postal_code}
          onChange={(value) => onChange("postal_code", value)}
        />
        <InputField
          label="Country code"
          value={address.country_code}
          onChange={(value) => onChange("country_code", value.toUpperCase())}
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Delivery instructions
        </label>
        <textarea
          rows={3}
          value={address.delivery_instructions}
          onChange={(event) =>
            onChange("delivery_instructions", event.target.value)
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400/50"
        />
      </div>
    </div>
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