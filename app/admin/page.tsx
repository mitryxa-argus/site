'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, DollarSign, BarChart3, LogOut, Loader2, FileText } from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import PricingEditor from "@/components/admin/PricingEditor";
import CalibrationPanel from "@/components/admin/CalibrationPanel";
import ProposalsManager from "@/components/admin/ProposalsManager";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/mx-control/login"); return; }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      } as any);

      if (!isAdmin) { router.push("/mx-control/login"); return; }
      setAuthenticated(true);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/mx-control/login");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-mono font-bold text-foreground">Mitryxa Control</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="font-mono text-xs text-muted-foreground">
            <LogOut className="w-3 h-3 mr-1" /> Sign out
          </Button>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="glass-terminal border border-primary/10">
            <TabsTrigger value="leads" className="font-mono text-xs gap-1.5">
              <Users className="w-3 h-3" /> Leads
            </TabsTrigger>
            <TabsTrigger value="pricing" className="font-mono text-xs gap-1.5">
              <DollarSign className="w-3 h-3" /> Pricing
            </TabsTrigger>
            <TabsTrigger value="calibration" className="font-mono text-xs gap-1.5">
              <BarChart3 className="w-3 h-3" /> Calibration
            </TabsTrigger>
            <TabsTrigger value="proposals" className="font-mono text-xs gap-1.5">
              <FileText className="w-3 h-3" /> Proposals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <LeadsTable />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingEditor />
          </TabsContent>

          <TabsContent value="calibration">
            <CalibrationPanel />
          </TabsContent>

          <TabsContent value="proposals">
            <ProposalsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
