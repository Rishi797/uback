import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock, Briefcase } from "lucide-react";
import { getLoginUrl } from "@/const";


export default function ApplicantLogin() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleManuLogin = () => {
    setIsLoading(true);
    const loginUrl = getLoginUrl();
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
              <Briefcase className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">HireConnect</h1>
            <p className="text-gray-600 mt-2">Applicant Portal</p>
          </div>

          {/* Login Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sign In to Your Account
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Use your Manus account to access the job application portal
              </p>
            </div>

            {/* Manus OAuth Button */}
            <Button
              onClick={handleManuLogin}
              disabled={isLoading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Sign In with Manus
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/applicant/signup")}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>

          {/* Admin Link */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Are you an admin?{" "}
              <button
                onClick={() => setLocation("/admin/login")}
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Admin login
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
