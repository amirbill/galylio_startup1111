"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, FACEBOOK_PIXEL_ID } from "@/lib/facebookPixel";

function trackPageView(retries = 20) {
  if (typeof window === "undefined" || !FACEBOOK_PIXEL_ID) return;

  if (window.fbq) {
    pageview();
  } else if (retries > 0) {
    setTimeout(() => trackPageView(retries - 1), 100);
  }
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      trackPageView();
      return;
    }

    trackPageView(0);
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixelPageViews() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
