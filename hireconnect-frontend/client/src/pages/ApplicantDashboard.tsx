import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, FileText, MessageSquare, LogOut } from "lucide-react";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { trpc } from "@/lib/trpc";

export default function ApplicantDashboard() {
  const { user, loading, logout, isApplicant } = useAuthContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isApplicant) {
      setLocation("/applicant/login");
    }
  }, [loading, isApplicant, setLocation]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user || !isApplicant) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/applicant/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HireConnect</h1>
              <p className="text-gray-600 mt-1">Welcome, {user.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Browse Jobs Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Browse Jobs
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Explore available job positions and apply now
            </p>
            <Button
              onClick={() => setLocation("/applicant/jobs")}
              className="w-full"
            >
              View Jobs
            </Button>
          </Card>

          {/* My Applications Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              My Applications
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Track the status of your job applications
            </p>
            <Button
              onClick={() => setLocation("/applicant/applications")}
              className="w-full"
            >
              View Applications
            </Button>
          </Card>

          {/* Messages Card */}
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Inbox
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Check messages from recruiters and admins
            </p>
            <Button
              onClick={() => setLocation("/applicant/inbox")}
              className="w-full"
            >
              View Inbox
            </Button>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="text-lg text-gray-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {user.mobile || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Date of Birth
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {user.dob
                  ? new Date(user.dob).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Member Since
              </label>
              <p className="text-lg text-gray-900 mt-1">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
