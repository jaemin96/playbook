import type { ComponentType, ReactNode } from "react";
import { createLogger } from "../index.js";

interface ErrorBoundaryProps {
  onError?: (error: Error, info: { componentStack: string }) => void;
  fallback?: ReactNode;
  children: ReactNode;
}

interface Props {
  name: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 에러 바운더리 + 로거.
 * react-error-boundary가 설치되어 있으면 사용하고, 없으면 단순 래퍼로 동작한다.
 */
export function LogBoundary({ name, children, fallback }: Props): ReactNode {
  const log = createLogger(`boundary:${name}`);

  let ErrorBoundary: ComponentType<ErrorBoundaryProps> | null = null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const mod = require("react-error-boundary") as { ErrorBoundary: ComponentType<ErrorBoundaryProps> };
    ErrorBoundary = mod.ErrorBoundary;
  } catch {
    // react-error-boundary 미설치
  }

  if (!ErrorBoundary) return children;

  const Boundary = ErrorBoundary;

  return (
    <Boundary
      fallback={fallback ?? null}
      onError={(error: Error, info: { componentStack: string }) => {
        log.error("caught error", error, info.componentStack);
      }}
    >
      {children}
    </Boundary>
  );
}
