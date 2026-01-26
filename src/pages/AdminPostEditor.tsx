import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft, Save, Eye, Upload } from "lucide-react";
import alpLogo from "@/assets/alp-logo.png";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  slug: z.string().min(1, "Slug is required").max(200, "Slug must be less than 200 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional(),
  content: z.string().min(1, "Content is required"),
  meta_title: z.string().max(60, "Meta title should be under 60 characters").optional(),
  meta_description: z.string().max(160, "Meta description should be under 160 characters").optional(),
});

interface PostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
}

const AdminPostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [post, setPost] = useState<PostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image_url: "",
    meta_title: "",
    meta_description: "",
    published: false,
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/admin/login");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }

      setCheckingAuth(false);
      
      if (!isNew && id) {
        fetchPost(id);
      }
    };

    checkAdminAccess();
  }, [id, isNew, navigate]);

  const fetchPost = async (postId: string) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", postId)
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Post not found.",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }

    setPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || "",
      content: data.content,
      featured_image_url: data.featured_image_url || "",
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      published: data.published,
    });
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setPost((prev) => ({
      ...prev,
      title: newTitle,
      slug: isNew ? generateSlug(newTitle) : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `featured/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    setPost((prev) => ({ ...prev, featured_image_url: publicUrl }));
    setUploading(false);
    toast({
      title: "Image uploaded",
      description: "Featured image has been uploaded.",
    });
  };

  const handleSave = async (publish: boolean = false) => {
    // Validate
    const validation = postSchema.safeParse({
      ...post,
      excerpt: post.excerpt || undefined,
      meta_title: post.meta_title || undefined,
      meta_description: post.meta_description || undefined,
    });

    if (!validation.success) {
      toast({
        title: "Validation Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const postData = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      featured_image_url: post.featured_image_url || null,
      meta_title: post.meta_title || null,
      meta_description: post.meta_description || null,
      published: publish ? true : post.published,
      published_at: publish && !post.published ? new Date().toISOString() : undefined,
    };

    let error;

    if (isNew) {
      const result = await supabase.from("blog_posts").insert(postData);
      error = result.error;
    } else {
      const result = await supabase.from("blog_posts").update(postData).eq("id", id);
      error = result.error;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: publish ? "Published!" : "Saved!",
        description: publish ? "Your post is now live." : "Draft has been saved.",
      });
      navigate("/admin");
    }

    setSaving(false);
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
              <img src={alpLogo} alt="ALP" className="h-8" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="premium" onClick={() => handleSave(true)} disabled={saving}>
                <Eye className="w-4 h-4 mr-2" />
                {post.published ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{isNew ? "New Post" : "Edit Post"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={post.title}
                    onChange={handleTitleChange}
                    placeholder="Enter post title..."
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                    placeholder="post-url-slug"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: /blog/{post.slug || "post-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={post.excerpt}
                    onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                    placeholder="Brief description for previews..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor
                    content={post.content}
                    onChange={(content) => setPost({ ...post, content })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.featured_image_url && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={post.featured_image_url}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-input rounded-lg hover:border-primary transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-url">Or enter URL</Label>
                  <Input
                    id="image-url"
                    value={post.featured_image_url}
                    onChange={(e) => setPost({ ...post, featured_image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">
                    Meta Title
                    <span className="text-muted-foreground text-xs ml-2">
                      ({post.meta_title.length}/60)
                    </span>
                  </Label>
                  <Input
                    id="meta-title"
                    value={post.meta_title}
                    onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                    placeholder="Custom title for search results..."
                    maxLength={60}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-description">
                    Meta Description
                    <span className="text-muted-foreground text-xs ml-2">
                      ({post.meta_description.length}/160)
                    </span>
                  </Label>
                  <Textarea
                    id="meta-description"
                    value={post.meta_description}
                    onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                    placeholder="Description for search results..."
                    rows={3}
                    maxLength={160}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="published">Published</Label>
                  <Switch
                    id="published"
                    checked={post.published}
                    onCheckedChange={(checked) => setPost({ ...post, published: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPostEditor;
