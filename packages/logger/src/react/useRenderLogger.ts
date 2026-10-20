import { useEffect, useRef } from "react";
import { createLogger, type Logger } from "../index";

/**
 * 컴포넌트 렌더링을 추적한다.
 *
 * @param componentName  추적할 컴포넌트 이름 (namespace: `render:<componentName>`)
 * @param props          현재 props — 이전 값과 비교해 변경된 키를 출력한다
 *
 * @example
 * function UserCard(props: Props) {
 *   useRenderLogger("UserCard", props);
 *   ...
 * }
 */
export function useRenderLogger(componentName: string, props?: Record<string, unknown>): void {
  const log = createLogger(`render:${componentName}`);
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, unknown> | undefined>(undefined);
  // unmount 시점에도 올바른 log를 참조하도록 ref에 저장
  const logRef = useRef<Logger>(log);
  logRef.current = log;

  renderCount.current += 1;

  const changedKeys =
    props && prevProps.current
      ? Object.keys(props).filter((k) => props[k] !== prevProps.current?.[k])
      : [];

  if (renderCount.current === 1) {
    log.debug(`mount  #${renderCount.current}`, props);
  } else {
    log.debug(
      `render #${renderCount.current}`,
      changedKeys.length > 0 ? { changed: changedKeys } : "(same props)",
    );
  }

  useEffect(() => {
    return () => {
      logRef.current.debug(`unmount after #${renderCount.current} renders`);
    };
  }, []);

  prevProps.current = props;
}
