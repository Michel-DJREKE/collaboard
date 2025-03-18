
import { useState } from 'react';
import { 
  BarChart2, 
  Calendar, 
  Download, 
  Users, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Timer,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  FileText
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Sample data for charts
const projectProgressData = [
  { name: 'Design System', progress: 72, target: 100 },
  { name: 'Site Web', progress: 89, target: 100 },
  { name: 'Application Mobile', progress: 45, target: 100 },
  { name: 'Dashboard Admin', progress: 32, target: 100 },
  { name: 'API Integration', progress: 65, target: 100 },
];

const taskCompletionData = [
  { name: 'Lun', completed: 8, pending: 3 },
  { name: 'Mar', completed: 12, pending: 5 },
  { name: 'Mer', completed: 7, pending: 6 },
  { name: 'Jeu', completed: 14, pending: 2 },
  { name: 'Ven', completed: 10, pending: 4 },
  { name: 'Sam', completed: 5, pending: 2 },
  { name: 'Dim', completed: 3, pending: 1 },
];

const taskDistributionData = [
  { name: 'En attente', value: 15, color: '#FFCB2B' },
  { name: 'En cours', value: 25, color: '#0066FF' },
  { name: 'En revue', value: 10, color: '#9B6DFF' },
  { name: 'Terminées', value: 50, color: '#28C76F' },
];

const timeTrackingData = [
  { name: 'Sem 1', design: 12, development: 18, management: 5 },
  { name: 'Sem 2', design: 15, development: 20, management: 8 },
  { name: 'Sem 3', design: 10, development: 22, management: 6 },
  { name: 'Sem 4', design: 8, development: 25, management: 10 },
];

const projectsTimelineData = [
  { name: 'Jan', progress: 20 },
  { name: 'Fév', progress: 35 },
  { name: 'Mar', progress: 42 },
  { name: 'Avr', progress: 48 },
  { name: 'Mai', progress: 60 },
  { name: 'Juin', progress: 75 },
  { name: 'Juil', progress: 85 },
  { name: 'Août', progress: 92 },
  { name: 'Sep', progress: 95 },
];

// Team performance data
const teamMembers = [
  {
    name: 'Sophie Martin',
    role: 'Designer UI/UX',
    avatar: undefined,
    initials: 'SM',
    tasksCompleted: 24,
    hoursLogged: 38,
    onTrack: true,
    performance: 94,
  },
  {
    name: 'Thomas Dubois',
    role: 'Développeur Front-end',
    avatar: undefined,
    initials: 'TD',
    tasksCompleted: 18,
    hoursLogged: 42,
    onTrack: true,
    performance: 88,
  },
  {
    name: 'Marie Leroy',
    role: 'Développeur Back-end',
    avatar: undefined,
    initials: 'ML',
    tasksCompleted: 15,
    hoursLogged: 36,
    onTrack: false,
    performance: 72,
  },
  {
    name: 'Lucas Bernard',
    role: 'Chef de Projet',
    avatar: undefined,
    initials: 'LB',
    tasksCompleted: 12,
    hoursLogged: 44,
    onTrack: true,
    performance: 90,
  },
];

export default function Stats() {
  const [timePeriod, setTimePeriod] = useState('week');
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Statistiques & Rapports</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Cette semaine</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tâches complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">42</div>
              <Badge variant="default" className="bg-taski-accent-green flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <span>12%</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Heures travaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">160</div>
              <Badge variant="default" className="bg-taski-accent-green flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <span>8%</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projets actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>Stable</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs période précédente</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">85%</div>
              <Badge variant="default" className="bg-taski-accent-red flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                <span>3%</span>
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs période précédente</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
          <TabsTrigger value="time">Temps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des tâches</CardTitle>
                <CardDescription>Distribution des tâches par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {taskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value, name) => [`${value}%`, name]} 
                        contentStyle={{ background: 'var(--card)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  {taskDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <div className="text-xs">{item.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tâches terminées</CardTitle>
                <CardDescription>Nombre de tâches complétées vs en attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--card)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="completed" name="Terminées" fill="#28C76F" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="pending" name="En attente" fill="#FFCB2B" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Progression des projets</CardTitle>
              <CardDescription>Avancement des projets actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectProgressData.map((project) => (
                  <div key={project.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.progress}%</div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline des projets</CardTitle>
              <CardDescription>Progression des projets sur l'année</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectsTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ background: 'var(--card)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" dataKey="progress" name="Progression" stroke="#0066FF" fill="#0066FF20" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-taski-accent-green"></div>
                      <span>Terminés</span>
                    </div>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-taski-blue"></div>
                      <span>En cours</span>
                    </div>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-taski-accent-yellow"></div>
                      <span>En attente</span>
                    </div>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-taski-accent-red"></div>
                      <span>En retard</span>
                    </div>
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prochaines échéances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-taski-accent-yellow/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-taski-accent-yellow" />
                      </div>
                      <div>
                        <div className="font-medium">Livraison MVP</div>
                        <div className="text-xs text-muted-foreground">Projet Refonte</div>
                      </div>
                    </div>
                    <Badge>Dans 3 jours</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-taski-accent-red/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-taski-accent-red" />
                      </div>
                      <div>
                        <div className="font-medium">Présentation client</div>
                        <div className="text-xs text-muted-foreground">Projet Marketing</div>
                      </div>
                    </div>
                    <Badge variant="destructive">Demain</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-taski-accent-green/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-taski-accent-green" />
                      </div>
                      <div>
                        <div className="font-medium">Revue design</div>
                        <div className="text-xs text-muted-foreground">Design System</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Dans 1 semaine</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance de l'équipe</CardTitle>
              <CardDescription>Performances individuelles des membres de l'équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-taski-blue text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{member.name}</span>
                        {member.onTrack ? (
                          <Badge variant="default" className="bg-taski-accent-green text-white">Sur la bonne voie</Badge>
                        ) : (
                          <Badge variant="default" className="bg-taski-accent-yellow text-white">En retard</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-6">
                      <div className="text-center hidden md:block">
                        <div className="font-medium">{member.tasksCompleted}</div>
                        <div className="text-xs text-muted-foreground">Tâches</div>
                      </div>
                      
                      <div className="text-center hidden md:block">
                        <div className="font-medium">{member.hoursLogged}h</div>
                        <div className="text-xs text-muted-foreground">Heures</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance} className="h-2 w-24" />
                        <span className="text-sm font-medium">{member.performance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des tâches par membre</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamMembers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--card)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="tasksCompleted" name="Tâches complétées" fill="#0066FF" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activité de l'équipe</CardTitle>
                <CardDescription>5 dernières activités</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle2 className="h-5 w-5 text-taski-accent-green" />
                    </div>
                    <div>
                      <div className="font-medium">Sophie Martin a terminé une tâche</div>
                      <div className="text-sm">Concevoir les maquettes du dashboard</div>
                      <div className="text-xs text-muted-foreground mt-1">Il y a 35 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <FileText className="h-5 w-5 text-taski-blue" />
                    </div>
                    <div>
                      <div className="font-medium">Thomas Dubois a créé un document</div>
                      <div className="text-sm">Documentation technique API</div>
                      <div className="text-xs text-muted-foreground mt-1">Il y a 2 heures</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertCircle className="h-5 w-5 text-taski-accent-yellow" />
                    </div>
                    <div>
                      <div className="font-medium">Marie Leroy a signalé un problème</div>
                      <div className="text-sm">Bug dans le formulaire d'inscription</div>
                      <div className="text-xs text-muted-foreground mt-1">Il y a 3 heures</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Clock className="h-5 w-5 text-taski-accent-purple" />
                    </div>
                    <div>
                      <div className="font-medium">Lucas Bernard a modifié une échéance</div>
                      <div className="text-sm">Livraison des maquettes</div>
                      <div className="text-xs text-muted-foreground mt-1">Il y a 5 heures</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suivi du temps par catégorie</CardTitle>
              <CardDescription>Répartition des heures travaillées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeTrackingData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ background: 'var(--card)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="design" name="Design" stackId="a" fill="#FFCB2B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="development" name="Développement" stackId="a" fill="#0066FF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="management" name="Gestion" stackId="a" fill="#9B6DFF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-[#FFCB2B]"></div>
                  <div className="text-sm">Design</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-[#0066FF]"></div>
                  <div className="text-sm">Développement</div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-[#9B6DFF]"></div>
                  <div className="text-sm">Gestion</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Cette semaine</CardTitle>
                  <ArrowUp className="h-4 w-4 text-taski-accent-green" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42h</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-taski-accent-green">+6h</span> par rapport à la semaine dernière
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Ce mois</CardTitle>
                  <ArrowDown className="h-4 w-4 text-taski-accent-red" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">160h</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="text-taski-accent-red">-8h</span> par rapport au mois dernier
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Moyenne quotidienne</CardTitle>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8.2h</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Stable par rapport à la normale
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top projets par temps investi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Refonte UI</div>
                    <div className="text-sm text-muted-foreground">45h</div>
                  </div>
                  <Progress value={45} max={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Application Mobile</div>
                    <div className="text-sm text-muted-foreground">38h</div>
                  </div>
                  <Progress value={38} max={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Intégration API</div>
                    <div className="text-sm text-muted-foreground">24h</div>
                  </div>
                  <Progress value={24} max={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Dashboard Admin</div>
                    <div className="text-sm text-muted-foreground">18h</div>
                  </div>
                  <Progress value={18} max={100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
