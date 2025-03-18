
import { SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTaskStore, statusColumns } from '@/lib/task-service';

const priorities = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
];

const TEAM_MEMBERS = [
  { id: '1', name: 'Sophie Martin', initials: 'SM' },
  { id: '2', name: 'Thomas Dubois', initials: 'TD' },
  { id: '3', name: 'Marie Leroy', initials: 'ML' },
  { id: '4', name: 'Lucas Bernard', initials: 'LB' },
];

// Récupérer tous les tags uniques de toutes les tâches
const getUniqueTags = (tasks: any[]) => {
  const allTags = tasks.flatMap(task => task.tags || []);
  return [...new Set(allTags)];
};

export default function FilterPopover() {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  
  const tasks = useTaskStore(state => state.tasks);
  const statusFilter = useTaskStore(state => state.statusFilter);
  const priorityFilter = useTaskStore(state => state.priorityFilter);
  const assigneeFilter = useTaskStore(state => state.assigneeFilter);
  const tagFilter = useTaskStore(state => state.tagFilter);
  const setStatusFilter = useTaskStore(state => state.setStatusFilter);
  const setPriorityFilter = useTaskStore(state => state.setPriorityFilter);
  const setAssigneeFilter = useTaskStore(state => state.setAssigneeFilter);
  const setTagFilter = useTaskStore(state => state.setTagFilter);
  const clearFilters = useTaskStore(state => state.clearFilters);
  
  const uniqueTags = getUniqueTags(tasks);
  
  // Calculer le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (statusFilter) count++;
    if (priorityFilter) count++;
    if (assigneeFilter) count++;
    if (tagFilter) count++;
    setActiveFilters(count);
  }, [statusFilter, priorityFilter, assigneeFilter, tagFilter]);
  
  const handleClear = () => {
    clearFilters();
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-taski-blue text-white text-xs flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filtres</h3>
            <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2">
              <X className="h-4 w-4 mr-1" />
              Effacer tout
            </Button>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Statut</Label>
            <RadioGroup value={statusFilter || ''} onValueChange={value => setStatusFilter(value || null)}>
              <div className="flex flex-wrap gap-2">
                {statusColumns.map(status => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={status.id} 
                      id={`status-${status.id}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`status-${status.id}`}
                      className="flex gap-2 items-center rounded-full px-3 py-1 text-xs border border-primary/20 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer transition-colors"
                    >
                      {status.title}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Priorité</Label>
            <RadioGroup value={priorityFilter || ''} onValueChange={value => setPriorityFilter(value || null)}>
              <div className="flex flex-wrap gap-2">
                {priorities.map(priority => (
                  <div key={priority.value} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={priority.value} 
                      id={`priority-${priority.value}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`priority-${priority.value}`}
                      className="flex gap-2 items-center rounded-full px-3 py-1 text-xs border border-primary/20 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer transition-colors"
                    >
                      {priority.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Assigné à</Label>
            <RadioGroup value={assigneeFilter || ''} onValueChange={value => setAssigneeFilter(value || null)}>
              <div className="flex flex-wrap gap-2">
                {TEAM_MEMBERS.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={member.name} 
                      id={`member-${member.id}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`member-${member.id}`}
                      className="flex gap-2 items-center rounded-full px-3 py-1 text-xs border border-primary/20 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-secondary cursor-pointer transition-colors"
                    >
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={tagFilter === tag ? "default" : "outline"}
                  className={`cursor-pointer ${tagFilter === tag ? '' : 'hover:bg-secondary'}`}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>Appliquer</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
