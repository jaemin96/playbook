export type Post = { slug: string; title: string; content: string };

export const POSTS: Post[] = [
  { slug: "hello-world", title: "Hello World", content: "첫 번째 포스트입니다." },
  { slug: "nextjs-routing", title: "Next.js 라우팅", content: "App Router 구조 정리." },
  { slug: "server-component", title: "Server Component", content: "서버에서만 실행됩니다." },
];

export function getPost(slug: string): Post | undefined {
  console.info(`[blog] getPost slug="${slug}"`);
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) console.warn(`[blog] not found slug="${slug}"`);
  else console.info(`[blog] found title="${post.title}"`);
  return post;
}
