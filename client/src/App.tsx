import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import TherapistDashboard from "@/pages/TherapistDashboard";
import ClientProfile from "@/pages/ClientProfile";
import ClientManagement from "@/pages/ClientManagement";
import PartsMapping from "@/pages/PartsMapping";
import SixFs from "@/pages/SixFs";
import LetterWrite from "@/pages/LetterWrite";
import Lessons from "@/pages/Lessons";
import LessonView from "@/pages/LessonView";
import Curriculum from "@/pages/Curriculum";
import CurriculumView from "@/pages/CurriculumView";
import SharedSessionWorkspace from "@/pages/SharedSessionWorkspace";
import MediaLibrary from "@/pages/MediaLibrary";
import IFSLibrary from "@/pages/IFSLibrary";
import IFSAnxietyLibrary from "@/pages/IFSAnxietyLibrary";
import AnxietyPartsMapping from "@/pages/AnxietyPartsMapping";
import DailyAnxietyCheckIn from "@/pages/DailyAnxietyCheckIn";
import BodySensationsMap from "@/pages/BodySensationsMap";
import AnxietyTimeline from "@/pages/AnxietyTimeline";
import WoundToAnxietyExplorer from "@/pages/WoundToAnxietyExplorer";
import GroundingTechniquesLibrary from "@/pages/GroundingTechniquesLibrary";
import PartsDialogueJournal from "@/pages/PartsDialogueJournal";
import SessionGoals from "@/pages/SessionGoals";
import TherapistNotes from "@/pages/TherapistNotes";
import NotFound from "@/pages/not-found";

function RoleBasedDashboard() {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Redirect to="/login" />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (!user || !user.role) {
      localStorage.removeItem("user");
      return <Redirect to="/login" />;
    }
    
    if (user.role === "therapist") {
      return <TherapistDashboard />;
    }
    
    return <Dashboard />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Redirect to="/login" />;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={RoleBasedDashboard} />
      <Route path="/client-management" component={ClientManagement} />
      <Route path="/clients/:clientId" component={ClientProfile} />
      <Route path="/parts-mapping" component={PartsMapping} />
      <Route path="/six-fs" component={SixFs} />
      <Route path="/letter" component={LetterWrite} />
      <Route path="/lessons" component={Lessons} />
      <Route path="/lessons/:id" component={LessonView} />
      <Route path="/curriculum" component={Curriculum} />
      <Route path="/curriculum/:moduleId" component={CurriculumView} />
      <Route path="/session/:sessionId" component={SharedSessionWorkspace} />
      <Route path="/media-library" component={MediaLibrary} />
      <Route path="/ifs-library" component={IFSLibrary} />
      <Route path="/ifs-anxiety" component={IFSAnxietyLibrary} />
      <Route path="/anxiety-parts-mapping" component={AnxietyPartsMapping} />
      <Route path="/daily-anxiety-checkin" component={DailyAnxietyCheckIn} />
      <Route path="/body-sensations-map" component={BodySensationsMap} />
      <Route path="/anxiety-timeline" component={AnxietyTimeline} />
      <Route path="/wound-to-anxiety-explorer" component={WoundToAnxietyExplorer} />
      <Route path="/grounding-techniques" component={GroundingTechniquesLibrary} />
      <Route path="/parts-dialogue" component={PartsDialogueJournal} />
      <Route path="/session-goals" component={SessionGoals} />
      <Route path="/therapist-notes" component={TherapistNotes} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
