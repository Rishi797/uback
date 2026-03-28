import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, Download, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  selected: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminApplicationDetail() {
  const { user, loading, isAdmin } = useAuthContext();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/application/:applicationId");

  const applicationId = params?.applicationId
    ? parseInt(params.applicationId)
    : null;

  const { data: application, isLoading } = trpc.applications.getById.useQuery(
    { id: applicationId! },
    { enabled: !!applicationId }
  );

  useEffect(() => {
    if (!loading && !isAdmin) {
      setLocation("/admin/login");
    }
  }, [loading, isAdmin, setLocation]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user || !isAdmin || !application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin/applications")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600 mt-1">
                Application ID: {application.id}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {application.visionName || "Application"}
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  statusColors[application.status] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {application.status.charAt(0).toUpperCase() +
                  application.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600">
              Applied on {new Date(application.appliedAt).toLocaleDateString()}
            </p>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  City
                </label>
                <p className="text-lg text-gray-900 mt-1">{application.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Branch
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {application.branch || "Not provided"}
                </p>
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Professional Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Skills
                </label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {application.skills}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Years of Experience
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {application.experience} years
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Company
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {application.lastCompany || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    LinkedIn Profile
                  </label>
                  <p className="text-gray-900 mt-1">
                    {application.linkedin ? (
                      <a
                        href={application.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 break-all"
                      >
                        {application.linkedin}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Relocation Willing
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {application.relocation || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Career Vision */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Career Vision
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Vision Name
                </label>
                <p className="text-gray-900 mt-1">
                  {application.visionName || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Vision Skills
                </label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {application.visionSkills || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Vision Description
                </label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {application.visionDescription || "Not provided"}
                </p>
              </div>
            </div>
          </Card>

          {/* Resume */}
          {application.resumeUrl && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Resume
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {application.resumeKey || "Resume"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {application.resumeUrl}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    application.resumeUrl &&
                    window.open(application.resumeUrl, "_blank")
                  }
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          )}

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  setLocation(`/admin/messages/${application.id}`)
                }
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/applications")}
              >
                Back to Applications
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
