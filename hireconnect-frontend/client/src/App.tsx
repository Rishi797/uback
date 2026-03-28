import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import Home from "./pages/Home";
import ApplicantLogin from "./pages/ApplicantLogin";
import AdminLogin from "./pages/AdminLogin";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobsListing from "./pages/JobsListing";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicantApplications from "./pages/ApplicantApplications";
import AdminApplications from "./pages/AdminApplications";
import MessagesPage from "./pages/MessagesPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ApplicantInbox from "./pages/ApplicantInbox";
import AdminApplicationDetail from "./pages/AdminApplicationDetail";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/applicant/login"} component={ApplicantLogin} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/applicant/dashboard"} component={ApplicantDashboard} />
      <Route path={"/applicant/jobs"} component={JobsListing} />
      <Route path={"/applicant/apply/:jobId"} component={ApplicationForm} />
      <Route path={"/applicant/applications"} component={ApplicantApplications} />
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/admin/applications"} component={AdminApplications} />
      <Route path={"/*/messages/:applicationId"} component={MessagesPage} />
      <Route path={"/admin/analytics"} component={AnalyticsDashboard} />
      <Route path={"/applicant/inbox"} component={ApplicantInbox} />
      <Route path={"/admin/application/:applicationId"} component={AdminApplicationDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <DarkModeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </DarkModeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
