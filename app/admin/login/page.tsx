'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;

      // Check admin role
      const { data: roleData } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      } as any);

      if (!roleData) {
        await supabase.auth.signOut();
        setError("Access denied. Admin privileges required.");
        return;
      }

      router.push("/mx-control");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-terminal rounded-xl overflow-hidden">
        <div className="h-[2px] bg-gradient-to-r from-primary to-accent" />
        <div className="p-8 space-y-6">
          <div className="text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-xl font-mono font-bold text-foreground">Control Access</h1>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-mono text-sm"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-mono text-sm"
            />
            {error && (
              <p className="text-xs text-destructive font-mono bg-destructive/5 px-3 py-2 rounded-lg">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full font-mono">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Authenticate
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
