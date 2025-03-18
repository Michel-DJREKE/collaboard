
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Calendar as CalendarIcon, Tag, MoreHorizontal, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskStore } from "@/lib/task-service";
import { useToast } from "@/hooks/use-toast";

interface TaskProps {
  task: {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'to-do' | 'in-progress' | 'review' | 'done';
    dueDate?: string;
    assignee?: {
      name: string;
      avatar?: string;
      initials?: string;
    };
    tags?: string[];
    progress?: number;
  };
  isListView?: boolean;
  onEdit?: (task: any) => void;
}

export default function TaskCard({ task, isListView = false, onEdit }: TaskProps) {
  const { toast } = useToast();
  const deleteTask = useTaskStore(state => state.deleteTask);
  const moveTask = useTaskStore(state => state.moveTask);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher le clic de propager au parent
    deleteTask(task.id);
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès",
    });
  };
  
  const handleStatusChange = (e: React.MouseEvent, status: 'to-do' | 'in-progress' | 'review' | 'done') => {
    e.stopPropagation(); // Empêcher le clic de propager au parent
    moveTask(task.id, status);
    toast({
      title: "Statut mis à jour",
      description: `La tâche est maintenant "${status === 'to-do' ? 'À faire' : status === 'in-progress' ? 'En cours' : status === 'review' ? 'En revue' : 'Terminé'}"`,
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-taski-accent-red/10 text-taski-accent-red border-taski-accent-red/20';
      case 'medium':
        return 'bg-taski-accent-yellow/10 text-taski-accent-yellow border-taski-accent-yellow/20';
      case 'low':
        return 'bg-taski-accent-green/10 text-taski-accent-green border-taski-accent-green/20';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-do':
        return 'bg-taski-gray-400';
      case 'in-progress':
        return 'bg-taski-accent-yellow';
      case 'review':
        return 'bg-taski-accent-purple';
      case 'done':
        return 'bg-taski-accent-green';
      default:
        return 'bg-taski-gray-400';
    }
  };

  if (isListView) {
    return (
      <div className="task-card flex flex-col sm:flex-row gap-4 hover:border-taski-blue/40">
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(task.status))}></div>
              <h3 className="font-medium line-clamp-1">{task.title}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-1">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => handleStatusChange(e, 'to-do')}
                  disabled={task.status === 'to-do'}
                >
                  Marquer comme à faire
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleStatusChange(e, 'in-progress')}
                  disabled={task.status === 'in-progress'}
                >
                  Marquer comme en cours
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleStatusChange(e, 'review')}
                  disabled={task.status === 'review'}
                >
                  Marquer comme en revue
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => handleStatusChange(e, 'done')}
                  disabled={task.status === 'done'}
                >
                  Marquer comme terminé
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {task.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-1">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {task.tags && task.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs bg-taski-gray-100 dark:bg-taski-gray-800">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 mt-3 sm:mt-0">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}
            
            <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
              {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </Badge>
          </div>
          
          {task.assignee && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="bg-taski-blue text-white text-xs">
                {task.assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="task-card flex flex-col hover:border-taski-blue/40">
      <div className="flex items-start justify-between">
        <div className={cn("h-2 w-2 rounded-full mt-1", getStatusColor(task.status))}></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => handleStatusChange(e, 'to-do')}
              disabled={task.status === 'to-do'}
            >
              Marquer comme à faire
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => handleStatusChange(e, 'in-progress')}
              disabled={task.status === 'in-progress'}
            >
              Marquer comme en cours
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => handleStatusChange(e, 'review')}
              disabled={task.status === 'review'}
            >
              Marquer comme en revue
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => handleStatusChange(e, 'done')}
              disabled={task.status === 'done'}
            >
              Marquer comme terminé
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <h3 className="font-medium mt-2 line-clamp-2">{task.title}</h3>
      
      {task.description && (
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2 mb-2">{task.description}</p>
      )}
      
      {typeof task.progress !== 'undefined' && (
        <Progress value={task.progress} className="h-1 mt-2 mb-3" />
      )}
      
      <div className="flex flex-wrap items-center gap-1.5 my-2">
        {task.tags && task.tags.slice(0, 2).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs bg-taski-gray-100 dark:bg-taski-gray-800">
            {tag}
          </Badge>
        ))}
        {(task.tags?.length || 0) > 2 && <span className="text-xs text-muted-foreground">+{(task.tags?.length || 0) - 2}</span>}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatar} />
            <AvatarFallback className="bg-taski-blue text-white text-xs">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
