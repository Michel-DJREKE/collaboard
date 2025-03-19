
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  description: z.string().optional(),
  status: z.enum(['planning', 'in-progress', 'completed', 'on-hold']),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  members: z.array(z.string()).min(1, { message: 'Au moins un membre est requis' }),
});

type FormValues = z.infer<typeof formSchema>;

const TEAM_MEMBERS = [
  { id: '1', name: 'Sophie Martin', avatar: null, initials: 'SM' },
  { id: '2', name: 'Thomas Dubois', avatar: null, initials: 'TD' },
  { id: '3', name: 'Marie Leroy', avatar: null, initials: 'ML' },
  { id: '4', name: 'Lucas Bernard', avatar: null, initials: 'LB' },
];

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    id?: string;
    title?: string;
    description?: string;
    status?: 'planning' | 'in-progress' | 'completed' | 'on-hold';
    startDate?: string | Date;
    endDate?: string | Date;
    members?: string[];
  };
  onSave: (values: FormValues) => void;
}

export default function ProjectDialog({ open, onOpenChange, project, onSave }: ProjectDialogProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(project?.members || []);
  const { toast } = useToast();
  
  const isEditMode = !!project?.id;
  
  // Convert dates to Date objects if they're strings
  const getDate = (dateValue?: string | Date) => {
    if (!dateValue) return undefined;
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    try {
      return new Date(dateValue);
    } catch (error) {
      console.error("Invalid date format:", dateValue);
      return undefined;
    }
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      status: project?.status || 'planning',
      startDate: getDate(project?.startDate),
      endDate: getDate(project?.endDate),
      members: project?.members || [],
    },
  });
  
  // Update form when project changes
  useEffect(() => {
    if (open) {
      form.reset({
        title: project?.title || '',
        description: project?.description || '',
        status: project?.status || 'planning',
        startDate: getDate(project?.startDate),
        endDate: getDate(project?.endDate),
        members: project?.members || [],
      });
      
      setSelectedMembers(project?.members || []);
    }
  }, [open, project, form]);
  
  function onSubmit(values: FormValues) {
    values.members = selectedMembers;
    
    // Validate end date is after start date
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      toast({
        variant: "destructive",
        title: "Erreur de date",
        description: "La date de fin doit être ultérieure à la date de début",
      });
      return;
    }
    
    onSave(values);
    onOpenChange(false);
  }
  
  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier le projet' : 'Créer un nouveau projet'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Mettez à jour les détails de ce projet.' 
              : 'Ajoutez un nouveau projet à votre portefeuille.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez le projet en détail..." 
                      className="min-h-[100px]" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planning">Planification</SelectItem>
                      <SelectItem value="in-progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                      <SelectItem value="on-hold">En pause</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin prévue</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                          disabled={(date) => {
                            // Disable dates before start date
                            if (form.getValues().startDate) {
                              return date < form.getValues().startDate!;
                            }
                            return false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Membres de l'équipe</FormLabel>
                  <div className="border rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedMembers.length === 0 ? (
                        <div className="text-muted-foreground text-sm">Aucun membre sélectionné</div>
                      ) : (
                        selectedMembers.map(memberId => {
                          const member = TEAM_MEMBERS.find(m => m.id === memberId);
                          return (
                            <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px]">{member?.initials}</AvatarFallback>
                              </Avatar>
                              <span>{member?.name}</span>
                              <button 
                                type="button" 
                                className="ml-1 text-muted-foreground hover:text-foreground"
                                onClick={() => toggleMember(memberId)}
                              >
                                ×
                              </button>
                            </Badge>
                          );
                        })
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {TEAM_MEMBERS.filter(member => !selectedMembers.includes(member.id)).map(member => (
                        <div 
                          key={member.id} 
                          className="flex items-center p-2 hover:bg-accent rounded-md cursor-pointer"
                          onClick={() => toggleMember(member.id)}
                        >
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback className="bg-taski-blue text-white text-xs">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>{member.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">{isEditMode ? 'Mettre à jour' : 'Créer'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
