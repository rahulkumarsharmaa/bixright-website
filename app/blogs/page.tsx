"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useSite } from "../context/siteSetting";

interface WpBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image?: string;
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

const getFirstImageFromContent = (html: string) => {
  if (!html) return "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : "";
};

export default function BlogsPage() {
  const { siteData } = useSite();
  const [posts, setPosts] = useState<WpBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?per_page=9&_embed`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );
        if (!res.ok) {
          throw new Error("Unable to load blogs right now.");
        }

        const data = await res.json();

        if (!mounted) return;

        const normalizedPosts = data.map((item: any) => ({
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
          image:
            item._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
              ?.medium_large?.source_url ||
            item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            getFirstImageFromContent(item.content?.rendered || "") ||
            "",
          category: "Blog",
        }));

        setPosts(normalizedPosts);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name === "AbortError") return;
        setError(
          "We could not fetch the latest blog posts from the WordPress feed.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const featuredPost = posts[0];
  const listedPosts = posts.slice(1);

  return (
    <div className="bg-[#f5f8ff] text-slate-950 font-sans">
      <title>
        {siteData.siteName
          ? `${siteData.siteName} | Blogs`
          : "Bixright | Blogs"}
      </title>
      <meta
        name="description"
        content={`Explore the latest blog posts from ${siteData.siteName || "Bixright"}.`}
      />
      <meta
        property="og:title"
        content={
          siteData.siteName
            ? `${siteData.siteName} | Blogs`
            : "Bixright | Blogs"
        }
      />
      <meta
        property="og:description"
        content={`Read fresh insights and articles from ${siteData.siteName || "Bixright"}.`}
      />

      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-brand/10 blur-3xl" />
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex justify-center text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span className="mx-3">→</span>
            <span className="text-brand font-semibold">Blogs</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center justify-center rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold tracking-[0.16em] text-brand uppercase mb-6 lg:justify-start">
                Insights & blogs
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[0.92]">
                Discover Fresh <span className="text-brand">Blogs</span>
                <br className="hidden md:block" />
                From {siteData?.siteName || "Bixright"}
              </h1>
              <p className="mt-6 max-w-3xl text-base md:text-lg text-slate-600 leading-8 mx-auto lg:mx-0">
                Browse the latest posts from our WordPress blog feed and stay
                updated with fresh insights, tips, and ecommerce blogs.
              </p>
            </div>

            <div className="rounded-4xl bg-white border border-slate-200/80 p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-brand text-white shadow-lg shadow-brand/20">
                  <Sparkles size={24} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-brand/80">
                    Featured
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">
                    Fresh updates everyday
                  </p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-slate-600">
                Discover the newest stories from our WordPress feed in a clean,
                modern layout. Every blog entry is pulled automatically and
                presented with clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="rounded-[2rem] bg-white px-8 py-12 text-center text-brand shadow-sm border border-slate-200">
            Loading latest posts...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] bg-white px-8 py-12 text-center text-brand shadow-sm border border-slate-200">
            {error}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] bg-slate-950 text-white p-10 shadow-xl border border-slate-800"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-brand mb-6">
                  <Sparkles size={16} />
                  Latest Story
                </div>

                {featuredPost ? (
                  <>
                    <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-300 text-lg leading-8 mb-6">
                      {featuredPost.excerpt ||
                        "Read the full article on the live WordPress blog."}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
                      <span>{siteData?.siteName || "Bixright"}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Link
                      href={`/blogs/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    >
                      Read Full Story
                      <ArrowRight size={18} />
                    </Link>
                  </>
                ) : (
                  <p className="text-slate-400">
                    No blog posts available right now.
                  </p>
                )}
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7 }}
                className="grid gap-6"
              >
                <div className="rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200/70 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand text-white">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                        What to expect
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        Smart ecommerce insights
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-slate-600">
                    <p>
                      Carefully selected article previews with a clean, readable
                      layout.
                    </p>
                    <p>
                      Easy access to the latest WordPress posts without clutter.
                    </p>
                    <p>Fast load states and modern mobile-friendly cards.</p>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-brand-light border border-brand/20 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-brand/80">
                        Easy access
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        Updated automatically
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">
                    Each post is fetched from WordPress and displayed instantly
                    so you always see the latest content.
                  </p>
                </div>
              </m.div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {listedPosts.map((post) => (
                <m.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.55 }}
                  className="group rounded-[1.25rem] border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:shadow-lg"
                >
                  {post.image ? (
                    <div className="h-88 w-full overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : null}

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-brand/80">
                      <span className="rounded-full bg-brand/10 px-3 py-1 font-semibold text-brand">
                        Blog
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock3 size={14} /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-950 mb-3 group-hover:text-brand transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 leading-7 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{post.date.split("T")[0]}</span>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="inline-flex items-center gap-2 font-semibold text-brand"
                      >
                        Read more
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </m.article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
