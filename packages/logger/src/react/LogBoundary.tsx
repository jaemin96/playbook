"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { createLogger } from "../index";

interface Props {
  name: string;
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * 에러 바운더리 + 로거.
 * react-error-boundary 없이 React 내장 class component로 구현.
 */
export class LogBoundary extends Component<Props, State> {
  private log = createLogger(`boundary:${this.props.name}`);

  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    // Next.js HTTP 에러(404 등)는 LogBoundary가 처리하지 않고 다시 던진다
    if (error.message.startsWith("NEXT_HTTP_ERROR_FALLBACK")) throw error;
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.log.error("caught error", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
