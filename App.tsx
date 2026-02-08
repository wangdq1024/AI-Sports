
import React, { useState, useEffect, useRef } from 'react';
import { SportProject, AnalysisResult, HistoryItem } from './types';
import { analyzeSportsVideoStreaming } from './services/geminiService';
import { saveHistoryItem, getHistory, clearHistory, PersistedHistoryItem } from './services/dbService';
import Header from './components/Header';
import ProjectSelector from './components/ProjectSelector';
import VideoUploader from './components/VideoUploader';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SportProject>(SportProject.LONG_JUMP);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const persistedItems = await getHistory();
        const historyWithUrls: HistoryItem[] = persistedItems.map(item => ({
          ...item,
          videoUrl: URL.createObjectURL(item.videoBlob)
        }));
        setHistory(historyWithUrls);
      } catch (e) {
        console.error("Failed to load history from IndexedDB", e);
      }
    };
    loadData();
    return () => {
      history.forEach(item => URL.revokeObjectURL(item.videoUrl));
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [streamingText]);

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setReport(null);
    setStreamingText("");
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
    setStreamingText("");

    try {
      const base64 = await fileToBase64(videoFile);
      const stream = analyzeSportsVideoStreaming(base64, selectedProject, videoFile.type);
      
      let fullText = "";
      for await (const chunk of stream) {
        fullText += chunk;
        setStreamingText(fullText);
      }

      const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/) || fullText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[1] || jsonMatch[0]) as AnalysisResult;
          setReport(result);
          const id = Date.now().toString();
          const persistedItem: PersistedHistoryItem = {
            id,
            project: selectedProject,
            timestamp: Date.now(),
            videoBlob: videoFile,
            analysis: result
          };
          await saveHistoryItem(persistedItem);
          const newItem: HistoryItem = { ...persistedItem, videoUrl: previewUrl || '' };
          setHistory(prev => [newItem, ...prev].slice(0, 20));
        } catch (e) {
          console.error("JSON parse failed", e);
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('分析过程中遇到错误，请稍后重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setSelectedProject(item.project);
    setPreviewUrl(item.videoUrl);
    setReport(item.analysis);
    setStreamingText("从历史记录加载分析报告...");
    setVideoFile(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = async () => {
    if(confirm('确定清空所有历史记录吗？')) {
      try {
        await clearHistory();
        history.forEach(item => URL.revokeObjectURL(item.videoUrl));
        setHistory([]);
      } catch (e) {
        console.error("Failed to clear history", e);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 overflow-x-hidden">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl flex flex-col gap-12">
        {/* Main Analysis Section */}
        <div className="w-full space-y-10">
          <section className="text-center lg:text-left relative">
            <div className="absolute -left-10 top-0 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full"></div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-none sport-font italic tracking-tighter uppercase">
              AI <span className="text-blue-600 drop-shadow-sm">智能教练系统</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl">
              每一毫秒的动作捕捉，每一次发力的深度剖析。数据化你的运动潜能。
            </p>
          </section>

          <div className="bg-white/60 glass-effect rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
             
            <div className="mb-12 relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black italic -skew-x-6">01</span>
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-800">选择运动项目</h2>
              </div>
              <ProjectSelector selected={selectedProject} onSelect={setSelectedProject} />
              
              <div className="flex items-center space-x-3 mb-6">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black italic -skew-x-6">02</span>
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-800">上传运动录像</h2>
              </div>
              <VideoUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />
            </div>

            <div className="flex justify-center pt-4 relative z-10">
              <button
                onClick={handleStartAnalysis}
                disabled={!videoFile || isAnalyzing}
                className={`w-full max-w-lg py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl ${
                  !videoFile || isAnalyzing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:scale-[1.02] active:scale-100 hover:shadow-blue-500/40'
                }`}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在深度分析中...
                  </span>
                ) : '开启 AI 动作诊断'}
              </button>
            </div>
          </div>

          {(streamingText || isAnalyzing) && (
            <div className="mt-8 mesh-gradient text-slate-100 rounded-[32px] p-8 shadow-2xl relative overflow-hidden border border-slate-700 glow-blue">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex items-center justify-between mb-6 border-b border-slate-700/50 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">教练实时点评</span>
                </div>
                {isAnalyzing && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">正在分析生物力学数据...</span>}
              </div>
              <div 
                ref={scrollRef}
                className="font-mono text-base leading-relaxed h-56 overflow-y-auto whitespace-pre-wrap custom-scrollbar pr-4 text-slate-300"
              >
                {streamingText || "启动逐帧诊断程序..."}
                {isAnalyzing && <span className="inline-block w-2 h-5 bg-blue-500 ml-2 animate-pulse align-middle"></span>}
              </div>
            </div>
          )}

          {report && <AnalysisReport report={report} />}
        </div>

        {/* History Bottom Section */}
        <div className="w-full mt-10">
          <div className="bg-white/80 glass-effect rounded-[40px] p-8 md:p-12 shadow-xl border border-white">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black italic shadow-lg -skew-x-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic sport-font tracking-tight text-slate-900">
                    分析历史
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">数据加密存储于本地浏览器 IndexedDB</p>
                </div>
              </div>
              {history.length > 0 && (
                <button 
                  onClick={handleClearHistory}
                  className="px-6 py-2 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl border border-slate-100"
                >
                  清空数据库
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-20 px-4 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm">
                  <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">暂无历史记录。快去上传视频开始你的第一次智能分析吧！</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-5 rounded-[32px] bg-white border border-slate-100 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                        <video src={item.videoUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black uppercase text-slate-800 truncate">{item.project}</span>
                          <span className="text-xs font-black text-blue-600 italic sport-font ml-2">{item.analysis.score} 分</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 italic font-medium">
                      "{item.analysis.overallEvaluation}"
                    </div>
                    <div className="absolute bottom-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" />
                       </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default App;
