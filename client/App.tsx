import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { StudentProtectedRoute, PsychologistProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import StudentChat from "./pages/StudentChat";
import StudentProfile from "./pages/StudentProfile";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route
              path="/student"
              element={
                <StudentProtectedRoute>
                  <StudentChat />
                </StudentProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <StudentProtectedRoute>
                  <StudentProfile />
                </StudentProtectedRoute>
              }
            />
            <Route
              path="/psychologist"
              element={
                <PsychologistProtectedRoute>
                  <PsychologistDashboard />
                </PsychologistProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
