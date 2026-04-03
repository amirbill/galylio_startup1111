export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;

  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    send_to: GA_ID,
  });
};

export const event = (
  action: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window === "undefined" || !window.gtag || !GA_ID) return;

  window.gtag("event", action, params);
};
