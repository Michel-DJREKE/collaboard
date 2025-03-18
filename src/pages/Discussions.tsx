
import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Filter, 
  User,
  Users,
  Hash,
  ChevronDown
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: string;
  isUnread?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  unreadCount?: number;
  messages: Message[];
  members?: {
    name: string;
    avatar?: string;
    initials: string;
    status?: 'online' | 'away' | 'offline';
  }[];
}

const CHANNELS: Channel[] = [
  {
    id: '1',
    name: 'Équipe Design',
    type: 'group',
    unreadCount: 3,
    messages: [
      {
        id: 'm1',
        content: 'Bonjour à tous ! J\'ai terminé les maquettes pour la page d\'accueil. Vous pouvez les consulter ici : [lien]',
        sender: {
          name: 'Sophie Martin',
          initials: 'SM'
        },
        timestamp: '10:32',
        isUnread: true
      },
      {
        id: 'm2',
        content: 'Super travail Sophie ! J\'aime beaucoup l\'approche minimaliste.',
        sender: {
          name: 'Thomas Dubois',
          initials: 'TD'
        },
        timestamp: '10:40'
      }
    ],
    members: [
      {
        name: 'Sophie Martin',
        initials: 'SM',
        status: 'online'
      },
      {
        name: 'Thomas Dubois',
        initials: 'TD',
        status: 'online'
      },
      {
        name: 'Marie Leroy',
        initials: 'ML',
        status: 'away'
      }
    ]
  },
  {
    id: '2',
    name: 'Projet Refonte',
    type: 'channel',
    messages: [
      {
        id: 'm3',
        content: 'Point d\'étape pour le sprint 3 : nous sommes à 85% des objectifs.',
        sender: {
          name: 'Lucas Bernard',
          initials: 'LB'
        },
        timestamp: '09:15'
      }
    ],
    members: [
      {
        name: 'Lucas Bernard',
        initials: 'LB',
        status: 'online'
      },
      {
        name: 'Sophie Martin',
        initials: 'SM',
        status: 'online'
      },
      {
        name: 'Thomas Dubois',
        initials: 'TD',
        status: 'online'
      },
      {
        name: 'Marie Leroy',
        initials: 'ML',
        status: 'away'
      }
    ]
  },
  {
    id: '3',
    name: 'Marie Leroy',
    type: 'direct',
    unreadCount: 1,
    messages: [
      {
        id: 'm4',
        content: 'Est-ce que tu as eu le temps de regarder les specs techniques ?',
        sender: {
          name: 'Marie Leroy',
          initials: 'ML'
        },
        timestamp: '11:05',
        isUnread: true
      }
    ],
    members: [
      {
        name: 'Marie Leroy',
        initials: 'ML',
        status: 'away'
      }
    ]
  }
];

export default function Discussions() {
  const [activeChannelId, setActiveChannelId] = useState(CHANNELS[0].id);
  const [messageInput, setMessageInput] = useState('');
  
  const activeChannel = CHANNELS.find(channel => channel.id === activeChannelId);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Here you would normally send the message to your backend
    console.log('Sending message:', messageInput);
    
    // Clear input
    setMessageInput('');
  };
  
  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'direct':
        return <User className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'channel':
        return <Hash className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Discussions</h1>
        
        <div className="flex items-center gap-2">
          <Button variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouvelle discussion</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">
        {/* Sidebar with channels list */}
        <div className="lg:col-span-1 border rounded-lg overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b bg-secondary/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-9 bg-background"
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="px-2 pt-2 border-b">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
                <TabsTrigger value="direct" className="flex-1">Messages</TabsTrigger>
                <TabsTrigger value="channels" className="flex-1">Canaux</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="overflow-y-auto h-[calc(100%-6rem)]">
                {CHANNELS.map(channel => (
                  <button
                    key={channel.id}
                    className={`flex items-center justify-between w-full p-3 hover:bg-secondary rounded-md transition-colors ${activeChannelId === channel.id ? 'bg-secondary' : ''}`}
                    onClick={() => setActiveChannelId(channel.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center h-9 w-9 rounded-md ${channel.type === 'direct' ? 'bg-taski-accent-green' : 'bg-taski-accent-purple'} text-white`}>
                        {channel.type === 'direct' ? (
                          <span className="font-medium text-sm">{channel.members?.[0].initials}</span>
                        ) : (
                          getChannelIcon(channel.type)
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{channel.name}</div>
                        {channel.messages.length > 0 && (
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {channel.messages[channel.messages.length - 1].content}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {channel.unreadCount && (
                      <Badge variant="default" className="bg-taski-accent-red">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="direct" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Vue messages privés à venir</p>
              </div>
            </TabsContent>
            
            <TabsContent value="channels" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                <Hash className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Vue canaux à venir</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Main chat area */}
        <div className="lg:col-span-3 border rounded-lg overflow-hidden flex flex-col h-full">
          {activeChannel && (
            <>
              <div className="p-4 border-b flex items-center justify-between bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center h-9 w-9 rounded-md ${activeChannel.type === 'direct' ? 'bg-taski-accent-green' : 'bg-taski-accent-purple'} text-white`}>
                    {activeChannel.type === 'direct' ? (
                      <span className="font-medium text-sm">{activeChannel.members?.[0].initials}</span>
                    ) : (
                      getChannelIcon(activeChannel.type)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{activeChannel.name}</h3>
                    {activeChannel.members && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{activeChannel.members.length} membres</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        Détails de la conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Ajouter des membres
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-taski-accent-red">
                        Quitter la conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {activeChannel.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3 mb-6">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.sender.avatar} />
                      <AvatarFallback className="bg-taski-blue text-white">
                        {message.sender.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.sender.name}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <div className="mt-1 text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input 
                    placeholder="Écrivez un message..." 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!messageInput.trim()}>Envoyer</Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
