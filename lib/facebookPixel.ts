export const FACEBOOK_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const pageview = () => {
  if (typeof window === "undefined" || !window.fbq || !FACEBOOK_PIXEL_ID) {
    return;
  }

  window.fbq("track", "PageView");
};

export const track = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (typeof window === "undefined" || !window.fbq || !FACEBOOK_PIXEL_ID) {
    return;
  }

  window.fbq("track", eventName, params);
};
