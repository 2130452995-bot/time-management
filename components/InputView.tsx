import React, { useState } from 'react';

interface InputViewProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
  onViewHistory: () => void;
}

const InputView: React.FC<InputViewProps> = ({ onSubmit, isLoading, onViewHistory }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await onSubmit(input);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-6 flex flex-col justify-center h-full animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-sage-700 mb-4 tracking-tight">
          微步
        </h1>
        <p className="text-stone-500 text-lg md:text-xl font-light">
          千里之行，始于足下。<br/>告诉我你想做什么，我们把它变简单。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-sage-300 to-clay-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-2 flex flex-col md:flex-row items-center">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="例如：我一直在刷视频，想去洗澡睡觉..."
                className="flex-1 w-full p-4 text-lg md:text-xl text-stone-700 placeholder-stone-300 bg-transparent outline-none rounded-xl"
                disabled={isLoading}
                autoFocus
                />
                <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`
                    w-full md:w-auto mt-2 md:mt-0 px-8 py-3 rounded-xl font-medium text-white shadow-md transition-all duration-300
                    ${isLoading || !input.trim() 
                    ? 'bg-stone-300 cursor-not-allowed' 
                    : 'bg-sage-500 hover:bg-sage-600 hover:shadow-lg active:transform active:scale-95'}
                `}
                >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    拆解中...
                    </span>
                ) : '开始行动'}
                </button>
            </div>
        </div>
      </form>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onViewHistory}
          className="text-stone-400 hover:text-sage-600 transition-colors text-sm flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          查看历史记录
        </button>
      </div>
    </div>
  );
};

export default InputView;