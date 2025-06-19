import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, ToggleLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TeacherControls() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reset");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      toast({
        title: "Demonstration Reset",
        description: "All data has been cleared and counters reset.",
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
      a.download = `phishing-demo-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Session data has been downloaded as JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export session data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-3">👨‍🏫</span>
          Teacher Controls
        </h3>
        <div className="space-y-3">
          <Button
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            className="w-full bg-edu-blue hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Demonstration
          </Button>
          
          <Button
            onClick={exportData}
            variant="outline"
            className="w-full border-safety-green text-safety-green hover:bg-safety-green hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Session Data
          </Button>

          <Button
            variant="outline"
            className="w-full border-warning-orange text-warning-orange hover:bg-warning-orange hover:text-white"
            onClick={() => {
              toast({
                title: "Educational Mode",
                description: "This tool is always in educational mode with safety features enabled.",
              });
            }}
          >
            <ToggleLeft className="h-4 w-4 mr-2" />
            Educational Mode (Always On)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
