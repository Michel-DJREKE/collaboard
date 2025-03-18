
import { useState } from 'react';
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
  Filter,
  SlidersHorizontal
} from "lucide-react";
import TaskCard from "./TaskCard";

// Types for our mock data
interface Task {
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
}

// Sample tasks data
const TASKS: Task[] = [
  {
    id: '1',
    title: 'Concevoir les maquettes du dashboard',
    description: 'Créer les wireframes et maquettes pour la nouvelle interface',
    priority: 'high',
    status: 'to-do',
    dueDate: '2023-10-25',
    assignee: {
      name: 'Sophie Martin',
      initials: 'SM'
    },
    tags: ['Design', 'UI/UX'],
    progress: 0
  },
  {
    id: '2',
    title: 'Développer la page d\'accueil',
    description: 'Implémenter le frontend de la page d\'accueil selon les maquettes',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2023-10-30',
    assignee: {
      name: 'Thomas Dubois',
      initials: 'TD'
    },
    tags: ['Frontend', 'React'],
    progress: 40
  },
  {
    id: '3',
    title: 'Optimiser les requêtes API',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2023-11-05',
    assignee: {
      name: 'Marie Leroy',
      initials: 'ML'
    },
    tags: ['Backend', 'Performance'],
    progress: 60
  },
  {
    id: '4',
    title: 'Tester les fonctionnalités principales',
    description: 'Réaliser des tests sur les fonctionnalités clés de l\'application',
    priority: 'high',
    status: 'review',
    dueDate: '2023-11-02',
    assignee: {
      name: 'Lucas Bernard',
      initials: 'LB'
    },
    tags: ['QA', 'Testing'],
    progress: 80
  },
  {
    id: '5',
    title: 'Rédiger la documentation technique',
    priority: 'low',
    status: 'to-do',
    dueDate: '2023-11-10',
    tags: ['Documentation'],
    progress: 0
  },
  {
    id: '6',
    title: 'Implémenter l\'authentification',
    description: 'Mettre en place le système d\'authentification avec JWT',
    priority: 'high',
    status: 'done',
    assignee: {
      name: 'Thomas Dubois',
      initials: 'TD'
    },
    tags: ['Security', 'Backend'],
    progress: 100
  },
  {
    id: '7',
    title: 'Améliorer la réactivité mobile',
    priority: 'medium',
    status: 'to-do',
    dueDate: '2023-11-15',
    assignee: {
      name: 'Sophie Martin',
      initials: 'SM'
    },
    tags: ['Responsive', 'CSS'],
    progress: 0
  },
  {
    id: '8',
    title: 'Déployer en production',
    priority: 'high',
    status: 'to-do',
    dueDate: '2023-11-20',
    tags: ['DevOps'],
    progress: 0
  },
];

export default function TaskView() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  
  const statusColumns = [
    { id: 'to-do', title: 'À faire' },
    { id: 'in-progress', title: 'En cours' },
    { id: 'review', title: 'En revue' },
    { id: 'done', title: 'Terminé' }
  ];
  
  const getTasksByStatus = (status: string) => {
    return TASKS.filter(task => task.status === status);
  };
  
  const renderKanbanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {statusColumns.map(column => (
        <div key={column.id} className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h3 className="font-medium text-sm">{column.title}</h3>
              <div className="ml-2 bg-taski-gray-200 dark:bg-taski-gray-700 text-taski-gray-600 dark:text-taski-gray-400 text-xs px-2 py-0.5 rounded-full">
                {getTasksByStatus(column.id).length}
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3 flex-grow">
            {getTasksByStatus(column.id).map(task => (
              <div key={task.id} className="animate-enter" style={{ '--index': getTasksByStatus(column.id).indexOf(task) } as React.CSSProperties}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-2 justify-center text-muted-foreground border border-dashed border-taski-gray-300 dark:border-taski-gray-700 hover:border-taski-blue hover:text-taski-blue bg-transparent h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      ))}
    </div>
  );
  
  const renderListView = () => (
    <div className="mt-4 space-y-3">
      {TASKS.map((task, index) => (
        <div key={task.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
          <TaskCard task={task} isListView />
        </div>
      ))}
    </div>
  );
  
  const renderCalendarView = () => (
    <div className="mt-4 h-[500px] flex items-center justify-center border rounded-lg">
      <div className="text-center text-muted-foreground">
        <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>Vue calendrier à venir</p>
      </div>
    </div>
  );
  
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
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Rechercher une tâche..." 
                  className="pl-9 w-[200px] sm:w-[250px] bg-secondary focus-visible:ring-taski-blue"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Nouvelle tâche</span>
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
    </div>
  );
}
