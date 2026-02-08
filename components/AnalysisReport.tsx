
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  report: AnalysisResult;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ report }) => {
  return (
    <div className="mt-12 w-full max-w-4xl mx-auto space-y-8 pb-16">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">智能分析报告</h2>
            <p className="text-slate-500">{report.overallEvaluation}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path className="stroke-current text-slate-100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="stroke-current text-blue-600" strokeWidth="3" strokeDasharray={`${report.score}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-2xl font-bold text-blue-700">{report.score}</span>
            </div>
            <span className="mt-2 text-sm font-semibold text-slate-500">规范得分</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-bold text-green-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              动作亮点
            </h3>
            <ul className="space-y-2">
              {report.pros.map((pro, i) => (
                <li key={i} className="flex items-start text-slate-700 bg-green-50 p-3 rounded-xl">
                  <span className="mr-2 text-green-500 mt-1">•</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center text-lg font-bold text-amber-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              改进建议
            </h3>
            <ul className="space-y-2">
              {report.cons.map((con, i) => (
                <li key={i} className="flex items-start text-slate-700 bg-amber-50 p-3 rounded-xl">
                  <span className="mr-2 text-amber-500 mt-1">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             针对性训练计划
          </h3>
          <div className="grid gap-3">
            {report.suggestions.map((sug, i) => (
              <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                <p className="text-blue-900 font-medium">{sug}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button 
          onClick={() => window.print()}
          className="text-slate-400 hover:text-blue-600 text-sm font-medium transition-colors"
        >
          保存/打印报告
        </button>
      </div>
    </div>
  );
};

export default AnalysisReport;
