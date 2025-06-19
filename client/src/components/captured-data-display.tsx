import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function CapturedDataDisplay() {
  const queryClient = useQueryClient();

  const { data: attempts, isLoading } = useQuery({
    queryKey: ["/api/phishing-attempts"],
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/phishing-attempts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  if (isLoading || !attempts || attempts.length === 0) {
    return null;
  }

  const latestAttempt = attempts[0];
  const capturedData = JSON.parse(latestAttempt.capturedData);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-phishing-red flex items-center">
            <Database className="h-5 w-5 mr-3" />
            Captured Data - See How Easy It Was!
          </h3>
          <Button
            onClick={() => clearDataMutation.mutate()}
            variant="outline"
            size="sm"
            disabled={clearDataMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium mb-3">⚠️ This is what an attacker would have captured:</p>
          
          <div className="bg-white p-4 rounded border font-mono text-sm">
            <div><strong>Scenario:</strong> {latestAttempt.scenario}</div>
            <div><strong>Timestamp:</strong> {new Date(latestAttempt.timestamp).toLocaleString()}</div>
            <div><strong>User Agent:</strong> {latestAttempt.userAgent}</div>
            <br />
            <div><strong>Captured Fields:</strong></div>
            {Object.entries(capturedData)
              .filter(([key]) => key !== 'timestamp')
              .map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
          </div>

          <p className="text-red-700 text-sm mt-3">
            <strong>Educational Note:</strong> In a real attack, this sensitive information would be sent to criminals who could use it for identity theft, financial fraud, or account takeovers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
