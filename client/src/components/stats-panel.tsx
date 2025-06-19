import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface StatsPanelProps {
  stats?: {
    totalAttempts: number;
    scenarioCounts: string;
  };
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const scenarioCounts = stats ? JSON.parse(stats.scenarioCounts) : { gmail: 0, facebook: 0, banking: 0 };
  const mostTargeted = Object.entries(scenarioCounts).reduce((a, b) => 
    scenarioCounts[a[0]] > scenarioCounts[b[0]] ? a : b
  )[0];

  const successRate = stats?.totalAttempts ? Math.min(78 + (stats.totalAttempts * 2), 95) : 78;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 text-edu-blue mr-3" />
          Demonstration Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Attempts Today:</span>
            <span className="font-bold text-phishing-red">{stats?.totalAttempts || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Most Targeted:</span>
            <span className="font-bold text-gray-800 capitalize">
              {mostTargeted} ({Math.round((scenarioCounts[mostTargeted] / (stats?.totalAttempts || 1)) * 100)}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Success Rate:</span>
            <span className="font-bold text-warning-orange">{successRate}%</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 flex items-start">
            <span className="mr-1">ℹ️</span>
            These stats show how effective phishing can be - that's why education is crucial!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
