
import { useState, useCallback, Fragment } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  Edit, 
  Trash2,
  CheckSquare,
  Clock,
  AlertCircle,
  Search,
  List,
  LayoutGrid,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Progress } from "@/components/ui/progress";
import ProjectDialog from "@/components/projects/ProjectDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectFilter from "@/components/projects/ProjectFilter";
import ProjectTaskList from "@/components/projects/ProjectTaskList";
import ProjectMemberStats from "@/components/projects/ProjectMemberStats";
import { useTaskStore } from "@/lib/task-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  startDate?: string;
  endDate?: string;
  members: string[];
  tasksCount: {
    total: number;
    completed: number;
  };
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Refonte du site web corporate',
    description: 'Modernisation complète du site web de l\'entreprise avec nouvelle charte graphique',
    status: 'in-progress',
    progress: 60,
    startDate: '2023-09-15',
    endDate: '2023-11-30',
    members: ['1', '2', '4'],
    tasksCount: {
      total: 24,
      completed: 14
    }
  },
  {
    id: '2',
    title: 'Application mobile de suivi client',
    description: 'Développement d\'une application mobile pour le suivi des clients et des interventions',
    status: 'planning',
    progress: 20,
    startDate: '2023-10-20',
    endDate: '2024-02-15',
    members: ['2', '3'],
    tasksCount: {
      total: 18,
      completed: 4
    }
  },
  {
    id: '3',
    title: 'Système de gestion des stocks',
    description: 'Mise en place d\'un système centralisé de gestion des stocks et des approvisionnements',
    status: 'completed',
    progress: 100,
    startDate: '2023-06-01',
    endDate: '2023-09-30',
    members: ['1', '3', '4'],
    tasksCount: {
      total: 32,
      completed: 32
    }
  },
  {
    id: '4',
    title: 'Migration vers le cloud',
    description: 'Migration de l\'infrastructure on-premise vers les services cloud AWS',
    status: 'on-hold',
    progress: 45,
    startDate: '2023-08-10',
    endDate: '2023-12-15',
    members: ['2', '4'],
    tasksCount: {
      total: 16,
      completed: 7
    }
  }
];

const TEAM_MEMBERS = [
  { id: '1', name: 'Sophie Martin', avatar: null, initials: 'SM' },
  { id: '2', name: 'Thomas Dubois', avatar: null, initials: 'TD' },
  { id: '3', name: 'Marie Leroy', avatar: null, initials: 'ML' },
  { id: '4', name: 'Lucas Bernard', avatar: null, initials: 'LB' },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team'>('overview');
  const { tasks } = useTaskStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleCreateProject = () => {
    setCurrentProject(null);
    setIsDialogOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsDialogOpen(true);
  };
  
  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(project => project.id !== projectToDelete));
      setProjectToDelete(null);
      setDeleteConfirmOpen(false);
      setShowDetails(null);
      
      toast({
        title: "Projet supprimé",
        description: "Le projet a été supprimé avec succès.",
      });
    }
  };
  
  const handleSaveProject = (values: any) => {
    if (currentProject && currentProject.id) {
      setProjects(projects.map(project => 
        project.id === currentProject.id 
          ? { 
              ...project, 
              title: values.title,
              description: values.description,
              status: values.status,
              startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : undefined,
              endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : undefined,
              members: values.members
            } 
          : project
      ));
      
      toast({
        title: "Projet mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        title: values.title,
        description: values.description,
        status: values.status,
        progress: values.status === 'completed' ? 100 : values.status === 'in-progress' ? 40 : 10,
        startDate: values.startDate ? values.startDate.toISOString().split('T')[0] : undefined,
        endDate: values.endDate ? values.endDate.toISOString().split('T')[0] : undefined,
        members: values.members,
        tasksCount: {
          total: 0,
          completed: 0
        }
      };
      
      setProjects([...projects, newProject]);
      
      toast({
        title: "Projet créé",
        description: "Un nouveau projet a été ajouté avec succès.",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge variant="outline" className="bg-taski-accent-blue/10 text-taski-accent-blue border-taski-accent-blue/20">Planification</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-taski-accent-yellow/10 text-taski-accent-yellow border-taski-accent-yellow/20">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-taski-accent-green/10 text-taski-accent-green border-taski-accent-green/20">Terminé</Badge>;
      case 'on-hold':
        return <Badge variant="outline" className="bg-taski-accent-red/10 text-taski-accent-red border-taski-accent-red/20">En pause</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie';
    try {
      return format(parseISO(dateString), 'd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  const getMemberDetails = (memberId: string) => {
    return TEAM_MEMBERS.find(member => member.id === memberId) || { name: 'Inconnu', initials: '??', avatar: null };
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = !statusFilter || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (projectId: string) => {
    setShowDetails(showDetails === projectId ? null : projectId);
    // Réinitialiser à l'onglet "overview" lorsqu'on ouvre/ferme les détails
    setActiveTab('overview');
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <Card key={project.id} className="relative group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                {getStatusBadge(project.status)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditProject(project)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Modifier</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Supprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardTitle className="mt-2">{project.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Du {formatDate(project.startDate)} au {formatDate(project.endDate)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {project.tasksCount.completed} / {project.tasksCount.total} tâches
                    </span>
                  </div>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between items-center">
            <AvatarGroup limit={3}>
              {project.members.map(memberId => {
                const member = getMemberDetails(memberId);
                return (
                  <Avatar key={memberId}>
                    {member.avatar && <AvatarImage src={member.avatar} />}
                    <AvatarFallback className="bg-taski-blue text-white text-xs">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </AvatarGroup>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={() => handleViewDetails(project.id)}
            >
              {showDetails === project.id ? "Masquer détails" : "Voir détails"}
            </Button>
          </CardFooter>
          {showDetails === project.id && (
            <div className="mt-2 bg-muted/30 rounded-b-lg border-t">
              <div className="border-b">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'tasks' | 'team')} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="tasks">Tâches</TabsTrigger>
                    <TabsTrigger value="team">Équipe</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="p-4">
                <TabsContent value="overview" className="m-0 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Description</h4>
                    <p className="text-sm text-muted-foreground">{project.description || "Aucune description disponible"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Date de début</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Date de fin</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Membres du projet</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.members.map(memberId => {
                        const member = getMemberDetails(memberId);
                        return (
                          <div key={memberId} className="flex items-center gap-1 text-xs bg-background border rounded-full px-3 py-1">
                            <Avatar className="h-5 w-5">
                              {member.avatar && <AvatarImage src={member.avatar} />}
                              <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        );
                      })}
                      {project.members.length === 0 && <span className="text-sm text-muted-foreground">Aucun membre</span>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Progression</h4>
                    <div className="space-y-2">
                      <Progress value={project.progress} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Tâches: {project.tasksCount.completed}/{project.tasksCount.total}</span>
                        <span>{project.progress}% terminé</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tasks" className="m-0">
                  <ProjectTaskList projectId={project.id} />
                </TabsContent>
                
                <TabsContent value="team" className="m-0">
                  <ProjectMemberStats 
                    projectId={project.id} 
                    members={project.members.map(id => getMemberDetails(id))}
                    tasks={tasks}
                  />
                </TabsContent>
              </div>
            </div>
          )}
          <div className="absolute inset-0 rounded-lg border-2 border-primary/0 hover:border-primary/50 transition-colors pointer-events-none"></div>
        </Card>
      ))}
      
      {filteredProjects.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <p className="text-center">Aucun projet ne correspond à vos critères</p>
          <Button variant="outline" className="mt-4" onClick={() => {setSearchQuery(''); setStatusFilter(null);}}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Projet</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Tâches</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Membres</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Aucun projet ne correspond à vos critères</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredProjects.map((project) => (
              <Fragment key={project.id}>
                <TableRow className="cursor-pointer" onClick={() => handleViewDetails(project.id)}>
                  <TableCell>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="w-[60px]" />
                      <span className="text-sm">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CheckSquare className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">{project.tasksCount.completed}/{project.tasksCount.total}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Début: {formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Fin: {formatDate(project.endDate)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <AvatarGroup limit={3}>
                      {project.members.map(memberId => {
                        const member = getMemberDetails(memberId);
                        return (
                          <Avatar key={memberId} className="h-7 w-7">
                            {member.avatar && <AvatarImage src={member.avatar} />}
                            <AvatarFallback className="bg-taski-blue text-white text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {showDetails === project.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/30 px-6 py-4">
                      <div className="border-b mb-4">
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'tasks' | 'team')} className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Aperçu</TabsTrigger>
                            <TabsTrigger value="tasks">Tâches</TabsTrigger>
                            <TabsTrigger value="team">Équipe</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <TabsContent value="overview" className="m-0 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-1">Description complète</h4>
                          <p className="text-sm text-muted-foreground">{project.description || "Aucune description disponible"}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Membres du projet</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {project.members.map(memberId => {
                                const member = getMemberDetails(memberId);
                                return (
                                  <div key={memberId} className="flex items-center gap-1 text-xs bg-background border rounded-full px-3 py-1">
                                    <Avatar className="h-5 w-5">
                                      {member.avatar && <AvatarImage src={member.avatar} />}
                                      <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                                    </Avatar>
                                    <span>{member.name}</span>
                                  </div>
                                );
                              })}
                              {project.members.length === 0 && <span className="text-sm text-muted-foreground">Aucun membre</span>}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Progression détaillée</h4>
                            <div className="space-y-2">
                              <Progress value={project.progress} />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Tâches: {project.tasksCount.completed}/{project.tasksCount.total}</span>
                                <span>{project.progress}% terminé</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tasks" className="m-0">
                        <ProjectTaskList projectId={project.id} />
                      </TabsContent>
                      
                      <TabsContent value="team" className="m-0">
                        <ProjectMemberStats 
                          projectId={project.id} 
                          members={project.members.map(id => getMemberDetails(id))}
                          tasks={tasks}
                        />
                      </TabsContent>
                      
                      <div className="flex justify-end mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(project.id);
                          }}
                        >
                          Masquer les détails
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-semibold">Projets</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder={isMobile ? "Rechercher..." : "Rechercher un projet..."} 
                className="pl-9 w-full sm:w-[250px] bg-secondary focus-visible:ring-taski-blue"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className={statusFilter ? "text-primary border-primary" : ""}>
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="end">
                <div className="p-4 pb-2">
                  <h4 className="font-medium text-sm mb-3">Filtrer par statut</h4>
                  <div className="space-y-2">
                    <Button
                      variant={statusFilter === null ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setStatusFilter(null)}
                    >
                      Tous les statuts
                    </Button>
                    <Button
                      variant={statusFilter === 'planning' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setStatusFilter('planning')}
                    >
                      Planification
                    </Button>
                    <Button
                      variant={statusFilter === 'in-progress' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setStatusFilter('in-progress')}
                    >
                      En cours
                    </Button>
                    <Button
                      variant={statusFilter === 'completed' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setStatusFilter('completed')}
                    >
                      Terminé
                    </Button>
                    <Button
                      variant={statusFilter === 'on-hold' ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setStatusFilter('on-hold')}
                    >
                      En pause
                    </Button>
                  </div>
                </div>
                <div className="border-t p-4 pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStatusFilter(null);
                      setIsFilterOpen(false);
                    }}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Appliquer
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Tabs value={viewMode} className="hidden sm:block">
              <TabsList className="h-10">
                <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" onClick={() => setViewMode('list')}>
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              <span>{isMobile ? "Ajouter" : "Nouveau projet"}</span>
            </Button>
          </div>
        </div>
        
        <div className="block sm:hidden mb-2">
          <Tabs value={viewMode} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grille
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setViewMode('list')}>
                <List className="h-4 w-4 mr-2" />
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {viewMode === 'grid' ? renderGridView() : renderListView()}
      </div>
      
      <ProjectDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        project={currentProject}
        onSave={handleSaveProject}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Ce projet et toutes ses tâches seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
