"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Mail,
  Menu,
  Receipt,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
  X,
} from "lucide-react";

type NavChild = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
  dropdownAlign?: "left" | "right";
  dropdownWidth?: string;
};

const navItems: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/how-it-works" },
  {
    label: "Company",
    dropdownAlign: "right",
    dropdownWidth: "w-[460px]",
    children: [
      {
        label: "About Mercora",
        description:
          "Learn what Mercora is building for modern merchants and why it exists.",
        href: "/about",
        icon: Building2,
      },
      {
        label: "Contact",
        description:
          "Reach out for demos, pricing questions, support, and implementation enquiries.",
        href: "/contact",
        icon: Mail,
      },
      {
        label: "FAQ",
        description:
          "Get clear answers to common questions about the platform and merchant workflows.",
        href: "/faq",
        icon: CircleHelp,
      },
      {
        label: "Book Demo",
        description:
          "Schedule a walkthrough to see Mercora’s storefront, payments, and receipt flows clearly.",
        href: "/book-demo",
        icon: CalendarDays,
      },
    ],
  },
];

const dropdownMeta: Record<
  string,
  { title: string; description: string; icon: LucideIcon }
> = {
  Features: {
    title: "Built for trust, speed, and operational clarity",
    description:
      "Premium storefronts, payment flow visibility, professional receipts, and merchant-grade reporting.",
    icon: ShieldCheck,
  },
  Company: {
    title: "Built for trust, clarity, and merchant growth",
    description:
      "Everything a serious commerce platform should communicate clearly — product direction, support, answers, and next steps.",
    icon: Sparkles,
  },
};

function normalizePath(pathname: string) {
  if (!pathname) return "/";
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function matchesPath(pathname: string, href: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);

  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

function isNavItemActive(pathname: string, item: NavItem) {
  if (item.href) {
    return matchesPath(pathname, item.href);
  }

  if (item.children?.length) {
    if (item.label === "Features") {
      return matchesPath(pathname, "/features");
    }

    return item.children.some((child) => matchesPath(pathname, child.href));
  }

  return false;
}

function BrandMark() {
  return (
    <Link
      href="/"
      aria-label="Mercora home"
      className="inline-flex items-center gap-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-1"
    >
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl">
        <Image
          src="/logo.png"
          alt="Mercora logo"
          fill
          priority
          sizes="44px"
          className="object-contain"
        />
      </div>

      <div className="leading-none">
        <div className="text-[1.06rem] font-extrabold tracking-[-0.04em] text-white">
          MERCORA
        </div>
        <div className="hidden text-xs font-medium text-slate-300 md:block">
          Commerce infrastructure for modern merchants
        </div>
      </div>
    </Link>
  );
}

function DesktopDropdown({
  item,
  isOpen,
  isActive,
  pathname,
  onOpen,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  isActive: boolean;
  pathname: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  if (!item.children?.length) {
    return null;
  }

  const meta = dropdownMeta[item.label];
  const MetaIcon = meta?.icon ?? ShieldCheck;
  const alignmentClass =
    item.dropdownAlign === "right" ? "right-0 left-auto" : "left-0 right-auto";
  const widthClass = item.dropdownWidth ?? "w-[460px]";

  return (
    <div
      className="relative -mb-4 pb-4"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={isOpen ? onClose : onOpen}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
          isOpen || isActive
            ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            : "text-slate-200 hover:bg-white/8 hover:text-white"
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute top-full z-50 pt-3 transition-all duration-200 ${alignmentClass} ${widthClass} ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[rgba(5,11,28,0.96)] shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <div className="max-h-[min(72vh,560px)] overflow-y-auto overscroll-contain p-3">
            <div className="grid gap-2">
              {item.children.map((child) => {
                const Icon = child.icon;
                const childActive = matchesPath(pathname, child.href);

                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    className={`group rounded-2xl border p-3 transition ${
                      childActive
                        ? "border-white/10 bg-white/8"
                        : "border-transparent hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                          childActive
                            ? "bg-blue-600/20 text-blue-200"
                            : "bg-blue-600/15 text-blue-300 group-hover:bg-blue-600/20 group-hover:text-blue-200"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">{child.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {child.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 rounded-2xl border border-blue-500/20 bg-blue-600/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300">
                  <MetaIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    {meta?.title ?? "Built for trust and operational clarity"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {meta?.description ??
                      "Mercora helps merchants operate with stronger structure, trust, and visibility."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();

    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus management for the mobile drawer: move focus into it on open
  // (so keyboard/screen-reader users land somewhere sensible rather than
  // on a now-hidden trigger), trap Tab/Shift+Tab within its focusable
  // elements while open, and return focus to the trigger button on close
  // rather than leaving it stranded on the document body.
  useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusable = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

    const focusable = getFocusable();
    focusable[0]?.focus();

    const onTrapKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const elements = getFocusable();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    drawer.addEventListener("keydown", onTrapKeyDown);

    return () => {
      drawer.removeEventListener("keydown", onTrapKeyDown);
      mobileTriggerRef.current?.focus();
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[rgba(4,10,24,0.92)] shadow-[0_18px_60px_rgba(2,6,23,0.38)] backdrop-blur-xl"
            : "border-b border-white/8 bg-[rgba(4,10,24,0.76)] shadow-[0_10px_36px_rgba(2,6,23,0.18)] backdrop-blur-lg"
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.16),transparent)]" />

        <div
          ref={wrapperRef}
          className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[78px] lg:px-8"
        >
          <BrandMark />

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const itemActive = isNavItemActive(pathname, item);

              return item.children?.length ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  isActive={itemActive}
                  isOpen={openMenu === item.label}
                  onOpen={() => setOpenMenu(item.label)}
                  onClose={() => setOpenMenu(null)}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href ?? "#"}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    itemActive
                      ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "text-slate-200 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                matchesPath(pathname, "/sign-in")
                  ? "bg-white/10 text-white"
                  : "text-slate-200 hover:bg-white/8 hover:text-white"
              }`}
            >
              Log In
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[image:var(--brand-gradient)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.34)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(79,70,229,0.38)]"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            ref={mobileTriggerRef}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          ref={drawerRef}
          className={`absolute right-0 top-0 flex h-dvh w-full max-w-sm flex-col border-l border-white/10 bg-[rgba(5,11,28,0.97)] shadow-[0_20px_80px_rgba(2,6,23,0.46)] transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <BrandMark />

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <nav className="space-y-3" aria-label="Mobile navigation">
              {navItems.map((item) => {
                const itemActive = isNavItemActive(pathname, item);

                return (
                  <div
                    key={item.label}
                    className={`rounded-3xl border p-2 ${
                      itemActive
                        ? "border-white/15 bg-white/[0.05]"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                          itemActive
                            ? "bg-white/[0.06] text-white"
                            : "text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div className="px-4 pb-2 pt-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                        {item.label}
                      </div>
                    )}

                    {item.children?.length ? (
                      <div className="max-h-[45vh] space-y-1 overflow-y-auto px-2 pb-2">
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          const childActive = matchesPath(pathname, child.href);

                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={`flex items-start gap-3 rounded-2xl px-3 py-3 transition ${
                                childActive
                                  ? "bg-white/[0.07]"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                  childActive
                                    ? "bg-blue-600/20 text-blue-200"
                                    : "bg-blue-600/15 text-blue-300"
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {child.label}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-300">
                                  {child.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/10 px-5 py-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={`inline-flex min-h-12 items-center justify-center rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  matchesPath(pathname, "/sign-in")
                    ? "border-white/15 bg-white/[0.08] text-white"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                Log In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[image:var(--brand-gradient)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.34)] transition hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}