import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PhishingScenarioProps {
  scenario: "gmail" | "facebook" | "banking";
}

export default function PhishingScenario({ scenario }: PhishingScenarioProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const captureMutation = useMutation({
    mutationFn: async (data: { scenario: string; capturedData: string; userAgent?: string }) => {
      const response = await apiRequest("POST", "/api/phishing-attempts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      showEducationalAlert();
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const captureData = {
      scenario,
      capturedData: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
      }),
      userAgent: navigator.userAgent,
    };

    captureMutation.mutate(captureData);
  };

  const showEducationalAlert = () => {
    toast({
      title: "🎣 You've Been 'Phished'!",
      description: "This demonstrates how easily personal information can be captured. In a real attack, your data would now be in the hands of criminals.",
      duration: 8000,
    });
  };

  const renderGmailScenario = () => (
    <div className="max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 mb-4">
          <span className="text-4xl">📧</span>
          <span className="text-2xl font-light text-gray-700">Gmail</span>
          <Badge variant="destructive">FAKE</Badge>
        </div>
        <h2 className="text-xl text-gray-800 mb-2">Sign in to your account</h2>
        <p className="text-gray-600 text-sm text-red-600">Urgent: Your account will be suspended in 24 hours</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Email address</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Password</Label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={captureMutation.isPending}>
          Sign In Now
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Secured by gmaiI-security-center.com</p>
        <p className="text-xs text-red-600 mt-2">⚠️ Notice the suspicious URL and urgency tactics</p>
      </div>
    </div>
  );

  const renderFacebookScenario = () => (
    <div className="max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 mb-4">
          <span className="text-4xl text-blue-600">📱</span>
          <span className="text-2xl font-bold text-blue-600">facebook</span>
          <Badge variant="destructive">FAKE</Badge>
        </div>
        <h2 className="text-xl text-gray-800 mb-2">You have 3 new messages!</h2>
        <p className="text-gray-600 text-sm">Log in to see who's trying to reach you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Email address or phone number"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={(e) => handleInputChange("password", e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold" disabled={captureMutation.isPending}>
          Log In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">URL: faceb0ok-messages.net/login</p>
        <p className="text-xs text-red-600 mt-2">⚠️ Notice the fake domain and social pressure</p>
      </div>
    </div>
  );

  const renderBankingScenario = () => (
    <div className="max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 mb-4">
          <span className="text-4xl text-green-600">🏦</span>
          <span className="text-2xl font-bold text-green-600">SecureBank</span>
          <Badge variant="destructive">FAKE</Badge>
        </div>
        <h2 className="text-xl text-red-600 mb-2">⚠️ Security Alert</h2>
        <p className="text-gray-600 text-sm">Suspicious activity detected. Verify your account immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Account Number</Label>
          <Input
            type="text"
            placeholder="Enter account number"
            value={formData.account || ""}
            onChange={(e) => handleInputChange("account", e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">PIN</Label>
          <Input
            type="password"
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            value={formData.pin || ""}
            onChange={(e) => handleInputChange("pin", e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Social Security Number</Label>
          <Input
            type="text"
            placeholder="XXX-XX-XXXX"
            value={formData.ssn || ""}
            onChange={(e) => handleInputChange("ssn", e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={captureMutation.isPending}>
          Verify Account Now
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">securebank-verification.org</p>
        <p className="text-xs text-red-600 mt-2">⚠️ Banks never ask for sensitive info via email</p>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="min-h-96">
          {scenario === "gmail" && renderGmailScenario()}
          {scenario === "facebook" && renderFacebookScenario()}
          {scenario === "banking" && renderBankingScenario()}
        </div>
      </CardContent>
    </Card>
  );
}
