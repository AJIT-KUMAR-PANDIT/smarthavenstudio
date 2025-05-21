"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Fingerprint, KeyRound } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SecuritySettings() {
  const { isPinSet, setPin: updateAuthPin, verifyPin } = useAuth();
  const [enableBiometrics, setEnableBiometrics] = useState(false); // Mocked state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleChangePin = () => {
    if (!isPinSet) {
      router.push('/set-pin'); // Redirect to set initial PIN if not set
      return;
    }

    if (!verifyPin(currentPin)) {
      toast({ title: "Error", description: "Current PIN is incorrect.", variant: "destructive" });
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({ title: "Error", description: "New PIN must be 4 digits.", variant: "destructive" });
      return;
    }
    if (newPin !== confirmNewPin) {
      toast({ title: "Error", description: "New PINs do not match.", variant: "destructive" });
      return;
    }
    updateAuthPin(newPin);
    toast({ title: "PIN Changed", description: "Your app lock PIN has been updated." });
    setCurrentPin("");
    setNewPin("");
    setConfirmNewPin("");
  };

  const handleToggleBiometrics = (checked: boolean) => {
    if (checked && !isPinSet) {
        toast({ title: "PIN Required", description: "Please set up a PIN before enabling biometrics.", variant: "destructive"});
        return;
    }
    setEnableBiometrics(checked);
    toast({ 
        title: `Biometrics ${checked ? 'Enabled' : 'Disabled'}`, 
        description: `Biometric authentication is now ${checked ? 'active' : 'inactive'} (feature mocked).`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your application security preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2"><KeyRound className="h-5 w-5 text-primary"/> App Lock PIN</h4>
          {isPinSet ? (
            <>
              <p className="text-sm text-muted-foreground">Change your 4-digit app lock PIN.</p>
              <div className="space-y-2">
                <Input type="password" placeholder="Current PIN" value={currentPin} onChange={e => setCurrentPin(e.target.value)} maxLength={4} />
                <Input type="password" placeholder="New PIN" value={newPin} onChange={e => setNewPin(e.target.value)} maxLength={4} />
                <Input type="password" placeholder="Confirm New PIN" value={confirmNewPin} onChange={e => setConfirmNewPin(e.target.value)} maxLength={4} />
              </div>
              <Button onClick={handleChangePin}>Change PIN</Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Set up a 4-digit PIN to secure your app.</p>
              <Button onClick={() => router.push('/set-pin')}>Set Up PIN</Button>
            </>
          )}
        </div>

        <div className="space-y-2">
           <h4 className="font-medium flex items-center gap-2"><Fingerprint className="h-5 w-5 text-primary"/> Biometric Authentication</h4>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <label htmlFor="biometrics-switch" className="text-sm font-medium">
                Enable Biometric Login
              </label>
              <p className="text-xs text-muted-foreground">
                Use fingerprint or face recognition to unlock the app.
              </p>
            </div>
            <Switch 
                id="biometrics-switch" 
                checked={enableBiometrics} 
                onCheckedChange={handleToggleBiometrics}
                disabled={!isPinSet && !enableBiometrics} // Disable if PIN not set, unless trying to turn it off
            />
          </div>
           {!isPinSet && <p className="text-xs text-destructive">A PIN must be set before enabling biometrics.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
