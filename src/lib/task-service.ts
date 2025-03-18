
import { create } from 'zustand';

// Types pour les données de tâches
export interface Task {
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
const INITIAL_TASKS: Task[] = [
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

// Interface pour le store de tâches
interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  statusFilter: string | null;
  priorityFilter: string | null;
  assigneeFilter: string | null;
  tagFilter: string | null;
  getTasks: (status?: string) => Task[];
  addTask: (task: Omit<Task, 'id' | 'progress'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: 'to-do' | 'in-progress' | 'review' | 'done') => void;
  deleteTask: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  setPriorityFilter: (priority: string | null) => void;
  setAssigneeFilter: (assignee: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  clearFilters: () => void;
}

// Créer le store Zustand
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: INITIAL_TASKS,
  filteredTasks: INITIAL_TASKS,
  searchQuery: '',
  statusFilter: null,
  priorityFilter: null,
  assigneeFilter: null,
  tagFilter: null,
  
  getTasks: (status?: string) => {
    const { tasks, filteredTasks } = get();
    
    // Si des filtres sont appliqués, utilisez les tâches filtrées
    const tasksToUse = (get().searchQuery || get().statusFilter || get().priorityFilter || get().assigneeFilter || get().tagFilter) 
      ? filteredTasks 
      : tasks;
    
    if (status) {
      return tasksToUse.filter(task => task.status === status);
    }
    
    return tasksToUse;
  },
  
  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      progress: task.status === 'done' ? 100 : task.status === 'review' ? 80 : task.status === 'in-progress' ? 40 : 0,
    };
    
    set(state => {
      const updatedTasks = [...state.tasks, newTask];
      return { 
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state)
      };
    });
  },
  
  updateTask: (id, updates) => {
    set(state => {
      const updatedTasks = state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      );
      
      return { 
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state)
      };
    });
  },
  
  moveTask: (taskId, newStatus) => {
    set(state => {
      // Définir la progression en fonction du nouveau statut
      let progress = 0;
      switch (newStatus) {
        case 'in-progress': progress = 40; break;
        case 'review': progress = 80; break;
        case 'done': progress = 100; break;
        default: progress = 0;
      }
      
      const updatedTasks = state.tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, progress } : task
      );
      
      return { 
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state)
      };
    });
  },
  
  deleteTask: (id) => {
    set(state => {
      const updatedTasks = state.tasks.filter(task => task.id !== id);
      return { 
        tasks: updatedTasks,
        filteredTasks: applyFilters(updatedTasks, state)
      };
    });
  },
  
  setSearchQuery: (query) => {
    set(state => {
      const newState = { ...state, searchQuery: query };
      return {
        ...newState,
        filteredTasks: applyFilters(state.tasks, newState)
      };
    });
  },
  
  setStatusFilter: (status) => {
    set(state => {
      const newState = { ...state, statusFilter: status };
      return {
        ...newState,
        filteredTasks: applyFilters(state.tasks, newState)
      };
    });
  },
  
  setPriorityFilter: (priority) => {
    set(state => {
      const newState = { ...state, priorityFilter: priority };
      return {
        ...newState,
        filteredTasks: applyFilters(state.tasks, newState)
      };
    });
  },
  
  setAssigneeFilter: (assignee) => {
    set(state => {
      const newState = { ...state, assigneeFilter: assignee };
      return {
        ...newState,
        filteredTasks: applyFilters(state.tasks, newState)
      };
    });
  },
  
  setTagFilter: (tag) => {
    set(state => {
      const newState = { ...state, tagFilter: tag };
      return {
        ...newState,
        filteredTasks: applyFilters(state.tasks, newState)
      };
    });
  },
  
  clearFilters: () => {
    set(state => ({
      ...state,
      searchQuery: '',
      statusFilter: null,
      priorityFilter: null,
      assigneeFilter: null,
      tagFilter: null,
      filteredTasks: state.tasks
    }));
  },
}));

// Fonction helper pour appliquer tous les filtres
function applyFilters(tasks: Task[], state: Omit<TaskState, 'getTasks' | 'addTask' | 'updateTask' | 'moveTask' | 'deleteTask' | 'setSearchQuery' | 'setStatusFilter' | 'setPriorityFilter' | 'setAssigneeFilter' | 'setTagFilter' | 'clearFilters'>) {
  let filtered = [...tasks];
  
  // Appliquer le filtre de recherche
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  
  // Appliquer le filtre de statut
  if (state.statusFilter) {
    filtered = filtered.filter(task => task.status === state.statusFilter);
  }
  
  // Appliquer le filtre de priorité
  if (state.priorityFilter) {
    filtered = filtered.filter(task => task.priority === state.priorityFilter);
  }
  
  // Appliquer le filtre d'assigné
  if (state.assigneeFilter) {
    filtered = filtered.filter(task => task.assignee?.name === state.assigneeFilter);
  }
  
  // Appliquer le filtre de tag
  if (state.tagFilter) {
    filtered = filtered.filter(task => task.tags?.includes(state.tagFilter));
  }
  
  return filtered;
}

// Exporter la liste des colonnes de statut pour la vue Kanban
export const statusColumns = [
  { id: 'to-do', title: 'À faire' },
  { id: 'in-progress', title: 'En cours' },
  { id: 'review', title: 'En revue' },
  { id: 'done', title: 'Terminé' }
];

// Exporter la fonction pour générer un nouvel ID
export const generateId = () => Date.now().toString();
