
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  TrendingUp, 
  Users, 
  BarChart2,
  AlertCircle 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatCard from '@/components/dashboard/StatCard';
import TaskCard from '@/components/tasks/TaskCard';

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
  }
];

// Chart data
const activityData = [
  { name: 'Lun', tasks: 4, value: 40 },
  { name: 'Mar', tasks: 3, value: 30 },
  { name: 'Mer', tasks: 5, value: 50 },
  { name: 'Jeu', tasks: 7, value: 70 },
  { name: 'Ven', tasks: 2, value: 20 },
  { name: 'Sam', tasks: 1, value: 10 },
  { name: 'Dim', tasks: 0, value: 0 },
];

const projectProgressData = [
  { name: 'Website Redesign', progress: 75 },
  { name: 'App Development', progress: 45 },
  { name: 'Marketing Campaign', progress: 90 },
  { name: 'Documentation', progress: 30 },
];

const taskDistributionData = [
  { name: 'À faire', value: 8, color: '#8492A6' },
  { name: 'En cours', value: 5, color: '#FFCB2B' },
  { name: 'En revue', value: 3, color: '#9B6DFF' },
  { name: 'Terminé', value: 12, color: '#28C76F' },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-4 border-taski-blue/20 border-t-taski-blue animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6 pb-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Tâches totales" 
          value="28" 
          icon={<CheckSquare />} 
          change={12}
          progress={65}
          colorClass="text-taski-blue"
          iconBgClass="bg-taski-blue/10"
        />
        
        <StatCard 
          title="Tâches en retard" 
          value="3" 
          icon={<AlertCircle />} 
          change={-20}
          colorClass="text-taski-accent-red"
          iconBgClass="bg-taski-accent-red/10"
        />
        
        <StatCard 
          title="Échéances cette semaine" 
          value="7" 
          icon={<CalendarIcon />} 
          change={5}
          colorClass="text-taski-accent-yellow"
          iconBgClass="bg-taski-accent-yellow/10"
        />
        
        <StatCard 
          title="Taux de complétion" 
          value="78%" 
          icon={<TrendingUp />} 
          change={15}
          progress={78}
          colorClass="text-taski-accent-green"
          iconBgClass="bg-taski-accent-green/10"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Tâches récentes" 
          subtitle="Vos tâches les plus récentes"
          badge="4 nouvelles"
          badgeColor="blue"
          className="lg:col-span-2 overflow-visible"
          showViewAll
        >
          <div className="space-y-3">
            {TASKS.map((task, index) => (
              <div key={task.id} className="animate-enter" style={{ '--index': index } as React.CSSProperties}>
                <TaskCard task={task} isListView />
              </div>
            ))}
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Activité de l'équipe"
          subtitle="Derniers 7 jours"
        >
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#0066FF" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Progression des projets"
          subtitle="Projets actifs"
        >
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectProgressData}
                layout="vertical"
                margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Progression']}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="progress" fill="#0066FF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Distribution des tâches"
          subtitle="Par statut"
        >
          <div className="h-[220px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {taskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} tâches`, name]}
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {taskDistributionData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-1">
                <div style={{ backgroundColor: entry.color }} className="h-3 w-3 rounded-full"></div>
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Membres de l'équipe"
          subtitle="Activité récente"
        >
          <div className="space-y-4">
            {[
              { name: 'Sophie Martin', role: 'Designer', avatar: null, initials: 'SM', activity: '13 tâches complétées', active: true },
              { name: 'Thomas Dubois', role: 'Développeur', avatar: null, initials: 'TD', activity: '8 tâches complétées', active: true },
              { name: 'Marie Leroy', role: 'Chef de projet', avatar: null, initials: 'ML', activity: '5 tâches complétées', active: false },
              { name: 'Lucas Bernard', role: 'Testeur QA', avatar: null, initials: 'LB', activity: '3 tâches complétées', active: true }
            ].map((member, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 rounded-lg animate-enter hover:bg-secondary transition-colors"
                style={{ '--index': index } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback className="bg-taski-blue text-white">{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.name}</span>
                      {member.active && (
                        <span className="h-2 w-2 rounded-full bg-taski-accent-green"></span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {member.activity}
                </Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
