
import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  CheckSquare, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardCard from '@/components/dashboard/DashboardCard';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  dueDate?: string;
  members: { name: string; initials: string; avatar?: string }[];
  tasks: { total: number; completed: number };
  tags: string[];
  color: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Refonte complète du site web de l\'entreprise avec une nouvelle identité visuelle',
    status: 'active',
    progress: 75,
    dueDate: '2023-11-30',
    members: [
      { name: 'Sophie Martin', initials: 'SM' },
      { name: 'Thomas Dubois', initials: 'TD' },
      { name: 'Marie Leroy', initials: 'ML' }
    ],
    tasks: { total: 24, completed: 18 },
    tags: ['Design', 'Frontend'],
    color: 'bg-taski-accent-green'
  },
  {
    id: '2',
    name: 'Application Mobile',
    description: 'Développement d\'une application mobile pour les clients',
    status: 'active',
    progress: 45,
    dueDate: '2023-12-15',
    members: [
      { name: 'Thomas Dubois', initials: 'TD' },
      { name: 'Lucas Bernard', initials: 'LB' },
      { name: 'Emma Petit', initials: 'EP' },
      { name: 'Paul Martin', initials: 'PM' }
    ],
    tasks: { total: 32, completed: 14 },
    tags: ['Mobile', 'React Native'],
    color: 'bg-taski-blue'
  },
  {
    id: '3',
    name: 'Campagne Marketing Q4',
    description: 'Planification et exécution de la campagne marketing pour le Q4',
    status: 'active',
    progress: 90,
    dueDate: '2023-12-01',
    members: [
      { name: 'Marie Leroy', initials: 'ML' },
      { name: 'Sophie Martin', initials: 'SM' }
    ],
    tasks: { total: 18, completed: 16 },
    tags: ['Marketing', 'Social Media'],
    color: 'bg-taski-accent-purple'
  },
  {
    id: '4',
    name: 'Mise à jour CRM',
    description: 'Migration et mise à jour du système CRM',
    status: 'completed',
    progress: 100,
    members: [
      { name: 'Lucas Bernard', initials: 'LB' },
      { name: 'Thomas Dubois', initials: 'TD' }
    ],
    tasks: { total: 12, completed: 12 },
    tags: ['Backend', 'Database'],
    color: 'bg-taski-accent-yellow'
  },
  {
    id: '5',
    name: 'Formation Interne',
    description: 'Organisation de sessions de formation pour les nouveaux outils',
    status: 'on-hold',
    progress: 20,
    dueDate: '2024-01-15',
    members: [
      { name: 'Marie Leroy', initials: 'ML' },
      { name: 'Emma Petit', initials: 'EP' }
    ],
    tasks: { total: 8, completed: 2 },
    tags: ['Formation', 'Ressources Humaines'],
    color: 'bg-taski-gray-500'
  },
  {
    id: '6',
    name: 'Documentation Technique',
    description: 'Création de la documentation technique pour les développeurs',
    status: 'active',
    progress: 30,
    dueDate: '2023-12-20',
    members: [
      { name: 'Lucas Bernard', initials: 'LB' },
      { name: 'Paul Martin', initials: 'PM' }
    ],
    tasks: { total: 15, completed: 5 },
    tags: ['Documentation', 'Technique'],
    color: 'bg-taski-accent-red'
  }
];

export default function Projects() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all');
  
  const filteredProjects = PROJECTS.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'on-hold':
        return 'En pause';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-taski-accent-green/10 text-taski-accent-green border-taski-accent-green/20';
      case 'completed':
        return 'bg-taski-blue/10 text-taski-blue border-taski-blue/20';
      case 'on-hold':
        return 'bg-taski-accent-yellow/10 text-taski-accent-yellow border-taski-accent-yellow/20';
      default:
        return 'bg-secondary text-foreground';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="active">Actifs</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
              <TabsTrigger value="on-hold">En pause</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Rechercher un projet..." 
                  className="pl-9 w-[200px] sm:w-[250px] bg-secondary focus-visible:ring-taski-blue"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Nouveau projet</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectListItem project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectListItem project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectListItem project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="on-hold" className="mt-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                    <ProjectListItem project={project} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
  
  function ProjectCard({ project }: { project: Project }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-card transition-all duration-200 hover:shadow-elevation overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: project.color.split(' ')[1] }}></div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                <DropdownMenuItem>Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-taski-accent-red">Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs bg-taski-gray-100 dark:bg-taski-gray-800">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">Progression</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="mt-5 flex items-center justify-between">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, i) => (
                <Avatar key={i} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-taski-blue text-white text-xs">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-secondary text-xs flex items-center justify-center border-2 border-background">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
          
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckSquare className="h-4 w-4 mr-1.5" />
              <span>{project.tasks.completed}/{project.tasks.total}</span>
            </div>
            
            {project.dueDate && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
            )}
          </div>
          
          <Button variant="default" className="w-full mt-4 gap-2">
            <span>Accéder au projet</span>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  function ProjectListItem({ project }: { project: Project }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-border shadow-card transition-all duration-200 hover:shadow-elevation overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
          <div className="w-1.5 self-stretch rounded-full hidden sm:block" style={{ backgroundColor: project.color.split(' ')[1] }}></div>
          
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 4).map((member, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-taski-blue text-white text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {project.members.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-secondary text-xs flex items-center justify-center border-2 border-background">
                        +{project.members.length - 4}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button variant="default" size="sm" className="gap-2">
                  <span>Accéder</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-taski-accent-red">Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {project.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs bg-taski-gray-100 dark:bg-taski-gray-800">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Progression</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckSquare className="h-4 w-4 mr-2" />
                <span>{project.tasks.completed}/{project.tasks.total} tâches complétées</span>
              </div>
              
              {project.dueDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Échéance: {formatDate(project.dueDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
