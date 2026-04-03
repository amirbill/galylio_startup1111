"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, GA_ID } from "@/lib/gtag";

/** Send a page_view, retrying up to ~2 s if gtag isn't loaded yet. */
function sendPageView(url: string, retries = 20) {
  if (typeof window === "undefined" || !GA_ID) return;

  if (window.gtag) {
    pageview(url);
  } else if (retries > 0) {
    setTimeout(() => sendPageView(url, retries - 1), 100);
  }
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const search = searchParams?.toString();
    const url = search ? `${pathname}?${search}` : pathname;

    if (isFirstRender.current) {
      // First load: gtag script may not be ready — use retry helper
      isFirstRender.current = false;
      sendPageView(url);
    } else {
      // Client-side navigation: gtag is always ready by now
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalyticsPageViews() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
