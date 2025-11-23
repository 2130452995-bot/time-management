import React from 'react';
import { TaskData } from '../types';

interface HistoryViewProps {
  tasks: TaskData[];
  onSelectTask: (task: TaskData) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ tasks, onSelectTask, onBack }) => {
  // Sort by date descending
  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-4xl mx-auto w-full h-full flex flex-col p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-stone-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-stone-700">行动足迹</h2>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-stone-400">
            <p>还没有记录，去迈出第一步吧。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-sage-200 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-stone-800 group-hover:text-sage-700 line-clamp-1">{task.title}</h3>
                  {task.isCompleted && (
                    <span className="bg-sage-100 text-sage-600 text-xs px-2 py-1 rounded-full">已完成</span>
                  )}
                </div>
                <p className="text-sm text-stone-500 mb-4 line-clamp-2 font-light">
                    {task.overallEncouragement}
                </p>
                <div className="flex justify-between items-end">
                   <div className="text-xs text-stone-400">
                    {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                   </div>
                   {task.isCompleted ? (
                       <div className="text-sage-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                           </svg>
                       </div>
                   ) : (
                       <div className="text-clay-500 text-xs font-medium px-2 py-1 bg-clay-50 rounded-lg">继续</div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;