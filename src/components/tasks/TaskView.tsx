
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  List as ListIcon, 
  Calendar as CalendarIcon, 
  Search,
  Plus,
  AlertCircle,
  Trash2
} from "lucide-react";
import TaskCard from "./TaskCard";
import TaskDialog from "./TaskDialog";
import FilterPopover from "./FilterPopover";
import TaskCalendar from "./TaskCalendar";
import { useTaskStore, statusColumns, Task } from '@/lib/task-service';
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

interface CustomCSSProperties extends React.CSSProperties {
  '--index'?: number;
}

interface NewTaskPartial {
  status?: 'to-do' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  date?: string;
}

export default function TaskView() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | NewTaskPartial | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const tasks = useTaskStore(state => state.tasks);
  const getTasks = useTaskStore(state => state.getTasks);
  const addTask = useTaskStore(state => state.addTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const moveTask = useTaskStore(state => state.moveTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const setSearchQuery = useTaskStore(state => state.setSearchQuery);
  
  useEffect(() => {
    const handleOpenTaskDialog = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        if (customEvent.detail.task) {
          setCurrentTask(customEvent.detail.task);
        } else {
          const newTask: NewTaskPartial = {
            status: customEvent.detail.status as 'to-do' | 'in-progress' | 'review' | 'done' || 'to-do',
            priority: customEvent.detail.priority as 'low' | 'medium' | 'high' || 'medium',
          };
          
          if (customEvent.detail.date) {
            newTask.dueDate = customEvent.detail.date;
          }
          
          setCurrentTask(newTask);
        }
        setIsDialogOpen(true);
      }
    };
    
    window.addEventListener('openTaskDialog', handleOpenTaskDialog);
    
    return () => {
      window.removeEventListener('openTaskDialog', handleOpenTaskDialog);
    };
  }, []);
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    moveTask(
      draggableId, 
      destination.droppableId as 'to-do' | 'in-progress' | 'review' | 'done'
    );
    
    toast({
      title: "Tâche déplacée",
      description: `La tâche a été déplacée vers "${statusColumns.find(s => s.id === destination.droppableId)?.title}"`,
    });
  };
  
  const handleCreateTask = () => {
    setCurrentTask(null);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      setDeleteConfirmOpen(false);
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
      });
    }
  };
  
  const handleSaveTask = (values: any) => {
    if (currentTask && 'id' in currentTask && currentTask.id) {
      updateTask(currentTask.id, {
        ...values,
        assignee: values.assigneeId 
          ? { 
              name: TEAM_MEMBERS.find(m => m.id === values.assigneeId)?.name || '',
              initials: TEAM_MEMBERS.find(m => m.id === values.assigneeId)?.initials || ''
            }
          : undefined
      });
      
      toast({
        title: "Tâche mise à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } else {
      addTask({
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: values.status as 'to-do' | 'in-progress' | 'review' | 'done',
        dueDate: values.dueDate ? values.dueDate.toISOString().split('T')[0] : undefined,
        assignee: values.assigneeId 
          ? { 
              name: TEAM_MEMBERS.find(m => m.id === values.assigneeId)?.name || '',
              initials: TEAM_MEMBERS.find(m => m.id === values.assigneeId)?.initials || ''
            }
          : undefined,
        tags: values.tags,
      });
      
      toast({
        title: "Tâche créée",
        description: "Une nouvelle tâche a été ajoutée avec succès.",
      });
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const getTasksByStatus = (status: string) => {
    return getTasks(status);
  };
  
  const renderKanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={cn(
        "grid gap-4 mt-4",
        isMobile 
          ? "grid-cols-1 overflow-x-auto pb-4" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      )}>
        {statusColumns.map(column => (
          <div key={column.id} className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <div className="ml-2 bg-taski-gray-200 dark:bg-taski-gray-700 text-taski-gray-600 dark:text-taski-gray-400 text-xs px-2 py-0.5 rounded-full">
                  {getTasksByStatus(column.id).length}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => {
                  setCurrentTask({
                    status: column.id as 'to-do' | 'in-progress' | 'review' | 'done',
                    priority: 'medium',
                  });
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 flex-grow min-h-[200px]"
                >
                  {getTasksByStatus(column.id).length === 0 && (
                    <div className="flex flex-col items-center justify-center h-20 border border-dashed rounded-lg text-muted-foreground">
                      <p className="text-xs text-center">Aucune tâche</p>
                    </div>
                  )}
                  
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="animate-enter relative group" 
                          style={{ 
                            ...provided.draggableProps.style,
                            '--index': index,
                          } as CustomCSSProperties}
                          onClick={() => handleEditTask(task)}
                        >
                          <TaskCard task={task} />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            
            <Button 
              variant="ghost" 
              className="mt-2 justify-center text-muted-foreground border border-dashed border-taski-gray-300 dark:border-taski-gray-700 hover:border-taski-blue hover:text-taski-blue bg-transparent h-10"
              onClick={() => {
                setCurrentTask({
                  status: column.id as 'to-do' | 'in-progress' | 'review' | 'done',
                  priority: 'medium',
                });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {!isMobile ? "Ajouter une tâche" : "Ajouter"}
            </Button>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
  
  const renderListView = () => (
    <div className="mt-4 space-y-3">
      {getTasks().length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <p className="text-center">Aucune tâche ne correspond à vos filtres</p>
          <Button variant="outline" className="mt-4" onClick={() => useTaskStore.getState().clearFilters()}>
            Effacer les filtres
          </Button>
        </div>
      ) : (
        getTasks().map((task, index) => (
          <div 
            key={task.id} 
            className="animate-enter cursor-pointer relative group" 
            style={{ '--index': index } as CustomCSSProperties}
          >
            <div onClick={() => handleEditTask(task)}>
              <TaskCard task={task} isListView />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-1/2 right-4 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive hover:text-white"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
  
  const renderCalendarView = () => (
    <div className="mt-4 h-[600px]">
      <TaskCalendar />
    </div>
  );
  
  const TEAM_MEMBERS = [
    { id: '1', name: 'Sophie Martin', avatar: null, initials: 'SM' },
    { id: '2', name: 'Thomas Dubois', avatar: null, initials: 'TD' },
    { id: '3', name: 'Marie Leroy', avatar: null, initials: 'ML' },
    { id: '4', name: 'Lucas Bernard', avatar: null, initials: 'LB' },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Tabs defaultValue="kanban" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <TabsList className="bg-secondary">
              <TabsTrigger 
                value="kanban" 
                onClick={() => setViewMode('kanban')}
                className={cn(viewMode === 'kanban' && "bg-white dark:bg-taski-gray-800 shadow-sm")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                onClick={() => setViewMode('list')}
                className={cn(viewMode === 'list' && "bg-white dark:bg-taski-gray-800 shadow-sm")}
              >
                <ListIcon className="h-4 w-4 mr-2" />
                Liste
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                onClick={() => setViewMode('calendar')}
                className={cn(viewMode === 'calendar' && "bg-white dark:bg-taski-gray-800 shadow-sm")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendrier
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={isMobile ? "Rechercher..." : "Rechercher une tâche..."} 
                  className="pl-9 w-full sm:w-[250px] bg-secondary focus-visible:ring-taski-blue"
                  onChange={handleSearch}
                />
              </div>
              
              <FilterPopover />
              
              <Button variant="default" className={cn("gap-2", isMobile && "px-3")} onClick={handleCreateTask}>
                <Plus className="h-4 w-4" />
                {!isMobile && <span>Nouvelle tâche</span>}
              </Button>
            </div>
          </div>

          <TabsContent value="kanban" className="mt-0">
            {renderKanbanView()}
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            {renderListView()}
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            {renderCalendarView()}
          </TabsContent>
        </Tabs>
      </div>
      
      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        task={currentTask}
        onSave={handleSaveTask}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette tâche ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cette tâche sera définitivement supprimée
              de vos projets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
