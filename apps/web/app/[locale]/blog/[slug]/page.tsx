import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return (
      <div className="container mx-auto py-10 px-4">
        <article className="prose dark:prose-invert max-w-3xl mx-auto">
          <h1>{post.title}</h1>
          <div className="text-muted-foreground mb-8">{post.date}</div>
          <MDXRemote source={post.content} />
        </article>
      </div>
    );
  } catch (_e) {
    notFound();
  }
}
