
import React from 'react';
import { SportProject } from '../types';

interface ProjectSelectorProps {
  selected: SportProject;
  onSelect: (project: SportProject) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selected, onSelect }) => {
  const projects = Object.values(SportProject);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {projects.map((project) => (
        <button
          key={project}
          onClick={() => onSelect(project)}
          className={`relative px-4 py-4 rounded-2xl font-black uppercase tracking-tight transition-all duration-300 border-2 overflow-hidden group ${
            selected === project
              ? 'bg-blue-600 border-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-105 z-10'
              : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500'
          }`}
        >
          {selected === project && (
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          )}
          <span className="relative z-10 flex flex-col items-center">
             <span className="text-sm">{project}</span>
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProjectSelector;
