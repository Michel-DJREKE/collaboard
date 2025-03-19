import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  Plus, 
  MoreVertical, 
  Calendar, 
  Users, 
  Edit, 
  Trash2,
  CheckSquare,
  Clock,
  AlertCircle
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Progress } from "@/components/ui/progress";
import ProjectDialog from "@/components/projects/ProjectDialog";
import { useIsMobile } from "@/hooks/use-mobile";
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
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projets</h1>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          <span>{isMobile ? "Ajouter" : "Nouveau projet"}</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
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
                onClick={() => {
                  toast({
                    title: "Vue détaillée",
                    description: "Cette fonctionnalité sera disponible prochainement.",
                  });
                }}
              >
                Voir détails
              </Button>
            </CardFooter>
            <div className="absolute inset-0 rounded-lg border-2 border-primary/0 hover:border-primary/50 transition-colors pointer-events-none"></div>
          </Card>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground/50" />
            <p className="text-center">Aucun projet n'a été créé</p>
            <Button variant="outline" className="mt-4" onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              Créer votre premier projet
            </Button>
          </div>
        )}
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
