"use client";

import { useEffect, useState } from "react";
import { usePerformanceMonitor } from "@/lib/performance";

interface PerformanceMonitorProps {
  showMetrics?: boolean;
  trackCustomMetrics?: boolean;
}

/**
 * Performance monitoring component for development
 * Shows real-time performance metrics in development mode
 */
export function PerformanceMonitor({
  showMetrics = process.env.NODE_ENV === "development",
  trackCustomMetrics = true,
}: PerformanceMonitorProps) {
  const { getMetrics, mark, measure } = usePerformanceMonitor();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!showMetrics) return;

    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      const currentMetrics = getMetrics();
      setMetrics(currentMetrics);
    }, 2000);

    return () => clearInterval(interval);
  }, [showMetrics, getMetrics]);

  useEffect(() => {
    if (!trackCustomMetrics) return;

    // Track component mount time
    mark("performance-monitor-mount");

    return () => {
      mark("performance-monitor-unmount");
      measure(
        "performance-monitor-lifetime",
        "performance-monitor-mount",
        "performance-monitor-unmount"
      );
    };
  }, [trackCustomMetrics, mark, measure]);

  if (!showMetrics) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white p-2 rounded-full text-xs font-mono opacity-50 hover:opacity-100 transition-opacity"
        title="Toggle Performance Metrics"
      >
        📊
      </button>

      {/* Metrics panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-black text-white p-4 rounded-lg max-w-sm max-h-96 overflow-auto text-xs font-mono">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Performance Metrics</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {metrics.length === 0 ? (
            <p className="text-gray-400">No metrics available yet...</p>
          ) : (
            <div className="space-y-2">
              {metrics.map((metric, index) => (
                <div key={index} className="border-b border-gray-700 pb-1">
                  <div className="flex justify-between">
                    <span className="text-blue-300">{metric.name}</span>
                    <span
                      className={`${
                        metric.rating === "good"
                          ? "text-green-400"
                          : metric.rating === "needs-improvement"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {metric.rating}
                    </span>
                  </div>
                  <div className="text-gray-300">
                    {typeof metric.value === "number"
                      ? `${metric.value.toFixed(2)}${
                          metric.name.includes("CLS") ? "" : "ms"
                        }`
                      : metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-gray-700 text-gray-400">
            <div>Memory: {getMemoryInfo()}</div>
            <div>Connection: {getConnectionInfo()}</div>
          </div>
        </div>
      )}
    </>
  );
}

function getMemoryInfo(): string {
  if (
    typeof window === "undefined" ||
    !("performance" in window) ||
    !("memory" in (window.performance as any))
  ) {
    return "N/A";
  }

  const memory = (window.performance as any).memory;
  const used = Math.round(memory.usedJSHeapSize / 1048576);
  const total = Math.round(memory.totalJSHeapSize / 1048576);

  return `${used}/${total} MB`;
}

function getConnectionInfo(): string {
  if (
    typeof window === "undefined" ||
    !("navigator" in window) ||
    !("connection" in navigator)
  ) {
    return "N/A";
  }

  const connection = (navigator as any).connection;
  return `${connection.effectiveType || "unknown"} (${
    connection.downlink || "unknown"
  }Mbps)`;
}
