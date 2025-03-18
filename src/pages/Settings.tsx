
import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  HelpCircle, 
  CreditCard, 
  Check,
  Mail,
  Phone,
  LanguagesIcon,
  Moon,
  Sun,
  Users,
  Clock,
  LogOut
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Simulate theme toggle
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <TabsList className="flex flex-col items-start h-auto bg-transparent p-0 gap-1">
              <TabsTrigger value="profile" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="account" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <Shield className="h-4 w-4 mr-2" />
                Compte
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="team" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <Users className="h-4 w-4 mr-2" />
                Équipe
              </TabsTrigger>
              <TabsTrigger value="billing" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <CreditCard className="h-4 w-4 mr-2" />
                Facturation
              </TabsTrigger>
              <Separator className="my-2" />
              <TabsTrigger value="data" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <Database className="h-4 w-4 mr-2" />
                Données
              </TabsTrigger>
              <TabsTrigger value="help" className="w-full justify-start px-3 data-[state=active]:bg-secondary">
                <HelpCircle className="h-4 w-4 mr-2" />
                Aide
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="profile" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil</CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et vos préférences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="https://avatars.githubusercontent.com/u/12345678" />
                      <AvatarFallback className="bg-taski-blue text-white text-xl">JD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Chef de projet · Membre depuis Jan 2023</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Changer la photo</Button>
                        <Button variant="outline" size="sm" className="text-taski-accent-red hover:text-taski-accent-red">Supprimer</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@taski.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job">Intitulé du poste</Label>
                      <Input id="job" defaultValue="Chef de projet" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" defaultValue="+33 6 12 34 56 78" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      rows={4} 
                      className="w-full p-3 rounded-md border border-input bg-background"
                      defaultValue="Chef de projet expérimenté avec plus de 5 ans d'expérience dans la gestion de projets digitaux et le développement de produits."
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline">Annuler</Button>
                  <Button>Enregistrer</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Compétences et expertises</CardTitle>
                  <CardDescription>
                    Ajoutez vos compétences pour aider à l'attribution des tâches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      Gestion de projet
                      <button className="ml-1 hover:text-taski-accent-red">×</button>
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      Agile
                      <button className="ml-1 hover:text-taski-accent-red">×</button>
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      UX Design
                      <button className="ml-1 hover:text-taski-accent-red">×</button>
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      Product Management
                      <button className="ml-1 hover:text-taski-accent-red">×</button>
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      Marketing
                      <button className="ml-1 hover:text-taski-accent-red">×</button>
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input placeholder="Ajouter une compétence..." />
                    <Button>Ajouter</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Liens sociaux</CardTitle>
                  <CardDescription>
                    Connectez vos profils de réseaux sociaux.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        <span>johndoe.com</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 12C8.13401 12 5 15.134 5 19H19C19 15.134 15.866 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>linkedin.com/in/johndoe</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8L10.5 12.5L18 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 12H3V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>twitter.com/johndoe</span>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <Button variant="outline" className="w-full">Ajouter un nouveau profil</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compte</CardTitle>
                  <CardDescription>
                    Gérez les paramètres de votre compte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Adresse e-mail</h3>
                        <p className="text-sm text-muted-foreground">john@taski.com</p>
                      </div>
                      <Button variant="outline">Modifier</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mot de passe</h3>
                        <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                      </div>
                      <Button variant="outline">Changer</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Authentification à deux facteurs</h3>
                        <p className="text-sm text-muted-foreground">Protégez votre compte avec une sécurité supplémentaire</p>
                      </div>
                      <Button variant="outline">Configurer</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Compte actif</h3>
                        <p className="text-sm text-muted-foreground">Votre compte est actuellement actif</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de langue et fuseau horaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Sélectionner une langue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select defaultValue="europe-paris">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Sélectionner un fuseau horaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe-paris">Europe/Paris (GMT+1)</SelectItem>
                          <SelectItem value="america-new_york">America/New York (GMT-5)</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                          <SelectItem value="australia-sydney">Australia/Sydney (GMT+10)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Format de date</Label>
                    <Select defaultValue="dd-mm-yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Sélectionner un format de date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd-mm-yyyy">JJ/MM/AAAA</SelectItem>
                        <SelectItem value="mm-dd-yyyy">MM/JJ/AAAA</SelectItem>
                        <SelectItem value="yyyy-mm-dd">AAAA/MM/JJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les préférences</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Exporter les données</CardTitle>
                  <CardDescription>
                    Téléchargez une copie de vos données personnelles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="export-tasks" className="h-4 w-4" />
                      <Label htmlFor="export-tasks">Tâches</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="export-projects" className="h-4 w-4" />
                      <Label htmlFor="export-projects">Projets</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="export-comments" className="h-4 w-4" />
                      <Label htmlFor="export-comments">Commentaires</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="export-activity" className="h-4 w-4" />
                      <Label htmlFor="export-activity">Historique d'activité</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Exporter les données</Button>
                </CardFooter>
              </Card>
              
              <Card className="border-taski-accent-red/20">
                <CardHeader>
                  <CardTitle className="text-taski-accent-red">Zone dangereuse</CardTitle>
                  <CardDescription>
                    Les actions suivantes sont irréversibles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Supprimer mon compte</h3>
                      <p className="text-sm text-muted-foreground">Supprimez définitivement votre compte et toutes vos données.</p>
                    </div>
                    <Button variant="destructive">Supprimer</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous recevez des notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Canaux de notification</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Label htmlFor="email-notif">Email</Label>
                          </div>
                          <Switch id="email-notif" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <Label htmlFor="push-notif">Notifications push</Label>
                          </div>
                          <Switch id="push-notif" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <Label htmlFor="sms-notif">SMS</Label>
                          </div>
                          <Switch id="sms-notif" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Types de notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="task-notif" className="font-medium">Tâches</Label>
                            <p className="text-sm text-muted-foreground">Nouvelles tâches, mises à jour et échéances</p>
                          </div>
                          <Switch id="task-notif" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="comment-notif" className="font-medium">Commentaires</Label>
                            <p className="text-sm text-muted-foreground">Réponses et mentions</p>
                          </div>
                          <Switch id="comment-notif" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="project-notif" className="font-medium">Projets</Label>
                            <p className="text-sm text-muted-foreground">Modifications et mises à jour</p>
                          </div>
                          <Switch id="project-notif" checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="team-notif" className="font-medium">Équipe</Label>
                            <p className="text-sm text-muted-foreground">Nouveaux membres et changements</p>
                          </div>
                          <Switch id="team-notif" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="system-notif" className="font-medium">Système</Label>
                            <p className="text-sm text-muted-foreground">Maintenance et mises à jour</p>
                          </div>
                          <Switch id="system-notif" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Fréquence des notifications</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="frequency">Recevoir des notifications</Label>
                          <Select defaultValue="realtime">
                            <SelectTrigger id="frequency">
                              <SelectValue placeholder="Choisir une fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">En temps réel</SelectItem>
                              <SelectItem value="hourly">Toutes les heures (groupées)</SelectItem>
                              <SelectItem value="daily">Quotidien (résumé)</SelectItem>
                              <SelectItem value="weekly">Hebdomadaire (résumé)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les préférences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de votre interface.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Thème</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`border-2 rounded-lg p-4 flex items-center gap-2 cursor-pointer ${theme === 'light' ? 'border-taski-blue' : 'border-transparent'}`}
                        onClick={() => toggleTheme()}
                      >
                        <Sun className="h-5 w-5" />
                        <span>Clair</span>
                        {theme === 'light' && <Check className="h-4 w-4 ml-auto text-taski-blue" />}
                      </div>
                      <div 
                        className={`border-2 rounded-lg p-4 flex items-center gap-2 cursor-pointer ${theme === 'dark' ? 'border-taski-blue' : 'border-transparent'}`}
                        onClick={() => toggleTheme()}
                      >
                        <Moon className="h-5 w-5" />
                        <span>Sombre</span>
                        {theme === 'dark' && <Check className="h-4 w-4 ml-auto text-taski-blue" />}
                      </div>
                      <div 
                        className={`border-2 rounded-lg p-4 flex items-center gap-2 cursor-pointer border-transparent`}
                      >
                        <LanguagesIcon className="h-5 w-5" />
                        <span>Système</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Disposition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer border-taski-blue">
                        <div className="h-20 w-full bg-muted rounded-md flex">
                          <div className="h-full w-1/5 bg-secondary rounded-l-md"></div>
                          <div className="h-full flex-1 p-2">
                            <div className="h-3 w-1/3 bg-secondary rounded-md mb-2"></div>
                            <div className="h-3 w-full bg-secondary rounded-md opacity-50"></div>
                          </div>
                        </div>
                        <span>Par défaut</span>
                        <Check className="h-4 w-4 text-taski-blue" />
                      </div>
                      <div className="border-2 rounded-lg p-3 flex flex-col items-center gap-2 cursor-pointer border-transparent">
                        <div className="h-20 w-full bg-muted rounded-md flex">
                          <div className="h-full flex-1 p-2">
                            <div className="h-3 w-1/3 bg-secondary rounded-md mb-2"></div>
                            <div className="h-3 w-full bg-secondary rounded-md opacity-50"></div>
                          </div>
                        </div>
                        <span>Centré</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Couleur d'accentuation</h3>
                    <div className="flex gap-3 flex-wrap">
                      <button className="h-8 w-8 rounded-full bg-taski-blue ring-2 ring-offset-2 ring-taski-blue"></button>
                      <button className="h-8 w-8 rounded-full bg-taski-accent-purple"></button>
                      <button className="h-8 w-8 rounded-full bg-taski-accent-green"></button>
                      <button className="h-8 w-8 rounded-full bg-taski-accent-yellow"></button>
                      <button className="h-8 w-8 rounded-full bg-taski-accent-red"></button>
                      <button className="h-8 w-8 rounded-full bg-taski-gray-700 flex items-center justify-center text-white text-xs">+</button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Animations et transitions</h3>
                      <p className="text-sm text-muted-foreground">Activer les animations d'interface</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Mode compact</h3>
                      <p className="text-sm text-muted-foreground">Réduire l'espacement entre les éléments</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Enregistrer les préférences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="team" className="mt-0 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Membres de l'équipe</CardTitle>
                    <CardDescription>
                      Gérez les membres et leurs permissions.
                    </CardDescription>
                  </div>
                  <Button>Inviter membre</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="https://avatars.githubusercontent.com/u/12345678" />
                          <AvatarFallback className="bg-taski-blue text-white">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-muted-foreground">john@taski.com</div>
                        </div>
                      </div>
                      <Badge>Administrateur</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-taski-accent-purple text-white">SM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Sophie Martin</div>
                          <div className="text-sm text-muted-foreground">sophie@taski.com</div>
                        </div>
                      </div>
                      <Badge variant="outline">Designer</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-taski-accent-green text-white">TD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Thomas Dubois</div>
                          <div className="text-sm text-muted-foreground">thomas@taski.com</div>
                        </div>
                      </div>
                      <Badge variant="outline">Développeur</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-taski-accent-yellow text-white">ML</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Marie Leroy</div>
                          <div className="text-sm text-muted-foreground">marie@taski.com</div>
                        </div>
                      </div>
                      <Badge variant="outline">Développeur</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-taski-accent-red text-white">LB</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Lucas Bernard</div>
                          <div className="text-sm text-muted-foreground">lucas@taski.com</div>
                        </div>
                      </div>
                      <Badge variant="outline">Chef de projet</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Rôles et permissions</CardTitle>
                  <CardDescription>
                    Configurez les niveaux d'accès pour chaque rôle.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Administrateur</h3>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Contrôle total du compte</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Inviter et supprimer des membres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Gérer les paramètres de facturation</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Chef de projet</h3>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Créer et gérer des projets</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Assigner des tâches à l'équipe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Accéder aux rapports et statistiques</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Membre</h3>
                        <Button variant="outline" size="sm">Modifier</Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Voir et travailler sur des tâches assignées</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-taski-accent-green" />
                          <span className="text-sm">Commenter et collaborer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Abonnement actuel</CardTitle>
                  <CardDescription>
                    Gérez votre abonnement et vos options de paiement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg mb-6 bg-secondary/50">
                    <div>
                      <h3 className="font-medium text-lg">Plan Pro</h3>
                      <p className="text-muted-foreground">Facturation mensuelle - Prochaine facture le 15/11/2023</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Badge className="mb-1">29€/mois</Badge>
                      <div className="text-xs text-muted-foreground">5 membres inclus</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Méthode de paiement</h3>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 bg-taski-gray-300 dark:bg-taski-gray-700 rounded flex items-center justify-center text-xs font-medium">VISA</div>
                        <div>
                          <div className="font-medium">Visa terminant par 4242</div>
                          <div className="text-xs text-muted-foreground">Expire le 12/2025</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <Button variant="outline" className="flex-1">Changer de forfait</Button>
                  <Button variant="outline" className="flex-1 border-taski-accent-red text-taski-accent-red hover:text-taski-accent-red">Annuler l'abonnement</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Historique de facturation</CardTitle>
                  <CardDescription>
                    Consultez vos factures précédentes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Facture #1092</div>
                        <div className="text-sm text-muted-foreground">15 Octobre 2023</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">29,00 €</span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Facture #1081</div>
                        <div className="text-sm text-muted-foreground">15 Septembre 2023</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">29,00 €</span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Facture #1073</div>
                        <div className="text-sm text-muted-foreground">15 Août 2023</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">29,00 €</span>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des données</CardTitle>
                  <CardDescription>
                    Configurez l'utilisation et la rétention de vos données.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Sauvegarde automatique</h3>
                        <p className="text-sm text-muted-foreground">Sauvegarder automatiquement votre travail</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Historique des versions</h3>
                        <p className="text-sm text-muted-foreground">Conserver l'historique des modifications</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Données d'utilisation</h3>
                        <p className="text-sm text-muted-foreground">Collecter des statistiques anonymes pour améliorer le service</p>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Période de rétention des données</h3>
                    <Select defaultValue="unlimited">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 jours</SelectItem>
                        <SelectItem value="90days">90 jours</SelectItem>
                        <SelectItem value="1year">1 an</SelectItem>
                        <SelectItem value="unlimited">Illimité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Importation et exportation</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1">Importer des données</Button>
                      <Button variant="outline" className="flex-1">Exporter toutes les données</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité</CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de confidentialité.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Visibilité du profil</h3>
                      <p className="text-sm text-muted-foreground">Qui peut voir votre profil</p>
                    </div>
                    <Select defaultValue="team">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Tout le monde</SelectItem>
                        <SelectItem value="team">Mon équipe uniquement</SelectItem>
                        <SelectItem value="private">Privé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Statut en ligne</h3>
                      <p className="text-sm text-muted-foreground">Afficher quand vous êtes actif</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Historique d'activité</h3>
                      <p className="text-sm text-muted-foreground">Montrer votre activité récente aux membres de l'équipe</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="help" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aide et support</CardTitle>
                  <CardDescription>
                    Besoin d'aide ? Consultez nos ressources ou contactez-nous.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-taski-blue hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-md bg-taski-blue/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-taski-blue" />
                        </div>
                        <h3 className="font-medium">Documentation</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Consultez notre documentation détaillée pour apprendre à utiliser toutes les fonctionnalités.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-taski-blue hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-md bg-taski-accent-purple/10 flex items-center justify-center">
                          <HelpCircle className="h-5 w-5 text-taski-accent-purple" />
                        </div>
                        <h3 className="font-medium">Centre d'aide</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Trouvez des réponses à vos questions dans notre base de connaissances.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-taski-blue hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-md bg-taski-accent-green/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-taski-accent-green" />
                        </div>
                        <h3 className="font-medium">Support technique</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Contactez notre équipe de support technique pour résoudre vos problèmes.
                      </p>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-taski-blue hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-md bg-taski-accent-yellow/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-taski-accent-yellow" />
                        </div>
                        <h3 className="font-medium">Communauté</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Rejoignez notre communauté pour partager des astuces et obtenir de l'aide.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">Contactez-nous directement</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>support@taski.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+33 1 23 45 67 89</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-secondary/50">
                    <h3 className="font-medium mb-2">Feedback</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nous aimerions connaître votre avis sur notre application. Vos commentaires nous aident à nous améliorer.
                    </p>
                    <Button variant="outline">Partager mon avis</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>À propos</CardTitle>
                  <CardDescription>
                    Informations sur TASKI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Version</h3>
                    <span>1.2.3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Dernière mise à jour</h3>
                    <span>15 Octobre 2023</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Conditions d'utilisation</h3>
                    <Button variant="link" className="p-0">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Politique de confidentialité</h3>
                    <Button variant="link" className="p-0">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Licences</h3>
                    <Button variant="link" className="p-0">Voir</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
