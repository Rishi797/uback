import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, DollarSign, Users, ArrowLeft, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function JobsListing() {
  const { user, loading, isApplicant } = useAuthContext();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery();

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

  const filteredJobs = jobs?.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleApply = (jobId: number) => {
    setLocation(`/applicant/apply/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
              <p className="text-gray-600 mt-1">
                {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search jobs by title or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Job Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-indigo-600 font-medium mt-1">
                    {job.position}
                  </p>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-6">
                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                  )}
                  {job.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {job.isInternship ? "Internship" : "Full-time"}
                  </div>
                  {job.minExperience !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {job.minExperience}+ years experience
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <Button
                  onClick={() => handleApply(job.id)}
                  className="w-full"
                >
                  Apply Now
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
