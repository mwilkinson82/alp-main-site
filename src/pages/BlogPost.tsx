import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BlogAuthor from "@/components/BlogAuthor";
import BlogArticleSchema from "@/components/BlogArticleSchema";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  updated_at: string;
  created_at: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching post:", error);
        navigate("/insights");
      } else if (!data) {
        navigate("/insights");
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: url,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-8" />
            <Skeleton className="aspect-video w-full mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `Read ${post.title} on ALP Insights`}
        ogImage={post.featured_image_url || undefined}
        canonical={`/insights/${post.slug}`}
      />
      <BlogArticleSchema
        title={post.title}
        description={post.meta_description || post.excerpt || `Read ${post.title} on ALP Insights`}
        slug={post.slug}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        featuredImage={post.featured_image_url}
      />
      <main className="min-h-screen">
        <Header />
        
        {/* Article Header */}
        <article className="pt-32 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Link */}
            <Link 
              to="/insights" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Insights
            </Link>

            {/* Title & Meta */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </header>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Author Byline */}
            <BlogAuthor />

            {/* Content */}
            <div 
              className="prose prose-base sm:prose-lg md:prose-xl max-w-none 
                prose-headings:text-foreground 
                prose-headings:mt-6 prose-headings:mb-3 
                md:prose-headings:mt-8 md:prose-headings:mb-4
                prose-p:text-foreground/80 
                prose-p:leading-7 prose-p:mb-5
                md:prose-p:leading-8 md:prose-p:mb-7
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground 
                prose-blockquote:border-primary prose-blockquote:text-muted-foreground 
                prose-blockquote:my-5 md:prose-blockquote:my-8
                prose-blockquote:pl-4 prose-blockquote:text-base md:prose-blockquote:text-lg
                prose-ul:my-4 prose-ol:my-4 md:prose-ul:my-6 md:prose-ol:my-6
                prose-ul:space-y-1.5 prose-ol:space-y-1.5 md:prose-ul:space-y-2 md:prose-ol:space-y-2
                prose-li:text-foreground/80 prose-li:leading-relaxed
                prose-img:rounded-lg prose-img:my-4 md:prose-img:my-6
                [&>*:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Mid-Content CTA */}
            <div className="my-12 relative">
              <div className="absolute inset-0 bg-[#FC3C15] opacity-20 rounded-xl blur-xl"></div>
              <div className="relative bg-[#FC3C15] backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                  Take Action Now
                </p>
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  Ready to Transform Your Business?
                </h3>
                <p className="text-white mb-6 max-w-md mx-auto">
                  Discover proven strategies and elite coaching to elevate your game.
                </p>
                <Button variant="premium" size="lg" asChild>
                  <Link to="/programs">Explore Our Programs</Link>
                </Button>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="bg-gradient-dark rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'var(--gradient-gold-radial)' }}></div>
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                    Your Next Move
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-secondary-foreground">
                    Transform Your Business Today
                  </h3>
                  <p className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto">
                    Join thousands of entrepreneurs who have elevated their game with ALP's proven frameworks and elite coaching.
                  </p>
                  <Button variant="premium" size="lg" asChild className="shadow-glow">
                    <Link to="/programs">Explore Programs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
};

export default BlogPost;
