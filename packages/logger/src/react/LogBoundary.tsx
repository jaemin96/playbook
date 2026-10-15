import { Component, type ErrorInfo, type ReactNode } from "react";
import { createLogger } from "../index.js";

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

  static getDerivedStateFromError(): State {
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
