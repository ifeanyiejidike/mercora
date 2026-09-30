import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import { featuredProducts, partnerLogos, stats } from "./home.data";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero.webp')",
            backgroundPosition: "86% 26%",
            filter: "brightness(1.12) contrast(1.08) saturate(1.1)",
            transform: "scale(1.02)",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,24,0.96)_0%,rgba(4,10,24,0.84)_22%,rgba(4,10,24,0.34)_54%,rgba(4,10,24,0.40)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,24,0.05)_0%,rgba(4,10,24,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(91,61,245,0.10),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(59,130,246,0.08),transparent_20%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-0 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
              Built for African Merchants
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.65rem]">
              Storefronts, Payments & Receipts.
              <span className="block">All in One System.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Mercora is the commerce operating system that helps you sell online,
              manage orders, get paid, issue receipts, and track settlements with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(79,70,229,0.38)] transition hover:translate-y-[-1px]"
              >
                Create Your Store
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/14 bg-white/[0.03] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20">
                  <span className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-white border-t-transparent" />
                </span>
                See How It Works
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
              <ShieldCheck className="h-4 w-4 text-slate-300" />
              <span>No setup fees. Start free. Scale when you&apos;re ready.</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto flex max-w-[610px] items-end justify-end lg:min-h-[540px]">
              <div className="absolute right-[27%] top-0 z-10 hidden h-[520px] w-[320px] rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md lg:block" />

              <div className="relative z-20 grid w-full gap-4 md:grid-cols-[1.02fr_0.78fr] lg:max-w-[600px]">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-[28px] border border-indigo-500/30 bg-[linear-gradient(180deg,rgba(20,12,40,0.92),rgba(14,13,28,0.96))] shadow-[0_20px_60px_rgba(91,61,245,0.22)]">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-white">Zuri &amp; Co.</div>
                        <ShoppingBag className="h-4 w-4 text-slate-300" />
                      </div>

                      <div className="relative mt-5 overflow-hidden rounded-[24px]">
                        <div className="absolute inset-0">
                          <Image
                            src="/images/new-collection.webp"
                            alt="Zuri & Co. new collection hero image"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 320px"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(18,11,34,0.24)_0%,rgba(18,11,34,0.62)_100%)]" />
                        </div>

                        <div className="relative z-10 p-5">
                          <div className="text-xs uppercase tracking-[0.14em] text-slate-300">
                            New Collection
                          </div>
                          <div className="mt-2 max-w-[180px] text-3xl font-semibold leading-tight text-white">
                            Handcrafted for You
                          </div>
                          <button
                            type="button"
                            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-slate-950"
                          >
                            Shop Now
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-sm font-medium text-white">Featured</div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {featuredProducts.map((product) => (
                            <MiniProduct
                              key={product.name}
                              name={product.name}
                              price={product.price}
                              image={product.image}
                              alt={product.alt}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <MetricCard label="Today’s Sales" value="₦482,600" change="↑ 12.5%" />

                  <MetricCard
                    label="Pending Settlement"
                    value="₦126,780"
                    change="Arrives May 28"
                  />

                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[0_20px_50px_rgba(0,0,0,0.34)] backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">Receipt Sent</div>
                        <div className="mt-1 text-xs text-slate-300">Order #MC-45872</div>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-3 px-5 py-4 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>₦45,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery</span>
                        <span>₦2,500</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-700/60 pt-3 text-base font-semibold text-white">
                        <span>Total</span>
                        <span>₦47,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-t-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,28,0.96),rgba(6,9,22,0.98))] lg:mt-16">
          <div className="grid gap-0 border-b border-white/10 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-wrap items-center gap-6 px-6 py-5 lg:px-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Trusted &amp; Powered By
              </div>

              <div className="flex flex-wrap items-center gap-6 text-base font-semibold text-slate-300">
                {partnerLogos.map((logo) => (
                  <span key={logo}>{logo}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4 xl:border-l xl:border-t-0">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={[
                    "px-5 py-5",
                    index !== stats.length - 1 ? "border-r border-white/10" : "",
                  ].join(" ")}
                >
                  <div className="text-2xl font-bold tracking-[-0.03em] text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniProduct({
  name,
  price,
  image,
  alt,
}: {
  name: string;
  price: string;
  image: string;
  alt: string;
}) {
  return (
    <div className="overflow-hidden rounded-[18px] bg-neutral-panel">
      <div className="relative h-24 overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 160px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.06)_0%,rgba(17,24,39,0.34)_100%)]" />
      </div>

      <div className="space-y-1 px-3 py-3">
        <div className="text-xs font-medium text-white">{name}</div>
        <div className="text-xs text-slate-300">{price}</div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,17,39,0.92),rgba(10,12,31,0.95))] shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
      <div className="px-5 py-4">
        <div className="text-sm text-slate-300">{label}</div>
        <div className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">{value}</div>
        <div className="mt-2 text-sm text-emerald-400">{change}</div>
      </div>
    </div>
  );
}