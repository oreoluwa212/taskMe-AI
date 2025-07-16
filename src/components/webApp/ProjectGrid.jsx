// components/webApp/ProjectGrid.jsx
import React from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineFolder } from "react-icons/hi";
import ProjectDetailCard from "./cards/ProjectDetailCard";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProjectGrid = ({
  projects,
  viewMode,
  formatDate,
  isLoading,
  isSearching,
  searchQuery,
  hasActiveFilters,
  onCreateProject,
}) => {
  if (isLoading) {
    return <ProjectGridLoader />;
  }

  if (projects.length === 0 && !isSearching) {
    return (
      <EmptyState
        searchQuery={searchQuery}
        hasActiveFilters={hasActiveFilters}
        onCreateProject={onCreateProject}
      />
    );
  }

  return (
    <div className="w-full">
      {viewMode === "grid" ? (
        <GridView projects={projects} formatDate={formatDate} />
      ) : (
        <ListView projects={projects} formatDate={formatDate} />
      )}
    </div>
  );
};

const ProjectGridLoader = () => (
  <div className="flex justify-center py-12">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size={40} />
      <p className="text-gray-600">Loading projects...</p>
    </div>
  </div>
);

const GridView = ({ projects, formatDate }) => (
  <>
    {/* Desktop Grid View */}
    <div className="hidden md:block w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-full">
        {projects.map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={project}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>

    {/* Mobile/Tablet Grid */}
    <div className="md:hidden w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {projects.map((project) => (
          <ProjectCard
            key={project._id || project.id}
            project={project}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  </>
);

const ListView = ({ projects, formatDate }) => (
  <div className="space-y-3 w-full">
    {projects.map((project) => (
      <ProjectListItem
        key={project._id || project.id}
        project={project}
        formatDate={formatDate}
      />
    ))}
  </div>
);

const ProjectCard = ({ project, formatDate }) => (
  <div className="w-full">
    <ProjectDetailCard
      projectId={project._id || project.id}
      projectName={project.name}
      dueDate={formatDate(project.dueDate)}
      dueDays={project.timeline}
      startDate={formatDate(project.startDate)}
      progress={project.progress || 0}
    />
  </div>
);

const ProjectListItem = ({ project, formatDate }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow w-full">
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
      <p className="text-sm text-gray-500">
        Due: {formatDate(project.dueDate)}
      </p>
    </div>
    <div className="flex items-center gap-4 flex-shrink-0">
      <ProjectProgress progress={project.progress || 0} />
    </div>
  </div>
);

const ProjectProgress = ({ progress }) => (
  <div className="text-right">
    <div className="text-sm font-medium text-gray-900">{progress}%</div>
    <div className="w-20 bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const EmptyState = ({ searchQuery, hasActiveFilters, onCreateProject }) => {
  const isFiltered = searchQuery || hasActiveFilters;

  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <HiOutlineFolder className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isFiltered ? "No projects match your search" : "No projects yet"}
      </h3>
      <p className="text-gray-500 mb-6">
        {isFiltered
          ? "Try adjusting your search criteria or filters."
          : "Get started by creating your first project."}
      </p>
      {!isFiltered && (
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={14} />
          Create Project
        </button>
      )}
    </div>
  );
};

export default ProjectGrid;
