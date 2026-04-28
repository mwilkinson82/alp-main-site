import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import SEO from "@/components/SEO";
import ClientsPanel from "@/components/admin/ClientsPanel";

const AdminClients = () => {
  const { loading, isAdmin } = usePortalAuth({ requireAdmin: true });

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Manage Clients | ALP Admin"
        description="Admin: invite and manage client portal access."
        canonical="/admin/clients"
      />
      <PortalLayout isAdmin>
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Manage Clients
            </h1>
            <p className="text-muted-foreground mt-2">
              Invite new clients and manage who has access to the portal.
            </p>
          </div>
          <ClientsPanel />
        </section>
      </PortalLayout>
    </>
  );
};

export default AdminClients;
