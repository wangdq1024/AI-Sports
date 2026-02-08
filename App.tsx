
import React, { useState, useCallback } from 'react';
import { SportProject, AnalysisResult } from './types';
import { analyzeSportsVideo } from './services/geminiService';
import Header from './components/Header';
import ProjectSelector from './components/ProjectSelector';
import VideoUploader from './components/VideoUploader';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SportProject>(SportProject.LONG_JUMP);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisResult | null>(null);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setReport(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleStartAnalysis = async () => {
    if (!videoFile) return;

    setIsAnalyzing(true);
    setReport(null);

    try {
      const base64 = await fileToBase64(videoFile);
      const result = await analyzeSportsVideo(base64, selectedProject, videoFile.type);
      setReport(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('分析过程中遇到错误，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            让AI助你突破 <span className="text-blue-600">中考体育</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            上传你的练习视频，秒级获取专业教练级别的动作评估与提分建议。
          </p>
        </section>

        <div className="max-w-4xl mx-auto bg-white/50 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">1</span>
              选择考试项目
            </h2>
            <ProjectSelector selected={selectedProject} onSelect={setSelectedProject} />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">2</span>
              上传运动视频
            </h2>
            <VideoUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />
          </div>

          <div className="flex justify-center pt-6">
            <button
              onClick={handleStartAnalysis}
              disabled={!videoFile || isAnalyzing}
              className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                !videoFile || isAnalyzing
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI 正在深度分析中...
                </span>
              ) : '开始智能分析'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-12 text-center space-y-4 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 font-medium">正在识别骨骼关键点、计算动作角度...</p>
          </div>
        )}

        {report && <AnalysisReport report={report} />}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2024 Sports AI Lab. 专业中考体育助教.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
