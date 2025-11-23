import React from 'react';
import { Step } from '../types';

interface StepItemProps {
  step: Step;
  onToggle: (id: string) => void;
  disabled?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ step, onToggle, disabled }) => {
  return (
    <div 
      className={`
        group relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer mb-3 overflow-hidden
        ${step.isCompleted 
          ? 'bg-sage-100 border-sage-200 opacity-60' 
          : 'bg-white border-stone-100 hover:border-sage-300 hover:shadow-md'}
      `}
      onClick={() => !disabled && onToggle(step.id)}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <div className={`
          mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
          ${step.isCompleted 
            ? 'bg-sage-500 border-sage-500 text-white' 
            : 'border-stone-300 group-hover:border-sage-400'}
        `}>
          {step.isCompleted && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <h3 className={`font-medium text-lg leading-tight transition-colors ${step.isCompleted ? 'text-stone-500 line-through decoration-sage-500' : 'text-stone-800'}`}>
            {step.text}
          </h3>
          {!step.isCompleted && (
            <p className="text-sm text-stone-400 mt-1 font-light italic">
              {step.encouragement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepItem;