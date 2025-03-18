
import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  FolderPlus,
  File as FileIcon,
  Image,
  FileText,
  FileSpreadsheet,
  FilePresentation,
  FilePdf, 
  Grid,
  List,
  MoreHorizontal,
  Download,
  Share,
  Trash2
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
interface File {
  id: string;
  name: string;
  type: 'image' | 'document' | 'spreadsheet' | 'presentation' | 'pdf';
  size: string;
  uploadedBy: {
    name: string;
    avatar?: string;
    initials: string;
  };
  updatedAt: string;
  projectName?: string;
  tags?: string[];
}

// Sample data
const FILES: File[] = [
  {
    id: '1',
    name: 'Maquette Dashboard.png',
    type: 'image',
    size: '2.4 MB',
    uploadedBy: {
      name: 'Sophie Martin',
      initials: 'SM'
    },
    updatedAt: 'Il y a 2 heures',
    projectName: 'Refonte UI',
    tags: ['Design', 'Dashboard']
  },
  {
    id: '2',
    name: 'Specifications Techniques.docx',
    type: 'document',
    size: '540 KB',
    uploadedBy: {
      name: 'Thomas Dubois',
      initials: 'TD'
    },
    updatedAt: 'Hier, 16:35',
    projectName: 'Refonte UI',
    tags: ['Documentation']
  },
  {
    id: '3',
    name: 'Budget 2023.xlsx',
    type: 'spreadsheet',
    size: '1.2 MB',
    uploadedBy: {
      name: 'Marie Leroy',
      initials: 'ML'
    },
    updatedAt: 'Il y a 3 jours',
    projectName: 'Admin',
    tags: ['Finance']
  },
  {
    id: '4',
    name: 'Présentation Client.pptx',
    type: 'presentation',
    size: '3.8 MB',
    uploadedBy: {
      name: 'Lucas Bernard',
      initials: 'LB'
    },
    updatedAt: 'Il y a 5 jours',
    projectName: 'Marketing',
    tags: ['Présentation', 'Client']
  },
  {
    id: '5',
    name: 'Contrat de services.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedBy: {
      name: 'Thomas Dubois',
      initials: 'TD'
    },
    updatedAt: 'Il y a 1 semaine',
    projectName: 'Légal',
    tags: ['Contrat', 'Client']
  },
  {
    id: '6',
    name: 'Analyse des données.xlsx',
    type: 'spreadsheet',
    size: '2.1 MB',
    uploadedBy: {
      name: 'Marie Leroy',
      initials: 'ML'
    },
    updatedAt: 'Il y a 2 semaines',
    projectName: 'Marketing',
    tags: ['Analyse', 'Données']
  }
];

export default function Files() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get file icon based on type
  const getFileIcon = (type: File['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-6 w-6 text-taski-accent-green" />;
      case 'document':
        return <FileText className="h-6 w-6 text-taski-blue" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-taski-accent-purple" />;
      case 'presentation':
        return <FilePresentation className="h-6 w-6 text-taski-accent-yellow" />;
      case 'pdf':
        return <FilePdf className="h-6 w-6 text-taski-accent-red" />;
    }
  };
  
  // Filter files based on search query
  const filteredFiles = FILES.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Fichiers</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Rechercher un fichier..." 
              className="pl-9 w-[200px] sm:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid className="h-4 w-4" />
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Tous les fichiers</DropdownMenuItem>
              <DropdownMenuItem>Images</DropdownMenuItem>
              <DropdownMenuItem>Documents</DropdownMenuItem>
              <DropdownMenuItem>Tableaux</DropdownMenuItem>
              <DropdownMenuItem>Présentations</DropdownMenuItem>
              <DropdownMenuItem>PDFs</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau fichier</span>
          </Button>
        </div>
      </div>
      
      <Card className="mt-2 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium mb-1">Stockage utilisé</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">9.8 Go utilisés sur 20 Go</span>
                <span className="text-sm font-medium">49%</span>
              </div>
              <Progress value={49} className="h-2" />
            </div>
            
            <div className="flex items-center gap-6 border-l pl-6 hidden md:flex">
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-taski-blue-light text-taski-blue mx-auto mb-1">
                  <Image className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">Images</p>
                <p className="text-xs text-muted-foreground">4.2 Go</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-taski-accent-purple/20 text-taski-accent-purple mx-auto mb-1">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">Documents</p>
                <p className="text-xs text-muted-foreground">3.1 Go</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-taski-accent-yellow/20 text-taski-accent-yellow mx-auto mb-1">
                  <FilePresentation className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">Autres</p>
                <p className="text-xs text-muted-foreground">2.5 Go</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" className="gap-1">
                <FolderPlus className="h-4 w-4" />
                <span>Nouveau dossier</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tous les fichiers</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="shared">Partagés</TabsTrigger>
          <TabsTrigger value="starred">Favoris</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FileIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium mb-2">Aucun fichier trouvé</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Commencez par télécharger vos premiers fichiers"}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4 hover:border-taski-blue hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="truncate max-w-[150px]">
                        <h3 className="font-medium text-sm truncate">{file.name}</h3>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" /> Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" /> Partager
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-taski-accent-red">
                          <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={file.uploadedBy.avatar} />
                          <AvatarFallback className="bg-taski-blue text-white text-xs">
                            {file.uploadedBy.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{file.uploadedBy.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{file.updatedAt}</span>
                    </div>
                    
                    {file.projectName && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {file.projectName}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-4 py-3 font-medium text-sm">Nom</th>
                    <th className="text-left px-4 py-3 font-medium text-sm hidden md:table-cell">Projet</th>
                    <th className="text-left px-4 py-3 font-medium text-sm hidden sm:table-cell">Taille</th>
                    <th className="text-left px-4 py-3 font-medium text-sm hidden lg:table-cell">Auteur</th>
                    <th className="text-left px-4 py-3 font-medium text-sm">Modifié</th>
                    <th className="text-right px-4 py-3 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file, index) => (
                    <tr key={file.id} className={`hover:bg-secondary/50 ${index < filteredFiles.length - 1 ? 'border-b' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="font-medium text-sm">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {file.projectName && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {file.projectName}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{file.size}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={file.uploadedBy.avatar} />
                            <AvatarFallback className="bg-taski-blue text-white text-xs">
                              {file.uploadedBy.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{file.uploadedBy.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{file.updatedAt}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" /> Télécharger
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" /> Partager
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-taski-accent-red">
                              <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="m-0">
          <div className="text-center py-12">
            <FileIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">Fichiers récents</h3>
            <p className="text-muted-foreground">
              Consultez vos fichiers les plus récents ici.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="shared" className="m-0">
          <div className="text-center py-12">
            <Share className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">Fichiers partagés</h3>
            <p className="text-muted-foreground">
              Consultez les fichiers partagés avec vous ici.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="starred" className="m-0">
          <div className="text-center py-12">
            <FileIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-lg font-medium mb-2">Fichiers favoris</h3>
            <p className="text-muted-foreground">
              Retrouvez vos fichiers favoris ici pour un accès rapide.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
