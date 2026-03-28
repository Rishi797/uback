import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Check, X, MessageSquare, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  selected: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminApplications() {
  const { user, loading, isAdmin } = useAuthContext();
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    status: "",
    position: "",
    search: "",
  });

  const { data: applications, isLoading, refetch } =
    trpc.applications.list.useQuery(filters);

  const updateStatusMutation = trpc.applications.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Application status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

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

  if (!user || !isAdmin) {
    return null;
  }

  const handleStatusChange = (
    applicationId: number,
    newStatus: "pending" | "reviewed" | "selected" | "rejected"
  ) => {
    updateStatusMutation.mutate({
      applicationId,
      status: newStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin/dashboard")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and review job applications
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <Input
                type="text"
                value={filters.position}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                placeholder="Search by position..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by city..."
              />
            </div>
          </div>
        </Card>

        {!applications || applications.length === 0 ? (
          <Card className="p-12 text-center">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.visionName || "Application"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{app.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {app.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
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
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocation(`/admin/application/${app.id}`)
                    }
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocation(`/admin/messages/${app.id}`)
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  {app.status !== "selected" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        handleStatusChange(app.id, "selected")
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                  )}
                  {app.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleStatusChange(app.id, "rejected")
                      }
                      disabled={updateStatusMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
