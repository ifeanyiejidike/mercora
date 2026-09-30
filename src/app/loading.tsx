export default function LoadingPage() {
  return (
    <section className="relative isolate overflow-hidden bg-neutral-1">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-0 top-[100px] h-[280px] w-[280px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_30%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,34,0.96),rgba(7,10,22,0.98))] shadow-[0_30px_80px_rgba(0,0,0,0.36)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>

          <div className="space-y-6 p-6 sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Loading page
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Preparing the next Mercora experience…
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
              <div className="h-12 w-full animate-pulse rounded-2xl bg-white/[0.05]" />
              <div className="h-12 w-full animate-pulse rounded-2xl bg-white/[0.05]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 animate-pulse rounded-2xl bg-white/[0.05]" />
                <div className="h-24 animate-pulse rounded-2xl bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}