import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsDashboard() {
  const { user, loading, isAdmin } = useAuthContext();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading } = trpc.analytics.stats.useQuery();

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

  // Prepare data for charts
  const statusData = stats
    ? [
        { name: "Pending", value: stats.byStatus?.pending || 0 },
        { name: "Reviewed", value: stats.byStatus?.reviewed || 0 },
        { name: "Selected", value: stats.byStatus?.selected || 0 },
        { name: "Rejected", value: stats.byStatus?.rejected || 0 },
      ]
    : [];

  const positionData = stats?.byPosition
    ? Array.isArray(stats.byPosition)
      ? stats.byPosition
      : Object.entries(stats.byPosition).map(([position, count]) => ({
          position,
          count: typeof count === "number" ? count : 0,
        }))
    : [];

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
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">
                Application statistics and insights
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">
              Total Applications
            </h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.total || 0}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {stats?.byStatus?.pending || 0}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Selected</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats?.byStatus?.selected || 0}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats?.byStatus?.rejected || 0}
            </p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Distribution */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Applications by Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Applications by Position */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Applications by Position
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="position" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Status Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Count
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((row) => (
                  <tr key={row.name} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{row.name}</td>
                    <td className="py-3 px-4 text-gray-900">{row.value}</td>
                    <td className="py-3 px-4 text-gray-900">
                      {stats?.total
                        ? (
                            ((row.value || 0) / stats.total) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
