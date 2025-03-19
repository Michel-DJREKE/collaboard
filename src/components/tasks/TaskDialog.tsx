
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Tags, Users, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['to-do', 'in-progress', 'review', 'done']),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TEAM_MEMBERS = [
  { id: '1', name: 'Sophie Martin', avatar: null, initials: 'SM' },
  { id: '2', name: 'Thomas Dubois', avatar: null, initials: 'TD' },
  { id: '3', name: 'Marie Leroy', avatar: null, initials: 'ML' },
  { id: '4', name: 'Lucas Bernard', avatar: null, initials: 'LB' },
];

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: {
    id?: string;
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'to-do' | 'in-progress' | 'review' | 'done';
    dueDate?: string | Date;
    assignee?: {
      name: string;
      avatar?: string;
      initials?: string;
    };
    tags?: string[];
    progress?: number;
  };
  onSave: (values: FormValues) => void;
}

const AVAILABLE_TAGS = ['Design', 'Frontend', 'Backend', 'UI/UX', 'Performance', 'Documentation', 'QA', 'Security', 'DevOps', 'Testing', 'Responsive', 'CSS', 'React'];

export default function TaskDialog({ open, onOpenChange, task, onSave }: TaskDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  const isEditMode = !!task?.id;
  
  // Convert dueDate to Date object if it's a string or date
  const getDueDate = () => {
    if (!task?.dueDate) return undefined;
    
    if (task.dueDate instanceof Date) {
      return task.dueDate;
    }
    
    try {
      return new Date(task.dueDate);
    } catch (error) {
      console.error("Invalid date format:", task.dueDate);
      return undefined;
    }
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'to-do',
      dueDate: getDueDate(),
      assigneeId: task?.assignee ? TEAM_MEMBERS.find(member => member.name === task.assignee?.name)?.id : undefined,
      tags: task?.tags || [],
    },
  });
  
  // Update form when task changes
  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium',
        status: task?.status || 'to-do',
        dueDate: getDueDate(),
        assigneeId: task?.assignee ? TEAM_MEMBERS.find(member => member.name === task.assignee?.name)?.id : undefined,
        tags: [],
      });
      
      setSelectedTags(task?.tags || []);
    }
  }, [open, task, form]);
  
  function onSubmit(values: FormValues) {
    values.tags = selectedTags;
    onSave(values);
    onOpenChange(false);
  }
  
  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag(tagInput);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Mettez à jour les détails de cette tâche.' 
              : 'Ajoutez une nouvelle tâche à votre projet.'}
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
                    <Input placeholder="Titre de la tâche" {...field} />
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
                      placeholder="Décrivez la tâche en détail..." 
                      className="min-h-[100px]" 
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <SelectItem value="to-do">À faire</SelectItem>
                        <SelectItem value="in-progress">En cours</SelectItem>
                        <SelectItem value="review">En revue</SelectItem>
                        <SelectItem value="done">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'échéance</FormLabel>
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
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigné à</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assigner à un membre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEAM_MEMBERS.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={member.avatar || undefined} />
                                <AvatarFallback className="bg-taski-blue text-white text-xs">
                                  {member.initials}
                                </AvatarFallback>
                              </Avatar>
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="outline" className="bg-taski-gray-100 dark:bg-taski-gray-800">
                    {tag}
                    <button 
                      type="button" 
                      className="ml-1 text-muted-foreground hover:text-foreground" 
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  placeholder="Ajouter un tag..." 
                  className="flex-grow"
                />
                <Button type="button" variant="outline" onClick={() => addTag(tagInput)}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {AVAILABLE_TAGS.filter(tag => !selectedTags.includes(tag)).map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="cursor-pointer bg-secondary hover:bg-accent transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
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
