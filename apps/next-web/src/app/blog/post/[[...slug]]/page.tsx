import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "../data";

type PostPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = slug?.[0];
  if (!slugStr) return { title: "Not Found" };
  const post = getPost(slugStr);
  if (!post) return { title: "Not Found" };
  return { title: post.title };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const slugStr = slug?.[0];
  if (!slugStr) notFound();

  const post = getPost(slugStr);
  if (!post) notFound();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
