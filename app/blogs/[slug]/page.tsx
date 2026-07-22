"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowLeft, Clock3, BookOpen, Sparkles } from "lucide-react";
import { useSite } from "../../context/siteSetting";

interface WpBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
}

const stripHtml = (value: string) => {
  if (!value) return "";

  const withoutTags = value.replace(/<[^>]*>/g, " ");
  const decoded = withoutTags
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—");

  return decoded.replace(/\s+/g, " ").trim();
};

const toReadTime = (value: string) => {
  const words = stripHtml(value).split(/\s+/).filter(Boolean).length;
  const mins = Math.max(2, Math.ceil(words / 180));
  return `${mins} min read`;
};

export default function BlogDetailPage() {
  const { siteData } = useSite();
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [post, setPost] = useState<WpBlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadPost = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://blogs.camlenio.com/wp-json/wp/v2/posts?slug=${slug}&_fields=id,slug,title,excerpt,content,link,date`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Unable to load this blog post.");
        }

        const data = await res.json();

        if (!mounted) return;

        if (!Array.isArray(data) || data.length === 0) {
          setPost(null);
          setError("This blog post could not be found.");
          return;
        }

        const item = data[0];

        setPost({
          slug: item.slug,
          title: stripHtml(item.title?.rendered || "Untitled"),
          excerpt: stripHtml(
            item.excerpt?.rendered || item.content?.rendered || "",
          ),
          content: item.content?.rendered || "",
          date: item.date || "",
          readTime: toReadTime(
            item.content?.rendered || item.excerpt?.rendered || "",
          ),
          category: "Blog",
        });
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name === "AbortError") return;
        setError("We could not load this blog post right now.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light text-brand flex items-center justify-center">
        Loading article...
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-brand-light text-brand font-sans">
      <title>
        {siteData.siteName
          ? `${siteData.siteName} | ${post.title}`
          : `Bixright | ${post.title}`}
      </title>
      <meta name="description" content={post.excerpt} />

      <section className="w-full px-4 sm:px-6 lg:px-10 xl:px-8 pt-10 pb-10 md:pt-12 md:pb-16 mx-auto max-w-[1600px]">
        <div className="w-full">
          <m.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-brand mb-8"
          >
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span>&rarr;</span>
            <Link href="/blogs" className="hover:text-black transition-colors">
              Blogs
            </Link>
            <span>&rarr;</span>
            <span className="text-brand font-medium">{post.title}</span>
          </m.nav>

          <m.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-brand/20 rounded-4xl shadow-sm overflow-hidden w-full max-w-none mx-auto"
          >
            <div className="bg-black text-brand-light p-8 md:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 bg-brand/20 text-brand-light px-3 py-1 rounded-full text-sm font-semibold mb-5">
                <Sparkles size={16} />
                {post.category}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                {post.title}
              </h1>
              <p className="text-brand-light/80 text-lg max-w-3xl leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-brand-light/75">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  {siteData?.siteName || "Bixright"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {post.readTime}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-10 lg:p-12">
              <div
                className="prose prose-lg max-w-none text-black/80 leading-8 [&_p]:mb-5 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_img]:rounded-2xl [&_img]:my-6 [&_img]:w-full [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-brand-light font-semibold transition-transform hover:scale-[1.02]"
                >
                  <ArrowLeft size={18} />
                  Back to Blogs
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brand/20 text-brand font-semibold hover:bg-brand/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </m.article>
        </div>
      </section>
    </div>
  );
}
