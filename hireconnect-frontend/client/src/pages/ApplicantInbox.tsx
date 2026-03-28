import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-800", icon: "⏳" },
  reviewed: { bg: "bg-blue-50", text: "text-blue-800", icon: "👀" },
  selected: { bg: "bg-green-50", text: "text-green-800", icon: "✅" },
  rejected: { bg: "bg-red-50", text: "text-red-800", icon: "❌" },
};

export default function ApplicantInbox() {
  const { user, loading, isApplicant } = useAuthContext();
  const [, setLocation] = useLocation();

  const { data: applications, isLoading } =
    trpc.applications.myApplications.useQuery();
  const { data: unreadMessages } = trpc.messages.unread.useQuery();
  const { data: unreadNotifications } = trpc.notifications.unread.useQuery();

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
              <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
              <p className="text-gray-600 mt-1">
                Track your applications and messages
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notifications Summary */}
        {(unreadMessages && unreadMessages.length > 0) ||
        (unreadNotifications && unreadNotifications.length > 0) ? (
          <Card className="p-6 mb-8 bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  You have updates
                </h2>
                <p className="text-blue-800">
                  {unreadMessages && unreadMessages.length > 0
                    ? `${unreadMessages.length} new message${
                        unreadMessages.length !== 1 ? "s" : ""
                      }`
                    : ""}
                  {unreadNotifications && unreadNotifications.length > 0
                    ? `${
                        unreadMessages && unreadMessages.length > 0 ? " and " : ""
                      }${unreadNotifications.length} notification${
                        unreadNotifications.length !== 1 ? "s" : ""
                      }`
                    : ""}
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        {/* Applications with Status */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Application Status
          </h2>

          {!applications || applications.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by applying to available jobs to track your progress here.
              </p>
              <Button onClick={() => setLocation("/applicant/jobs")}>
                Browse Jobs
              </Button>
            </Card>
          ) : (
            applications.map((app) => {
              const colors = statusColors[app.status] || statusColors.pending;
              return (
                <Card
                  key={app.id}
                  className={`p-6 ${colors.bg} border-l-4 ${
                    app.status === "selected"
                      ? "border-green-500"
                      : app.status === "rejected"
                        ? "border-red-500"
                        : app.status === "reviewed"
                          ? "border-blue-500"
                          : "border-yellow-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{colors.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {app.visionName || "Application"}
                        </h3>
                        <p className={`text-sm font-medium ${colors.text}`}>
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Applied</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Position</p>
                      <p className="text-gray-900 font-medium">{app.visionName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-900 font-medium">{app.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-gray-900 font-medium">
                        {app.experience} years
                      </p>
                    </div>
                  </div>

                  {/* Status-specific messages */}
                  {app.status === "selected" && (
                    <div className="bg-green-100 border border-green-300 rounded p-3 mb-4">
                      <p className="text-green-900 text-sm font-medium">
                        🎉 Congratulations! You have been selected. Check your
                        messages for next steps.
                      </p>
                    </div>
                  )}
                  {app.status === "rejected" && (
                    <div className="bg-red-100 border border-red-300 rounded p-3 mb-4">
                      <p className="text-red-900 text-sm font-medium">
                        Unfortunately, your application was not selected at this
                        time. We encourage you to apply for other positions.
                      </p>
                    </div>
                  )}
                  {app.status === "reviewed" && (
                    <div className="bg-blue-100 border border-blue-300 rounded p-3 mb-4">
                      <p className="text-blue-900 text-sm font-medium">
                        ✓ Your application has been reviewed. You may receive
                        updates soon.
                      </p>
                    </div>
                  )}
                  {app.status === "pending" && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
                      <p className="text-yellow-900 text-sm font-medium">
                        ⏳ Your application is under review. We will update you
                        soon.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLocation(`/applicant/application/${app.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
