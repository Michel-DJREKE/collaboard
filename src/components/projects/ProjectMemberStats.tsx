import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/lib/task-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MemberStats {
  id: string;
  name: string;
  initials: string;
  avatar?: string | null;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  progress: number;
  activityData?: Array<{date: string, count: number}>;
}

interface ProjectMemberStatsProps {
  projectId: string;
  members: Array<{
    id: string;
    name: string;
    initials: string;
    avatar: string | null;
  }>;
  tasks: Task[];
}

export default function ProjectMemberStats({ projectId, members, tasks }: ProjectMemberStatsProps) {
  // Calculer les statistiques pour chaque membre
  const memberStats: MemberStats[] = members.map(member => {
    // Fix #1: Use the member.id to filter tasks instead of relying on assignee.id
    const memberTasks = tasks.filter(task => 
      task.assignee?.name === member.name
    );
    
    // Fix #2: Use correct status values from the Task type
    const completedTasks = memberTasks.filter(task => task.status === 'done');
    const inProgressTasks = memberTasks.filter(task => task.status === 'in-progress');
    const pendingTasks = memberTasks.filter(task => task.status === 'to-do' || task.status === 'review');
    
    const averageProgress = memberTasks.length > 0 
      ? memberTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / memberTasks.length 
      : 0;
    
    // Simuler des données d'activité pour l'exemple
    const activityData = generateActivityData();
    
    return {
      id: member.id,
      name: member.name,
      initials: member.initials,
      avatar: member.avatar,
      tasksAssigned: memberTasks.length,
      tasksCompleted: completedTasks.length,
      tasksInProgress: inProgressTasks.length,
      tasksPending: pendingTasks.length,
      progress: Math.round(averageProgress),
      activityData
    };
  });

  // Générer des données d'activité fictives
  function generateActivityData() {
    const result = [];
    const days = 7;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5) // Nombre aléatoire entre 0 et 4
      });
    }
    
    return result;
  }

  // Données pour le graphique de répartition des tâches
  const taskDistributionData = memberStats.map(member => ({
    name: member.name,
    value: member.tasksAssigned
  }));

  // Données pour le graphique de progression
  const progressData = memberStats.map(member => ({
    name: member.name,
    progress: member.progress
  }));

  // Données pour le graphique de statut des tâches
  const taskStatusData = memberStats.map(member => ({
    name: member.name,
    Terminées: member.tasksCompleted,
    "En cours": member.tasksInProgress,
    "En attente": member.tasksPending
  }));

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const STATUS_COLORS = {
    completed: '#00C49F', 
    inProgress: '#FFBB28', 
    pending: '#FF8042'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Performance de l'équipe</h3>
      
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Progression par membre</CardTitle>
                <CardDescription>Avancement des tâches assignées par membre du projet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={progressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Progression']} />
                      <Legend />
                      <Bar dataKey="progress" name="Progression (%)" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Répartition des tâches</CardTitle>
                <CardDescription>Distribution des tâches par membre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {taskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Tâches assignées']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Statut des tâches par membre</CardTitle>
              <CardDescription>Répartition des tâches par statut pour chaque membre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskStatusData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Terminées" stackId="a" fill={STATUS_COLORS.completed} />
                    <Bar dataKey="En cours" stackId="a" fill={STATUS_COLORS.inProgress} />
                    <Bar dataKey="En attente" stackId="a" fill={STATUS_COLORS.pending} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members" className="pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberStats.map((member) => (
                <Card key={member.id} className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-16 w-16">
                        {member.avatar && <AvatarImage src={member.avatar} />}
                        <AvatarFallback className="bg-taski-blue text-white text-lg">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h5 className="font-medium">{member.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {member.tasksCompleted} / {member.tasksAssigned} tâches terminées
                        </p>
                      </div>
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{member.progress}%</span>
                        </div>
                        <Progress value={member.progress} />
                      </div>
                      
                      <div className="grid grid-cols-3 w-full gap-2 pt-2">
                        <div className="flex flex-col items-center bg-muted/30 rounded-md p-2">
                          <span className="text-xl font-semibold">{member.tasksAssigned}</span>
                          <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                        <div className="flex flex-col items-center bg-muted/30 rounded-md p-2">
                          <span className="text-xl font-semibold text-taski-accent-green">{member.tasksCompleted}</span>
                          <span className="text-xs text-muted-foreground">Terminées</span>
                        </div>
                        <div className="flex flex-col items-center bg-muted/30 rounded-md p-2">
                          <span className="text-xl font-semibold text-taski-accent-yellow">{member.tasksInProgress}</span>
                          <span className="text-xs text-muted-foreground">En cours</span>
                        </div>
                      </div>
                      
                      {member.activityData && (
                        <div className="w-full pt-2">
                          <p className="text-xs text-muted-foreground mb-2">Activité récente (7 jours)</p>
                          <div className="h-20">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={member.activityData}>
                                <XAxis dataKey="date" tick={false} />
                                <YAxis hide domain={[0, 5]} />
                                <Tooltip 
                                  formatter={(value, name) => [`${value} tâches`, 'Activité']}
                                  labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
