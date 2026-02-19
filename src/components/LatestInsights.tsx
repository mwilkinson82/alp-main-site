import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
}

const LatestInsights = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image_url, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-gradient-gold">Latest Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Strategic frameworks, negotiation insights, and execution models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden space-y-4">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))
            : posts.length === 0
            ? (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Articles coming soon. Check back shortly.
                  </p>
                </div>
              )
            : posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                  <div className="glass-card hover-lift rounded-2xl overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 bg-muted overflow-hidden flex-shrink-0">
                      {post.featured_image_url ? (
                        <img
                          src={post.featured_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "var(--gradient-gold-radial)", opacity: 0.3 }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 space-y-3">
                      {post.published_at && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(post.published_at), "MMMM d, yyyy")}
                        </div>
                      )}
                      <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary pt-1 group-hover:gap-2 transition-all">
                        Read Article
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link to="/blog">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestInsights;
