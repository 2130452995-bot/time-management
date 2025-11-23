import React, { useEffect, useState } from 'react';
import { TaskData } from '../types';
import StepItem from './StepItem';
import { generateMotivationalImage } from '../services/geminiService';

interface TaskActiveViewProps {
  task: TaskData;
  onUpdateTask: (task: TaskData) => void;
  onBack: () => void;
}

const TaskActiveView: React.FC<TaskActiveViewProps> = ({ task, onUpdateTask, onBack }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      if (!task.imageUrl && !isGeneratingImage) {
        setIsGeneratingImage(true);
        const url = await generateMotivationalImage(task.title + ", " + task.originalInput);
        if (url) {
          onUpdateTask({ ...task, imageUrl: url });
        }
        setIsGeneratingImage(false);
      }
    };
    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount if image is missing

  const handleToggleStep = (stepId: string) => {
    const updatedSteps = task.steps.map(s => 
      s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    
    const allCompleted = updatedSteps.every(s => s.isCompleted);
    
    onUpdateTask({
      ...task,
      steps: updatedSteps,
      isCompleted: allCompleted,
      completedAt: allCompleted ? Date.now() : undefined
    });
  };

  const completedCount = task.steps.filter(s => s.isCompleted).length;
  const progress = Math.round((completedCount / task.steps.length) * 100);

  return (
    <div className="h-full flex flex-col md:flex-row animate-fade-in gap-6 overflow-hidden p-4 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* Left Panel: Steps */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="mb-6 flex items-center justify-between flex-shrink-0">
          <button 
            onClick={onBack}
            className="text-stone-400 hover:text-stone-600 transition-colors flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回
          </button>
          <div className="bg-sage-100 text-sage-800 text-xs px-3 py-1 rounded-full font-medium">
            进度 {progress}%
          </div>
        </div>

        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2 text-sage-900">
            {task.title}
          </h1>
          <p className="text-stone-500 font-light">
            {task.overallEncouragement}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-stone-100 rounded-full mb-6 flex-shrink-0 overflow-hidden">
          <div 
            className="h-full bg-sage-400 transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scrollable Steps List */}
        <div className="flex-1 overflow-y-auto pr-2 pb-12">
          {task.steps.map((step, index) => (
             // Simple fade delay for staggered entry
            <div key={step.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <StepItem step={step} onToggle={handleToggleStep} />
            </div>
          ))}

          {task.isCompleted && (
            <div className="mt-8 p-6 bg-clay-100 rounded-2xl text-center animate-fade-in">
              <div className="inline-block p-3 bg-clay-200 rounded-full text-clay-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-clay-700 mb-1">太棒了！</h3>
              <p className="text-clay-600">你迈出了一大步。休息一下，或者去历史记录看看你的成就。</p>
              <button 
                onClick={onBack}
                className="mt-4 px-6 py-2 bg-clay-500 hover:bg-clay-600 text-white rounded-xl transition-colors"
              >
                完成并返回
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Visual & Input Context */}
      <div className="hidden md:flex w-1/3 lg:w-5/12 flex-col gap-4 h-full flex-shrink-0">
        {/* Generated Image Card */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-3 border border-stone-100 flex flex-col relative overflow-hidden">
           {task.imageUrl ? (
             <img 
              src={task.imageUrl} 
              alt="Motivation" 
              className="w-full h-full object-cover rounded-2xl animate-fade-in"
             />
           ) : (
             <div className="w-full h-full bg-sage-50 rounded-2xl flex flex-col items-center justify-center text-sage-300">
               <div className="animate-pulse-slow">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
               </div>
               <p className="mt-4 font-light text-sm">正在为你的行动绘制灵感...</p>
             </div>
           )}
           <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white/90 via-white/70 to-transparent pointer-events-none">
             <p className="text-sm text-stone-500 font-medium text-center">
               原始目标: "{task.originalInput}"
             </p>
           </div>
        </div>
      </div>

    </div>
  );
};

export default TaskActiveView;