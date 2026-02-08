
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
            Sports AI
          </span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">动作标准库</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">训练营</a>
          <a href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">提分中心</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block text-slate-600 font-medium px-4 py-2">登录</button>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-slate-800 transition-colors">
            立即提分
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
