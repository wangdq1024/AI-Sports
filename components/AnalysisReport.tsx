
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps { report: AnalysisResult; }

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  return (
    <div className="mt-12 w-full max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[40px] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12 gap-10 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-black italic sport-font uppercase tracking-tighter text-slate-900 mb-6 flex flex-col md:flex-row md:items-center">
              <span className="bg-slate-900 text-white px-4 py-1 rounded-lg mr-4 transform -skew-x-12 inline-block">运动表现</span> 
              <span>诊断报告</span>
            </h2>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-lg text-slate-600 font-medium italic leading-relaxed">"{report.overallEvaluation}"</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center bg-white p-6 rounded-[32px] shadow-2xl border border-slate-50 transform hover:rotate-3 transition-transform">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="stroke-current text-slate-100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-current text-blue-600" strokeWidth="3.5" strokeDasharray={`${report.score}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black italic sport-font text-slate-900 leading-none">{report.score}</span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">分</span>
              </div>
            </div>
            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">最终评分</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 relative z-10">
          <div className="space-y-6">
            <h3 className="flex items-center text-sm font-black uppercase tracking-[0.2em] text-green-600">
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>
              技术亮点
            </h3>
            <div className="grid gap-4">
              {report.pros.map((pro, i) => (
                <div key={i} className="flex items-start bg-green-50/50 p-5 rounded-2xl border border-green-100/50 transition-all hover:bg-green-50">
                  <p className="text-slate-700 font-semibold text-sm leading-relaxed">{pro}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center text-sm font-black uppercase tracking-[0.2em] text-orange-600">
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" clipRule="evenodd" /></svg>
              </span>
              待改进项
            </h3>
            <div className="grid gap-4">
              {report.cons.map((con, i) => (
                <div key={i} className="flex items-start bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50 transition-all hover:bg-orange-50">
                  <p className="text-slate-700 font-semibold text-sm leading-relaxed">{con}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-slate-100 relative z-10">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 mb-8 flex items-center justify-center">
             训练改进方案
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {report.suggestions.map((sug, i) => (
              <div key={i} className="bg-slate-900 p-6 rounded-3xl shadow-xl transform hover:-translate-y-2 transition-all duration-300 border-b-4 border-blue-600">
                <div className="text-blue-500 mb-4 font-black italic sport-font">训练动作 {i+1}</div>
                <p className="text-slate-300 font-bold text-sm leading-relaxed uppercase tracking-tight">{sug}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-8">
        <button onClick={() => window.print()} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
          导出 PDF 诊断报告
        </button>
        <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
          分享诊断结果
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;
