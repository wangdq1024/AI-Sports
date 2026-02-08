
import React, { useRef } from 'react';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("文件太大，请上传50MB以内的视频。");
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 ${
          previewUrl ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-4">
            <video 
              src={previewUrl} 
              className="w-full max-h-80 rounded-xl object-contain mx-auto shadow-sm bg-black"
              controls
            />
            <p className="text-sm text-blue-600 font-medium">点击此处更换视频</p>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">上传运动录像</h3>
            <p className="text-slate-500 mt-2">支持 MP4, MOV 等格式，建议视频时长 5-15 秒</p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-md">
              选择文件
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
