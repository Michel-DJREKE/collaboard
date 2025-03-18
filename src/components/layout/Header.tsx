
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Plus,
  Moon, 
  Sun,
  Check,
  Filter
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Tableau de bord';
      case '/projects':
        return 'Projets';
      case '/tasks':
        return 'Tâches';
      case '/discussions':
        return 'Discussions';
      case '/files':
        return 'Fichiers';
      case '/stats':
        return 'Statistiques';
      case '/settings':
        return 'Paramètres';
      default:
        return 'TASKI';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
        
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-10 w-[280px] bg-secondary focus-visible:ring-taski-blue"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          className="hidden md:flex items-center gap-2 border-dashed"
        >
          <Plus size={16} />
          <span>Créer</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
        >
          <Bell size={20} />
          <Badge 
            className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs bg-taski-accent-red"
          >
            3
          </Badge>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://avatars.githubusercontent.com/u/12345678" />
                <AvatarFallback className="bg-taski-blue text-white text-xs">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-fade-in">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-muted-foreground">john@taski.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-taski-accent-red">
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
