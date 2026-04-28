import PortalLayout from "@/components/portal/PortalLayout";
import { usePortalAuth } from "@/hooks/usePortalAuth";
import SEO from "@/components/SEO";
import RecordingsPanel from "@/components/admin/RecordingsPanel";

const AdminRecordings = () => {
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
      <SEO title="Manage Recordings | ALP Admin" description="Admin: manage class replay recordings." canonical="/admin/recordings" />
      <PortalLayout isAdmin>
        <section className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">Admin</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Manage Recordings
            </h1>
          </div>
          <RecordingsPanel />
        </section>
      </PortalLayout>
    </>
  );
};

export default AdminRecordings;
