
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Task, useTaskStore } from "@/lib/task-service";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, MoreVertical, Search } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectTaskListProps {
  projectId: string;
}

export default function ProjectTaskList({ projectId }: ProjectTaskListProps) {
  const { tasks } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Simuler les tâches associées à un projet
  // Dans une application réelle, vous auriez une relation entre projets et tâches
  const projectTasks = tasks.filter(task => 
    // Simulons que les 4 premières tâches appartiennent au projet
    parseInt(task.id) % 4 === parseInt(projectId) % 4
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to-do':
        return <Badge variant="outline" className="bg-taski-accent-blue/10 text-taski-accent-blue border-taski-accent-blue/20">À faire</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-taski-accent-yellow/10 text-taski-accent-yellow border-taski-accent-yellow/20">En cours</Badge>;
      case 'review':
        return <Badge variant="outline" className="bg-taski-accent-purple/10 text-taski-accent-purple border-taski-accent-purple/20">En revue</Badge>;
      case 'done':
        return <Badge variant="outline" className="bg-taski-accent-green/10 text-taski-accent-green border-taski-accent-green/20">Terminé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Basse</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-600 border-amber-200">Moyenne</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-rose-100 text-rose-600 border-rose-200">Haute</Badge>;
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

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredTasks = projectTasks
    .filter(task => 
      searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      
      // Gestion spéciale pour les champs imbriqués
      if (sortField === 'priority') {
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
        valA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        valB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      } else if (sortField === 'status') {
        const statusOrder = { 'to-do': 1, 'in-progress': 2, 'review': 3, 'done': 4 };
        valA = statusOrder[a.status as keyof typeof statusOrder] || 0;
        valB = statusOrder[b.status as keyof typeof statusOrder] || 0;
      } else if (sortField === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else if (sortField === 'assignee') {
        valA = a.assignee?.name || '';
        valB = b.assignee?.name || '';
      }
      
      if (valA === valB) return 0;
      const comparison = valA > valB ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const getSortIcon = (field: keyof Task) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tâches du projet ({filteredTasks.length})</h3>
        <div className="relative w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher une tâche..." 
            className="pl-9 w-full bg-secondary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('title')}
              >
                Titre {getSortIcon('title')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('status')}
              >
                Statut {getSortIcon('status')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('priority')}
              >
                Priorité {getSortIcon('priority')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('progress')}
              >
                Progression {getSortIcon('progress')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('assignee')}
              >
                Assigné à {getSortIcon('assignee')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort('dueDate')}
              >
                Échéance {getSortIcon('dueDate')}
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <p className="text-muted-foreground">Aucune tâche trouvée pour ce projet</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={task.progress} />
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {task.assignee.avatar && <AvatarImage src={task.assignee.avatar} />}
                          <AvatarFallback className="bg-taski-blue text-white text-xs">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <div className="text-sm">
                        {formatDate(task.dueDate)}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Non définie</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {!task.tags?.length && (
                        <span className="text-xs text-muted-foreground">Aucun tag</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem>Changer de statut</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
