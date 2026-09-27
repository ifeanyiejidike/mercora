import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";

export const dynamic = "force-dynamic";

/**
 * Liveness/readiness check for this Next.js app itself, plus a
 * best-effort check that the Django backend it depends on is
 * reachable. Backend unreachability is reported as "degraded" rather
 * than "unhealthy" — this app can still serve static/cached pages
 * even if the API is temporarily down.
 */
export async function GET() {
  const startedAt = Date.now();

  let backendOk = false;
  let backendError: string | null = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${env.apiUrl}/api/health/`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    backendOk = response.ok;
    if (!response.ok) {
      backendError = `Backend health check returned ${response.status}`;
    }
  } catch (error) {
    backendError = error instanceof Error ? error.message : "Unknown error";
  }

  const status = backendOk ? "healthy" : "degraded";

  return NextResponse.json(
    {
      status,
      checks: {
        backend: { ok: backendOk, error: backendError },
      },
      durationMs: Date.now() - startedAt,
    },
    { status: 200 },
  );
}
