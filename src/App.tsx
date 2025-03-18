import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import Discussions from "./pages/Discussions";
import Files from "./pages/Files";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";

// Layout Components
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

const queryClient = new QueryClient();

// Main layout component with sidebar and header
const AppLayout = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-sm bg-taski-blue flex items-center justify-center mb-8 animate-pulse">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <div className="h-2 w-48 bg-taski-gray-200 dark:bg-taski-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-taski-blue animate-[progress_1.5s_ease-in-out_infinite]"></div>
        </div>
        <style>
          {`
            @keyframes progress {
              0% { width: 0%; transform: translateX(0); }
              50% { width: 100%; transform: translateX(0); }
              100% { width: 0%; transform: translateX(100%); }
            }
          `}
        </style>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* App Layout with nested routes */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/files" element={<Files />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
