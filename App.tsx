
import React, { useState, useEffect, useRef } from 'react';
import { SportProject, AnalysisResult, HistoryItem } from './types';
import { analyzeSportsVideoStreaming } from './services/geminiService';
import { saveHistoryItem, getHistory, clearHistory, deleteHistoryItem, PersistedHistoryItem } from './services/dbService';
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

  // Load history from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const persistedItems = await getHistory();
        // Convert Blobs to temporary URLs for the UI
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

    // Cleanup URLs on unmount
    return () => {
      history.forEach(item => URL.revokeObjectURL(item.videoUrl));
    };
  }, []);

  // Auto scroll to bottom of stream
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

      // Extract JSON from fullText
      const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/) || fullText.match(/{[\s\S]*}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[1] || jsonMatch[0]) as AnalysisResult;
          setReport(result);
          
          const id = Date.now().toString();
          
          // Save to IndexedDB (with actual Blob)
          const persistedItem: PersistedHistoryItem = {
            id,
            project: selectedProject,
            timestamp: Date.now(),
            videoBlob: videoFile,
            analysis: result
          };
          await saveHistoryItem(persistedItem);

          // Update State (with URL)
          const newItem: HistoryItem = {
            ...persistedItem,
            videoUrl: previewUrl || ''
          };
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
    setStreamingText("从历史记录加载...");
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
    <div className="min-h-screen flex flex-col pb-12">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <section className="text-center lg:text-left mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              AI 运动 <span className="text-blue-600">实时分析</span>
            </h1>
            <p className="text-lg text-slate-600">
              数据已加密存储于本地 IndexedDB，支持刷新后继续查看视频与报告。
            </p>
          </section>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3 text-sm">1</span>
                项目与视频
              </h2>
              <ProjectSelector selected={selectedProject} onSelect={setSelectedProject} />
              <VideoUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} />
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleStartAnalysis}
                disabled={!videoFile || isAnalyzing}
                className={`w-full max-w-md py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                  !videoFile || isAnalyzing
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200'
                }`}
              >
                {isAnalyzing ? '教练正在观察中...' : '开始智能分析'}
              </button>
            </div>
          </div>

          {(streamingText || isAnalyzing) && (
            <div className="mt-8 bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl overflow-hidden border border-slate-700">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Coach's Live Notes</span>
                </div>
                {isAnalyzing && <span className="text-xs text-blue-400 animate-pulse">Analyzing Frames...</span>}
              </div>
              <div 
                ref={scrollRef}
                className="font-mono text-sm leading-relaxed h-48 overflow-y-auto whitespace-pre-wrap custom-scrollbar"
              >
                {streamingText || "准备接收分析数据..."}
                {isAnalyzing && <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-bounce"></span>}
              </div>
            </div>
          )}

          {report && <AnalysisReport report={report} />}
        </div>

        <div className="lg:w-80 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              分析历史 (本地保存)
            </h3>
            
            {history.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">暂无分析记录</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-700">{item.project}</span>
                      <span className="text-xs font-bold text-blue-600">{item.analysis.score}分</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {history.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="w-full mt-6 py-2 text-xs text-slate-400 hover:text-red-500 transition-colors border-t border-slate-50 pt-4 text-center"
              >
                清空本地数据库
              </button>
            )}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default App;
