import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!id) return { title: "Not Found ID" };
  return { title: id };
}

export default async function BlogPostPageById({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <div>
      <h1>{`Post ID : ${id}`}</h1>
    </div>
  );
}
