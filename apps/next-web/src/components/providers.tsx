"use client";

import { LogBoundary } from "@repo/logger/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LogBoundary name="root">{children}</LogBoundary>;
}
