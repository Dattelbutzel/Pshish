import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Shield } from "lucide-react";
import PhishingScenario from "@/components/phishing-scenario";
import EducationalOverlay from "@/components/educational-overlay";
import CapturedDataDisplay from "@/components/captured-data-display";
import TeacherControls from "@/components/teacher-controls";
import StatsPanel from "@/components/stats-panel";
import PreventionTips from "@/components/prevention-tips";

export default function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState<"gmail" | "facebook" | "banking">("gmail");
  const [showTeacherControls, setShowTeacherControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const scenarios = [
    {
      id: "gmail" as const,
      title: "Fake Gmail",
      subtitle: "Email Phishing",
      icon: "📧",
      color: "bg-red-50 border-red-200 text-red-700",
      activeColor: "bg-red-50 border-red-500 text-red-700",
    },
    {
      id: "facebook" as const,
      title: "Fake Social Media",
      subtitle: "Social Engineering",
      icon: "📱",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      activeColor: "bg-blue-50 border-blue-500 text-blue-700",
    },
    {
      id: "banking" as const,
      title: "Fake Banking",
      subtitle: "Financial Fraud",
      icon: "🏦",
      color: "bg-green-50 border-green-200 text-green-700",
      activeColor: "bg-green-50 border-green-500 text-green-700",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Educational Header */}
      <div className="bg-edu-blue text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Cybersecurity Education Tool</h1>
              <p className="text-blue-200 text-sm">Teaching Phishing Awareness & Internet Safety</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-safety-green hover:bg-safety-green text-white">
              EDUCATIONAL USE ONLY
            </Badge>
            <Button
              onClick={() => setShowTeacherControls(!showTeacherControls)}
              className="bg-white text-edu-blue hover:bg-gray-100"
            >
              <Settings className="h-4 w-4 mr-2" />
              Teacher Controls
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Educational Warning Banner */}
        <div className="bg-warning-orange text-white p-6 rounded-xl mb-8 border-l-4 border-orange-600">
          <div className="flex items-center">
            <div className="text-2xl mr-4">⚠️</div>
            <div>
              <h2 className="text-xl font-bold mb-2">EDUCATIONAL DEMONSTRATION ONLY</h2>
              <p className="text-orange-100">
                This tool simulates phishing attacks for educational purposes. All data entered is captured and displayed to demonstrate vulnerabilities. This should only be used in controlled educational environments.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Phishing Scenarios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scenario Selector */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🎣</span>
                  Phishing Scenarios
                </h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {scenarios.map((scenario) => (
                    <Button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      variant="outline"
                      className={`p-4 h-auto flex flex-col items-center text-center border-2 ${
                        selectedScenario === scenario.id ? scenario.activeColor : scenario.color
                      }`}
                    >
                      <div className="text-2xl mb-2">{scenario.icon}</div>
                      <div className="font-semibold">{scenario.title}</div>
                      <div className="text-sm opacity-75">{scenario.subtitle}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Educational Overlay */}
            {showOverlay && (
              <EducationalOverlay
                scenario={selectedScenario}
                onToggle={() => setShowOverlay(!showOverlay)}
              />
            )}

            {/* Phishing Simulation */}
            <PhishingScenario scenario={selectedScenario} />

            {/* Captured Data Display */}
            <CapturedDataDisplay />
          </div>

          {/* Right Column - Educational Content */}
          <div className="space-y-6">
            <StatsPanel stats={stats} />
            <PreventionTips />
            {showTeacherControls && <TeacherControls />}
          </div>
        </div>
      </div>

      {/* Educational Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-bold mb-2">🎓 Educational Purpose Only</h3>
          <p className="text-gray-300 text-sm mb-4">
            This tool is designed for cybersecurity education and awareness training. It should never be used for malicious purposes.
          </p>
          <div className="flex justify-center space-x-6 text-sm flex-wrap gap-2">
            <span>✅ Teaching Internet Safety</span>
            <span>✅ Demonstrating Security Risks</span>
            <span>✅ Building Awareness</span>
            <span>❌ Never for Malicious Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
