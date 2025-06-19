import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface EducationalOverlayProps {
  scenario: "gmail" | "facebook" | "banking";
  onToggle: () => void;
}

export default function EducationalOverlay({ scenario, onToggle }: EducationalOverlayProps) {
  const redFlags = {
    gmail: [
      "🔗 Suspicious URL: 'gmaiI-security-center.com' (notice the capital i)",
      "⚡ Urgency tactics: 'Account will be suspended in 24 hours'",
      "📧 Generic greeting instead of personal name",
      "🔒 Missing proper security indicators"
    ],
    facebook: [
      "🔗 Fake domain: 'faceb0ok-messages.net' (0 instead of o)",
      "👥 Social pressure: 'You have messages waiting'",
      "🎯 Designed to trigger curiosity and FOMO",
      "🔒 No secure connection indicators"
    ],
    banking: [
      "🏦 Asks for sensitive info (SSN, PIN) that banks never request",
      "⚠️ Creates false sense of urgency with 'Security Alert'",
      "🔗 Suspicious domain: 'securebank-verification.org'",
      "📧 Sent via email instead of secure banking portal"
    ]
  };

  return (
    <div className="bg-gradient-to-r from-warning-orange to-phishing-red text-white p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Eye className="h-5 w-5 mr-3" />
          <span className="font-semibold">🔍 Watch for these red flags as you interact with the fake page below:</span>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white"
        >
          Hide Overlay
        </Button>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
        {redFlags[scenario].map((flag, index) => (
          <div key={index} className="bg-white bg-opacity-20 rounded p-2">
            {flag}
          </div>
        ))}
      </div>
    </div>
  );
}
