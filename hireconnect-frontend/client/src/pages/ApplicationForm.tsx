import { useAuthContext } from "@/contexts/AuthContext";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ApplicationForm() {
  const { user, loading, isApplicant } = useAuthContext();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/applicant/apply/:jobId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>("");

  const jobId = params?.jobId ? parseInt(params.jobId) : null;

  const { data: job, isLoading: jobLoading } = trpc.jobs.getById.useQuery(
    { id: jobId! },
    { enabled: !!jobId }
  );

  const createApplicationMutation = trpc.applications.create.useMutation();

  const [formData, setFormData] = useState({
    skills: "",
    experience: 0,
    lastCompany: "",
    linkedin: "",
    relocation: "",
    city: "",
    branch: "",
    visionName: "",
    visionSkills: "",
    visionDescription: "",
    dob: "",
  });

  useEffect(() => {
    if (!loading && !isApplicant) {
      setLocation("/applicant/login");
    }
  }, [loading, isApplicant, setLocation]);

  if (loading || jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user || !isApplicant || !job) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" ? parseInt(value) || 0 : value,
    }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
      toast.success("Resume selected successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.skills.trim()) {
        toast.error("Please enter your skills");
        setIsSubmitting(false);
        return;
      }

      if (!formData.city.trim()) {
        toast.error("Please enter your city");
        setIsSubmitting(false);
        return;
      }

      let uploadedResumeUrl = resumeUrl;
      if (resumeFile && !resumeUrl) {
        uploadedResumeUrl = `resume-${Date.now()}.pdf`;
      }

      await createApplicationMutation.mutateAsync({
        jobId: job.id,
        resumeUrl: uploadedResumeUrl,
        resumeKey: resumeFile?.name,
        skills: formData.skills,
        experience: formData.experience,
        lastCompany: formData.lastCompany,
        linkedin: formData.linkedin,
        relocation: formData.relocation,
        city: formData.city,
        branch: formData.branch,
        visionName: formData.visionName,
        visionSkills: formData.visionSkills,
        visionDescription: formData.visionDescription,
        dob: formData.dob ? new Date(formData.dob) : undefined,
      });

      toast.success("Application submitted successfully!");
      setLocation("/applicant/applications");
    } catch (error: any) {
      console.error("Application error:", error);
      const errorMessage = error?.message || "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/applicant/jobs")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Apply for {job.title}
              </h1>
              <p className="text-gray-600 mt-1">{job.position}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Mumbai"
                    required
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Professional Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated) *
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, TypeScript, Node.js"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <Input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Company
                    </label>
                    <Input
                      type="text"
                      name="lastCompany"
                      value={formData.lastCompany}
                      onChange={handleInputChange}
                      placeholder="e.g., ABC Corp"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <Input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="linkedin.com/in/yourprofile"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relocation Willing
                    </label>
                    <select
                      name="relocation"
                      value={formData.relocation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Career Vision
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Name
                  </label>
                  <Input
                    type="text"
                    name="visionName"
                    value={formData.visionName}
                    onChange={handleInputChange}
                    placeholder="e.g., Full-stack Developer"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Skills
                  </label>
                  <textarea
                    name="visionSkills"
                    value={formData.visionSkills}
                    onChange={handleInputChange}
                    placeholder="Skills you want to develop"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Description
                  </label>
                  <textarea
                    name="visionDescription"
                    value={formData.visionDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your career goals"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Resume
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-600 mt-2">
                    PDF only, max 5MB
                  </p>
                </div>
                {resumeFile && (
                  <div className="mt-4 flex items-center justify-between bg-green-50 p-3 rounded">
                    <span className="text-sm text-green-800">
                      {resumeFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/applicant/jobs")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
