
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

interface ProjectFilterProps {
  statusFilter: string | null;
  onFilterChange: (status: string | null) => void;
}

export default function ProjectFilter({ statusFilter, onFilterChange }: ProjectFilterProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={statusFilter ? "text-primary border-primary" : ""}>
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <div className="p-4 pb-2">
          <h4 className="font-medium text-sm mb-3">Filtrer par statut</h4>
          <div className="space-y-2">
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onFilterChange(null)}
            >
              Tous les statuts
            </Button>
            <Button
              variant={statusFilter === 'planning' ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onFilterChange('planning')}
            >
              Planification
            </Button>
            <Button
              variant={statusFilter === 'in-progress' ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onFilterChange('in-progress')}
            >
              En cours
            </Button>
            <Button
              variant={statusFilter === 'completed' ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onFilterChange('completed')}
            >
              Terminé
            </Button>
            <Button
              variant={statusFilter === 'on-hold' ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onFilterChange('on-hold')}
            >
              En pause
            </Button>
          </div>
        </div>
        <div className="border-t p-4 pt-2 flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onFilterChange(null);
              setOpen(false);
            }}
          >
            Réinitialiser
          </Button>
          <Button
            size="sm"
            onClick={() => setOpen(false)}
          >
            Appliquer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
