import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, MessageSquare, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  selected: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicantApplications() {
  const { user, loading, isApplicant } = useAuthContext();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading } =
    trpc.applications.myApplications.useQuery();

  useEffect(() => {
    if (!loading && !isApplicant) {
      setLocation("/applicant/login");
    }
  }, [loading, isApplicant, setLocation]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user || !isApplicant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/applicant/dashboard")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Track the status of your job applications
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!applications || applications.length === 0 ? (
          <Card className="p-12 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any applications yet. Start by browsing
              available jobs.
            </p>
            <Button onClick={() => setLocation("/applicant/jobs")}>
              Browse Jobs
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.visionName || "Application"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[app.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Position:</strong> {app.visionName}
                      </p>
                      <p>
                        <strong>Applied:</strong>{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>City:</strong> {app.city}
                      </p>
                      <p>
                        <strong>Experience:</strong> {app.experience} years
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocation(`/applicant/application/${app.id}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocation(`/applicant/messages/${app.id}`)
                      }
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Messages
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
