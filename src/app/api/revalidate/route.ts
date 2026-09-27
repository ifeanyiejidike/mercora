import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand ISR revalidation.
 *
 * POST /api/revalidate
 * Headers: { "x-revalidate-secret": "<REVALIDATE_SECRET>" }
 * Body (JSON): { "path"?: string, "tag"?: string }
 *
 * At least one of `path` or `tag` is required; both may be provided in
 * one call. Nothing in this codebase calls `fetch(..., { next: { tags }
 * })` yet, so `tag` has no effect until fetches start tagging their
 * responses — `path` works immediately for any rendered route.
 *
 * Example (once a merchant updates their storefront in the backend,
 * trigger via a webhook or CI step):
 *   curl -X POST https://your-site/api/revalidate \
 *     -H "x-revalidate-secret: $REVALIDATE_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"path": "/store/acme-widgets"}'
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on this deployment." },
      { status: 503 },
    );
  }

  if (secret !== expected) {
    return NextResponse.json({ error: "Invalid revalidation secret." }, { status: 401 });
  }

  let body: { path?: string; tag?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const { path, tag } = body;

  if (!path && !tag) {
    return NextResponse.json(
      { error: "Provide at least one of `path` or `tag` to revalidate." },
      { status: 400 },
    );
  }

  const revalidated: { paths: string[]; tags: string[] } = { paths: [], tags: [] };

  if (path) {
    revalidatePath(path);
    revalidated.paths.push(path);
  }

  if (tag) {
    // Next.js 16 requires a cache-life profile as the second argument.
    // "max" just means "this tag's configured cache life doesn't limit
    // how long it can go between revalidations" — it does not skip or
    // weaken this explicit, on-demand revalidation call.
    revalidateTag(tag, "max");
    revalidated.tags.push(tag);
  }

  return NextResponse.json({ revalidated: true, ...revalidated, now: Date.now() });
}
