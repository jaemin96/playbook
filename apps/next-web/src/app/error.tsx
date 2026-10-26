"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  console.log({ error, digest: error.digest });

  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}
