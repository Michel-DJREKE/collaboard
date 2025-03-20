
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
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/lib/task-service";

interface MemberStats {
  id: string;
  name: string;
  initials: string;
  avatar?: string | null;
  tasksAssigned: number;
  tasksCompleted: number;
  progress: number;
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
    const memberTasks = tasks.filter(task => task.assignee?.name === member.name);
    const completedTasks = memberTasks.filter(task => task.status === 'done');
    const averageProgress = memberTasks.length > 0 
      ? memberTasks.reduce((sum, task) => sum + (task.progress || 0), 0) / memberTasks.length 
      : 0;
    
    return {
      id: member.id,
      name: member.name,
      initials: member.initials,
      avatar: member.avatar,
      tasksAssigned: memberTasks.length,
      tasksCompleted: completedTasks.length,
      progress: Math.round(averageProgress)
    };
  });

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

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Performance de l'équipe</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
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
          <CardHeader>
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
      
      <div className="space-y-4">
        <h4 className="text-base font-medium">Détails par membre</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberStats.map((member) => (
            <Card key={member.id}>
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
                  
                  <div className="grid grid-cols-2 w-full gap-2 pt-2">
                    <div className="flex flex-col items-center bg-muted/30 rounded-md p-2">
                      <span className="text-xl font-semibold">{member.tasksAssigned}</span>
                      <span className="text-xs text-muted-foreground">Tâches assignées</span>
                    </div>
                    <div className="flex flex-col items-center bg-muted/30 rounded-md p-2">
                      <span className="text-xl font-semibold">{member.tasksCompleted}</span>
                      <span className="text-xs text-muted-foreground">Tâches terminées</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

