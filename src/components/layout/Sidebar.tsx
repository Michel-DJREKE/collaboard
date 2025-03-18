
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  BarChart2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Users,
  Calendar,
  Search,
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  to: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, text, to, isCollapsed, isActive, onClick }: SidebarItemProps) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "sidebar-item w-full flex items-center",
            isActive && "active",
            isCollapsed ? "justify-center px-3" : "justify-start"
          )}
        >
          <Icon size={20} className={cn("shrink-0", isActive ? "" : "text-muted-foreground")} />
          {!isCollapsed && <span className="ml-3 transition-opacity duration-200">{text}</span>}
        </button>
      </TooltipTrigger>
      {isCollapsed && <TooltipContent side="right">{text}</TooltipContent>}
    </Tooltip>
  </TooltipProvider>
);

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, text: "Tableau de bord", to: "/" },
    { icon: FolderKanban, text: "Projets", to: "/projects" },
    { icon: CheckSquare, text: "Tâches", to: "/tasks" },
    { icon: MessageSquare, text: "Discussions", to: "/discussions" },
    { icon: FileText, text: "Fichiers", to: "/files" },
    { icon: BarChart2, text: "Statistiques", to: "/stats" },
    { icon: Settings, text: "Paramètres", to: "/settings" }
  ];
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-sidebar border-r border-border transition-all duration-300 ease-spring",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <div className="h-6 w-6 rounded-sm bg-taski-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-lg text-taski-gray-900 dark:text-white">TASKI</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex w-full justify-center animate-fade-in">
            <div className="h-8 w-8 rounded-sm bg-taski-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex flex-col flex-grow px-3 py-6 space-y-6 overflow-y-auto">
        <div className="space-y-1.5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              text={item.text}
              to={item.to}
              isCollapsed={isCollapsed}
              isActive={pathname === item.to}
              onClick={() => navigate(item.to)}
            />
          ))}
        </div>
        
        {!isCollapsed && (
          <div className="animate-fade-in space-y-4 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground px-3 uppercase">Équipe</h3>
            <div className="space-y-1">
              <button className="sidebar-item">
                <Users size={20} className="text-muted-foreground" />
                <span className="ml-3">Membres</span>
              </button>
              <button className="sidebar-item">
                <Calendar size={20} className="text-muted-foreground" />
                <span className="ml-3">Calendrier d'équipe</span>
              </button>
            </div>
          </div>
        )}
        
        {!isCollapsed && (
          <div className="animate-fade-in space-y-4 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground px-3 uppercase">Projets récents</h3>
            <div className="space-y-1">
              <button className="sidebar-item">
                <span className="h-5 w-5 rounded-md bg-taski-accent-purple flex items-center justify-center text-white text-xs font-medium">M</span>
                <span className="ml-3">Marketing 2024</span>
              </button>
              <button className="sidebar-item">
                <span className="h-5 w-5 rounded-md bg-taski-accent-green flex items-center justify-center text-white text-xs font-medium">D</span>
                <span className="ml-3">Design System</span>
              </button>
              <button className="sidebar-item">
                <span className="h-5 w-5 rounded-md bg-taski-accent-yellow flex items-center justify-center text-white text-xs font-medium">W</span>
                <span className="ml-3">Website Redesign</span>
              </button>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
              <Plus size={16} />
              <span>Nouveau projet</span>
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-border mt-auto">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://avatars.githubusercontent.com/u/12345678" />
                  <AvatarFallback className="bg-taski-blue text-white text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">john@taski.com</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut size={18} />
              </Button>
            </>
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://avatars.githubusercontent.com/u/12345678" />
              <AvatarFallback className="bg-taski-blue text-white text-xs">JD</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
