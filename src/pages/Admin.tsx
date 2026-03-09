import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, LogOut, FileText, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { RetryFulfillmentDialog } from "@/components/admin/RetryFulfillmentDialog";
import alpLogo from "@/assets/alp-logo.png";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PurchaseLog {
  id: string;
  customer_name: string;
  customer_email: string;
  product_name: string | null;
  stripe_session_id: string;
  amount_cents: number | null;
  welcome_email_sent: boolean;
  kajabi_provisioned: boolean;
  error_message: string | null;
  created_at: string;
}

const Admin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [purchases, setPurchases] = useState<PurchaseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      fetchPosts();
      fetchPurchases();
    };

    checkAdminAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, published, published_at, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts.",
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from("purchase_log")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching purchases:", error);
    } else {
      setPurchases((data as PurchaseLog[]) || []);
    }
    setPurchasesLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: `"${title}" has been deleted.`,
      });
      fetchPosts();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatAmount = (cents: number | null) => {
    if (!cents) return "-";
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (checkingAuth) {
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
              <img src={alpLogo} alt="ALP" className="h-8" />
              <span className="font-semibold text-lg">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/articles" target="_blank">
                  <Eye className="w-4 h-4 mr-2" />
                  View Articles
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts">
          <TabsList className="mb-8">
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="purchases" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Purchase Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Articles</h1>
                <p className="text-muted-foreground">Manage your articles</p>
              </div>
              <Button variant="premium" asChild>
                <Link to="/admin/posts/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  All Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
                    <Button variant="premium" asChild>
                      <Link to="/admin/posts/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(post.created_at)}</TableCell>
                          <TableCell>{formatDate(post.published_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {post.published && (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/articles/${post.slug}`} target="_blank">
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/admin/posts/${post.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(post.id, post.title)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Purchase Log</h1>
              <p className="text-muted-foreground">Track all Stripe purchases and onboarding status</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Recent Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {purchasesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading purchases...</div>
                ) : purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No purchases recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-center">Email Sent</TableHead>
                          <TableHead className="text-center">Kajabi</TableHead>
                          <TableHead>Errors</TableHead>
                          <TableHead>Actions</TableHead>
                      </TableHeader>
                      <TableBody>
                        {purchases.map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell className="whitespace-nowrap text-sm">
                              {formatDateTime(purchase.created_at)}
                            </TableCell>
                            <TableCell className="font-medium">{purchase.customer_name}</TableCell>
                            <TableCell className="text-sm">{purchase.customer_email}</TableCell>
                            <TableCell>
                              <Badge variant={purchase.product_name === "Custom / Ad-Hoc" ? "secondary" : "default"}>
                                {purchase.product_name || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatAmount(purchase.amount_cents)}</TableCell>
                            <TableCell className="text-center">
                              {purchase.welcome_email_sent ? (
                                <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {purchase.kajabi_provisioned ? (
                                <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                              ) : (
                                <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-destructive max-w-[200px] truncate">
                              {purchase.error_message || "-"}
                            </TableCell>
                            <TableCell>
                              <RetryFulfillmentDialog
                                purchaseId={purchase.id}
                                customerName={purchase.customer_name}
                                customerEmail={purchase.customer_email}
                                currentProductName={purchase.product_name}
                                onSuccess={fetchPurchases}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
