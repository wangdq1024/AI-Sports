
import React from 'react';
import { SportProject } from '../types';

interface ProjectSelectorProps {
  selected: SportProject;
  onSelect: (project: SportProject) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selected, onSelect }) => {
  const projects = Object.values(SportProject);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
      {projects.map((project) => (
        <button
          key={project}
          onClick={() => onSelect(project)}
          className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 border-2 ${
            selected === project
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
          }`}
        >
          {project}
        </button>
      ))}
    </div>
  );
};

export default ProjectSelector;
