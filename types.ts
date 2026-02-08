
export enum SportProject {
  LONG_JUMP = '立定跳远',
  PULL_UPS = '引体向上',
  SOLID_BALL = '实心球',
  SIT_UPS = '仰卧起坐',
  RUNNING = '短跑/中长跑'
}

export interface AnalysisResult {
  score: number;
  pros: string[];
  cons: string[];
  suggestions: string[];
  overallEvaluation: string;
}

export interface HistoryItem {
  id: string;
  project: SportProject;
  timestamp: number;
  videoUrl: string;
  analysis: AnalysisResult;
}
