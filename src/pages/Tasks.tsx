
import { Suspense } from 'react';
import TaskView from '@/components/tasks/TaskView';
import { Skeleton } from '@/components/ui/skeleton';

export default function Tasks() {
  return (
    <div className="animate-fade-in">
      <Suspense fallback={<TaskSkeleton />}>
        <TaskView />
      </Suspense>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-8 w-64 bg-secondary rounded-md animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 w-40 bg-secondary rounded-md animate-pulse"></div>
          <div className="h-8 w-8 bg-secondary rounded-md animate-pulse"></div>
          <div className="h-8 w-32 bg-secondary rounded-md animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, columnIndex) => (
          <div key={columnIndex} className="flex flex-col">
            <div className="flex justify-between mb-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, taskIndex) => (
                <Skeleton 
                  key={taskIndex} 
                  className="h-32 w-full rounded-lg" 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
