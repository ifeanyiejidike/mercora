import Link from "next/link";

export default function HomeHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-white/5 bg-neutral-1 py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            How Mercora Works
          </div>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
            From Setup to Settlement
            <br />
            in Three Simple Steps
          </h2>

          <div className="mt-10 space-y-8">
            <StepItem
              number="1"
              title="Create & Customize"
              description="Set up your store, add products, and connect your payment methods."
            />
            <StepItem
              number="2"
              title="Start Selling"
              description="Share your store and start receiving orders and payments."
            />
            <StepItem
              number="3"
              title="Get Paid & Grow"
              description="Issue receipts automatically and track your settlements in real time."
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,28,0.98),rgba(5,8,20,1))] shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>

          <div className="grid lg:grid-cols-[230px_1fr]">
            <aside className="border-b border-white/10 bg-neutral-sidebar p-5 lg:border-b-0 lg:border-r">
              <div className="mb-8 flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[image:var(--brand-gradient)]">
                  <svg
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                    className="h-5 w-5 text-white"
                    fill="none"
                  >
                    <path
                      d="M7 34V14h6.4l6.8 10.8L27 14h6.2v20h-5.6V23.8l-5.7 8.9h-3.2L13 23.8V34H7Z"
                      fill="currentColor"
                    />
                    <path d="M34 14h7v20h-7z" fill="currentColor" opacity="0.96" />
                  </svg>
                </div>
                <span className="text-base font-semibold text-white">mercora</span>
              </div>

              <div className="space-y-2">
                {[
                  "Home",
                  "Orders",
                  "Products",
                  "Payments",
                  "Settlements",
                  "Receipts",
                  "Analytics",
                  "Settings",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={[
                      "rounded-xl px-4 py-3 text-sm font-medium",
                      index === 0
                        ? "bg-[linear-gradient(135deg,#3f2cd8_0%,#253b8f_100%)] text-white"
                        : "text-slate-300",
                    ].join(" ")}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-slate-400">Overview</div>
                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white">
                    Merchant performance
                  </h3>
                </div>

                <div className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-300">
                  May 20 - May 26
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DashboardStat
                  className="sm:col-span-2"
                  title="Total Sales"
                  value="₦1,560,250"
                  meta="+ 8.4% vs. last week"
                />
                <DashboardStat
                  title="Orders"
                  value="2,847"
                  meta="+ 6.1% vs. last week"
                />
                <DashboardStat
                  title="Successful Payments"
                  value="98.7%"
                  meta="+ 0.3% vs. last week"
                />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.62fr]">
                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,25,54,0.58),rgba(10,15,34,0.95))] p-5">
                  <div className="mb-4 text-sm font-medium text-slate-300">
                    Sales Trend
                  </div>

                  <div className="relative h-[250px] overflow-hidden rounded-2xl bg-neutral-2">
                    <div className="absolute inset-x-6 top-12 border-t border-dashed border-white/10" />
                    <div className="absolute inset-x-6 top-1/2 border-t border-dashed border-white/10" />
                    <div className="absolute inset-x-6 bottom-12 border-t border-dashed border-white/10" />

                    <svg
                      viewBox="0 0 720 280"
                      className="absolute inset-0 h-full w-full"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M35 218 C 95 218, 120 188, 165 190 C 218 193, 240 160, 282 152 C 332 142, 350 178, 396 165 C 444 150, 470 125, 515 136 C 560 148, 585 130, 625 95 C 652 72, 675 58, 690 64"
                        stroke="url(#mercoraGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="mercoraGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#5b3df5" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute left-[54%] top-[34%] rounded-2xl border border-white/10 bg-neutral-sidebar/95 px-4 py-3 shadow-xl">
                      <div className="text-xs text-slate-400">Fri, May 24</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        ₦395,400
                      </div>
                    </div>

                    <div className="absolute inset-x-5 bottom-4 grid grid-cols-7 text-center text-xs text-slate-500">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,25,54,0.58),rgba(10,15,34,0.95))] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-300">Recent Orders</div>
                    <Link
                      href="/signin"
                      className="text-xs font-medium text-indigo-400 transition hover:text-indigo-300"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <OrderRow id="#MC-45872" amount="₦47,500" status="Paid" />
                    <OrderRow id="#MC-45871" amount="₦12,000" status="Paid" />
                    <OrderRow id="#MC-45870" amount="₦89,900" status="Pending" />
                    <OrderRow id="#MC-45869" amount="₦25,600" status="Paid" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-[linear-gradient(135deg,#3d2fcf_0%,#2a4ccf_100%)] text-base font-bold text-white shadow-[0_16px_36px_rgba(79,70,229,0.28)]">
        {number}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  );
}

function DashboardStat({
  title,
  value,
  meta,
  className = "",
}: {
  title: string;
  value: string;
  meta: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,42,0.76),rgba(9,13,29,0.96))] px-4 py-4 ${className}`}
    >
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-white">
        {value}
      </div>
      <div className="mt-2 text-xs text-emerald-400">{meta}</div>
    </div>
  );
}

function OrderRow({
  id,
  amount,
  status,
}: {
  id: string;
  amount: string;
  status: "Paid" | "Pending";
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <div>
        <div className="text-sm font-medium text-white">{id}</div>
        <div className="mt-1 text-xs text-slate-400">{amount}</div>
      </div>

      <span
        className={[
          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
          status === "Paid"
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-amber-500/15 text-amber-400",
        ].join(" ")}
      >
        {status}
      </span>
    </div>
  );
}