
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore, Task } from '@/lib/task-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export default function TaskCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const tasks = useTaskStore(state => state.tasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getTasksForDay = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = parseISO(task.dueDate);
        return isSameDay(taskDate, date);
      } catch (error) {
        console.error("Invalid date format:", task.dueDate);
        return false;
      }
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
  
  const previousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };
  
  const handleAddTask = (date: Date) => {
    setSelectedDate(date);
    // Pass this information to the parent component
    window.dispatchEvent(new CustomEvent('openTaskDialog', { 
      detail: { 
        date: date,
        status: 'to-do',
        priority: 'medium' 
      } 
    }));
    
    toast({
      title: "Date sélectionnée",
      description: `Vous pouvez maintenant créer une tâche pour le ${format(date, 'dd MMMM yyyy', { locale: fr })}`
    });
  };
  
  const handleTaskClick = (task: Task) => {
    // Pass this information to the parent component
    window.dispatchEvent(new CustomEvent('openTaskDialog', { 
      detail: { task } 
    }));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-sm font-medium text-center mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 flex-grow">
        {Array.from({ length: startDate.getDay() === 0 ? 6 : startDate.getDay() - 1 }).map((_, index) => (
          <div key={`empty-start-${index}`} className="border border-border rounded-md bg-secondary/30 opacity-50"></div>
        ))}
        
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div 
              key={day.toString()} 
              className={`border ${isSameMonth(day, currentDate) ? 'border-border' : 'border-border/50'} rounded-md min-h-[100px] p-1 flex flex-col relative`}
            >
              <div className={`text-right text-xs p-1 ${!isSameMonth(day, currentDate) ? 'text-muted-foreground' : ''}`}>
                {format(day, 'd')}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-5 w-5 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => handleAddTask(day)}
              >
                <Plus className="h-3 w-3" />
              </Button>
              
              <ScrollArea className="flex-grow">
                <div className="space-y-1 p-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <TooltipProvider key={task.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className="text-xs p-1 rounded bg-secondary/50 truncate hover:bg-secondary cursor-pointer"
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${
                                task.status === 'to-do' ? 'bg-taski-gray-400' :
                                task.status === 'in-progress' ? 'bg-taski-accent-yellow' :
                                task.status === 'review' ? 'bg-taski-accent-purple' : 'bg-taski-accent-green'
                              }`}></div>
                              {task.title}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1 max-w-xs">
                            <div className="font-medium">{task.title}</div>
                            {task.description && (
                              <div className="text-xs text-muted-foreground">{task.description}</div>
                            )}
                            <div className="flex flex-wrap gap-1 pt-1">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                              {task.assignee && (
                                <Badge variant="outline">{task.assignee.name}</Badge>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div 
                      className="text-xs text-muted-foreground text-center cursor-pointer hover:underline"
                      onClick={() => {
                        toast({
                          title: `${dayTasks.length - 3} tâches supplémentaires`,
                          description: "Cliquez sur une date pour voir toutes les tâches",
                        });
                      }}
                    >
                      +{dayTasks.length - 3} de plus
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
        
        {Array.from({ length: 7 - ((days.length + (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1)) % 7) }).map((_, index) => (
          <div key={`empty-end-${index}`} className="border border-border rounded-md bg-secondary/30 opacity-50"></div>
        ))}
      </div>
    </div>
  );
}
