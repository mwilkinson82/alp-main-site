import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Loader2 } from "lucide-react";

const PRODUCTS = [
  // Legacy products (still valid for existing purchases)
  { key: "7sYeVeaO52iGgMo4n8eQM0J", name: "Power Hour (1 Month) [Legacy]" },
  { key: "bJe6oI8FX2iG9jW4n8eQM0I", name: "Power Hour (6 Months) [Legacy]" },
  // New standalone products
  { key: "PH_MONTHLY_V2", name: "Power Hour (Monthly — $997)" },
  { key: "PH_QUARTER_V2", name: "Power Hour (Quarter — $2,997)" },
  { key: "CS_MONTHLY", name: "Contractor School (Monthly — $497/mo)" },
  { key: "CS_QUARTER", name: "Contractor School (Quarter — $1,497)" },
  { key: "SM_MONTHLY", name: "Sales & Marketing School (Monthly — $497/mo)" },
  { key: "SM_QUARTER", name: "Sales & Marketing School (Quarter — $1,497)" },
  // Other products
  { key: "8x2bJ28FXg9wgMo1aWeQM0K", name: "Handbook Special (1 Month)" },
  { key: "8x2dRa1dvg9w1RudXIeQM0T", name: "ALP University" },
  { key: "bJeaEYe0h9L8ao0g5QeQM0R", name: "1-on-1 Coaching (Single Session)" },
  { key: "14A5kEf4l0ay7bOaLweQM0Q", name: "1-on-1 Coaching (6-Session Intensive)" },
  { key: "cNi4gA1dvbTg1Ru5rceQM0S", name: "Ask Marshall" },
];

interface RetryFulfillmentDialogProps {
  purchaseId: string;
  customerName: string;
  customerEmail: string;
  currentProductName: string | null;
  onSuccess: () => void;
}

export function RetryFulfillmentDialog({
  purchaseId,
  customerName,
  customerEmail,
  currentProductName,
  onSuccess,
}: RetryFulfillmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Try to auto-select the product based on name
  const autoProduct = PRODUCTS.find((p) => p.name === currentProductName);

  const handleRetry = async () => {
    const productKey = selectedProduct || autoProduct?.key;
    if (!productKey) {
      toast({ title: "Select a product", description: "Please select which product to fulfill.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("manual-fulfill", {
        body: {
          customer_name: customerName,
          customer_email: customerEmail,
          product_key: productKey,
          purchase_log_id: purchaseId,
        },
      });

      if (response.error) throw new Error(response.error.message);

      const result = response.data;
      if (result.success) {
        toast({
          title: "Fulfillment Complete",
          description: `Email: ${result.welcome_email_sent ? "✅" : "❌"} | Kajabi: ${result.kajabi_provisioned ? "✅" : "❌"}`,
        });
        setOpen(false);
        onSuccess();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err: any) {
      toast({ title: "Retry Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <RotateCcw className="w-3 h-3" />
          Retry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retry Fulfillment</DialogTitle>
          <DialogDescription>
            Re-send the welcome email and provision Kajabi for <strong>{customerName}</strong> ({customerEmail}).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Product</label>
          <Select value={selectedProduct || autoProduct?.key || ""} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select product..." />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.key} value={p.key}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleRetry} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
            {loading ? "Processing..." : "Retry Fulfillment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
