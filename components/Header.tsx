
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/50 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 transform -skew-x-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black italic tracking-tighter sport-font text-slate-900 leading-none">
              体育 <span className="text-blue-600">AI</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">中考体育专业分析平台</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-10">
          <a href="#" className="text-sm font-bold tracking-widest text-slate-600 hover:text-blue-600 transition-colors">动作标准库</a>
          <a href="#" className="text-sm font-bold tracking-widest text-slate-600 hover:text-blue-600 transition-colors">训练营</a>
          <a href="#" className="text-sm font-bold tracking-widest text-slate-600 hover:text-blue-600 transition-colors">提分社区</a>
        </nav>

        <div className="flex items-center space-x-6">
          <button className="hidden sm:block text-slate-500 font-bold text-sm tracking-wider hover:text-slate-900">登录</button>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
            立即提分
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
