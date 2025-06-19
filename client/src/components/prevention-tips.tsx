import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Flag } from "lucide-react";

export default function PreventionTips() {
  const redFlags = [
    {
      icon: "⚡",
      title: "Urgency Tactics",
      description: '"Act now or lose access!"'
    },
    {
      icon: "🔗",
      title: "Suspicious URLs",
      description: "Misspelled or fake domains"
    },
    {
      icon: "📧",
      title: "Generic Greetings",
      description: '"Dear Customer" instead of your name'
    },
    {
      icon: "📝",
      title: "Poor Grammar",
      description: "Spelling and grammar mistakes"
    }
  ];

  const preventionTips = [
    "Always check the URL carefully before entering credentials",
    "Enable two-factor authentication on all accounts",
    "Never click links in suspicious emails",
    "Type URLs directly into your browser",
    "Keep software and browsers updated"
  ];

  return (
    <div className="space-y-6">
      {/* Red Flags Checklist */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Flag className="h-5 w-5 text-phishing-red mr-3" />
            Phishing Red Flags
          </h3>
          <div className="space-y-3">
            {redFlags.map((flag, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-warning-orange text-lg mt-1">{flag.icon}</span>
                <div>
                  <div className="font-medium text-gray-800">{flag.title}</div>
                  <div className="text-sm text-gray-600">{flag.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prevention Tips */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="h-5 w-5 text-safety-green mr-3" />
            Stay Safe Online
          </h3>
          <div className="space-y-3">
            {preventionTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-safety-green mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-700">{tip}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
