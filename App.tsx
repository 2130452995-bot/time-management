import React, { useState, useEffect } from 'react';
import { TaskData, AppView, Step } from './types';
import { generateActionPlan } from './services/geminiService';
import InputView from './components/InputView';
import TaskActiveView from './components/TaskActiveView';
import HistoryView from './components/HistoryView';
import { v4 as uuidv4 } from 'uuid';

// Helper for local storage
const loadTasks = (): TaskData[] => {
  try {
    const stored = localStorage.getItem('microstep_tasks');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load tasks", e);
    return [];
  }
};

const saveTasks = (tasks: TaskData[]) => {
  try {
    localStorage.setItem('microstep_tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks", e);
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('input');
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleCreateTask = async (input: string) => {
    setIsLoading(true);
    try {
      const plan = await generateActionPlan(input);
      
      const steps: Step[] = plan.steps.map(s => ({
        id: uuidv4(),
        text: s.text,
        encouragement: s.encouragement,
        isCompleted: false
      }));

      const newTask: TaskData = {
        id: uuidv4(),
        originalInput: input,
        title: plan.title,
        steps: steps,
        overallEncouragement: plan.overallEncouragement,
        createdAt: Date.now(),
        isCompleted: false
      };

      setTasks(prev => [newTask, ...prev]);
      setCurrentTaskId(newTask.id);
      setView('active');
    } catch (error) {
      alert("抱歉，拆解任务时遇到了一点小问题，请重试。");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = (updatedTask: TaskData) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleSelectTask = (task: TaskData) => {
    // If task is completed, we might want to "restart" it or just view it.
    // For now, let's just view/resume it.
    setCurrentTaskId(task.id);
    setView('active');
  };

  const activeTask = tasks.find(t => t.id === currentTaskId);

  return (
    <div className="w-full h-screen bg-stone-50 relative">
       {/* Simple Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sage-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-clay-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s'}}></div>

      <div className="relative z-10 h-full flex flex-col">
        {view === 'input' && (
          <InputView 
            onSubmit={handleCreateTask} 
            isLoading={isLoading}
            onViewHistory={() => setView('history')} 
          />
        )}

        {view === 'active' && activeTask && (
          <TaskActiveView 
            task={activeTask} 
            onUpdateTask={handleUpdateTask}
            onBack={() => setView('input')}
          />
        )}

        {view === 'history' && (
          <HistoryView 
            tasks={tasks} 
            onSelectTask={handleSelectTask}
            onBack={() => setView('input')}
          />
        )}
      </div>
    </div>
  );
};

export default App;