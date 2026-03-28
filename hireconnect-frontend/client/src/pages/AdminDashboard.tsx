import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, FileText, LogOut, Menu, X } from "lucide-react";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user, loading, logout, isAdmin } = useAuthContext();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      setLocation("/admin/login");
    }
  }, [loading, isAdmin, setLocation]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/admin/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: BarChart3,
      onClick: () => setLocation("/admin/dashboard"),
    },
    {
      label: "Applications",
      icon: FileText,
      onClick: () => setLocation("/admin/applications"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      onClick: () => setLocation("/admin/analytics"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">HireConnect</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Welcome, {user.name}
                </p>
              </div>
              <DarkModeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Applications Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Total Applications
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              <p className="text-sm text-gray-600 mt-2">Loading...</p>
            </Card>

            {/* Pending Applications Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Pending Review
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              <p className="text-sm text-gray-600 mt-2">Awaiting action</p>
            </Card>

            {/* Selected Candidates Card */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600">
                Selected Candidates
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              <p className="text-sm text-gray-600 mt-2">Ready for interview</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setLocation("/admin/applications")}
                className="w-full"
              >
                View All Applications
              </Button>
              <Button
                onClick={() => setLocation("/admin/analytics")}
                variant="outline"
                className="w-full"
              >
                View Analytics
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Create Job Posting
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
