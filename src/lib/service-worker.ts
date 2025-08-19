"use client";

/**
 * Service Worker registration and management
 */

export interface ServiceWorkerConfig {
  enabled: boolean;
  swUrl: string;
  scope: string;
}

const defaultConfig: ServiceWorkerConfig = {
  enabled: process.env.NODE_ENV === "production",
  swUrl: "/sw.js",
  scope: "/",
};

/**
 * Register service worker
 */
export async function registerServiceWorker(
  config: Partial<ServiceWorkerConfig> = {}
) {
  const finalConfig = { ...defaultConfig, ...config };

  if (
    !finalConfig.enabled ||
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return null;
  }

  try {
    console.log("Registering service worker...");

    const registration = await navigator.serviceWorker.register(
      finalConfig.swUrl,
      {
        scope: finalConfig.scope,
      }
    );

    console.log("Service worker registered successfully:", registration);

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // New content is available, notify user
            notifyUpdate(registration);
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      handleServiceWorkerMessage(event);
    });

    return registration;
  } catch (error) {
    console.error("Service worker registration failed:", error);
    return null;
  }
}

/**
 * Unregister service worker
 */
export async function unregisterServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log("Service worker unregistered:", result);
      return result;
    }
    return false;
  } catch (error) {
    console.error("Service worker unregistration failed:", error);
    return false;
  }
}

/**
 * Update service worker
 */
export async function updateServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log("Service worker updated");
      return registration;
    }
    return null;
  } catch (error) {
    console.error("Service worker update failed:", error);
    return null;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: "SKIP_WAITING" });
}

/**
 * Handle service worker messages
 */
function handleServiceWorkerMessage(event: MessageEvent) {
  const { data } = event;

  switch (data.type) {
    case "CACHE_UPDATED":
      console.log("Cache updated for:", data.url);
      break;
    case "OFFLINE":
      console.log("App is offline");
      // Could show offline indicator
      break;
    case "ONLINE":
      console.log("App is online");
      // Could hide offline indicator
      break;
    default:
      console.log("Unknown service worker message:", data);
  }
}

/**
 * Notify user about available update
 */
function notifyUpdate(_registration: ServiceWorkerRegistration) {
  // Create a simple notification
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 16px;
      border-radius: 8px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    ">
      <p style="margin: 0 0 12px 0; font-size: 14px;">
        New content is available!
      </p>
      <button id="update-btn" style="
        background: #007acc;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
      ">
        Update
      </button>
      <button id="dismiss-btn" style="
        background: transparent;
        color: white;
        border: 1px solid #666;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">
        Later
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle update button
  const updateBtn = notification.querySelector("#update-btn");
  updateBtn?.addEventListener("click", () => {
    skipWaiting();
    window.location.reload();
  });

  // Handle dismiss button
  const dismissBtn = notification.querySelector("#dismiss-btn");
  dismissBtn?.addEventListener("click", () => {
    document.body.removeChild(notification);
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 10000);
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator;
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    return (await navigator.serviceWorker.getRegistration()) || null;
  } catch (error) {
    console.error("Failed to get service worker registration:", error);
    return null;
  }
}

/**
 * Send message to service worker
 */
export function sendMessageToServiceWorker(message: any) {
  if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.controller.postMessage(message);
}

/**
 * Preload critical resources via service worker
 */
export function preloadResources(urls: string[]) {
  urls.forEach((url) => {
    sendMessageToServiceWorker({
      type: "CACHE_UPDATE",
      url,
    });
  });
}

/**
 * React hook for service worker
 */
export function useServiceWorker(config?: Partial<ServiceWorkerConfig>) {
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>(null);
  const [isSupported, setIsSupported] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    setIsSupported(isServiceWorkerSupported());
    setIsOnline(navigator.onLine);

    // Register service worker
    registerServiceWorker(config).then(setRegistration);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [config]);

  return {
    registration,
    isSupported,
    isOnline,
    update: updateServiceWorker,
    unregister: unregisterServiceWorker,
    skipWaiting,
    sendMessage: sendMessageToServiceWorker,
    preloadResources,
  };
}

// Import React for the hook
import React from "react";
