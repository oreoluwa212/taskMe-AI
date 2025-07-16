// src/pages/webApp/Projects.jsx
import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import PageHeader from "../../components/webApp/PageHeader";
import SearchAndFilters from "../../components/webApp/SearchAndFilters";
import ProjectGrid from "../../components/webApp/ProjectGrid";
import ProjectModal from "../../components/webApp/modals/ProjectModal";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Toast from "../../components/ui/Toast";
import useProjectSearch from "../../hooks/useProjectSearch";
import { formatDate } from "../../utils/dateUtils";

const Projects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // Store hooks
  const { user } = useAuthStore();
  const {
    projects,
    loading: projectLoading,
    error: projectError,
    fetchProjects,
    resetStore,
  } = useProjectStore();

  // Search hook
  const {
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredProjects,
    isSearching,
    clearSearch,
    hasActiveFilters,
  } = useProjectSearch(projects);

  // Initialize data
  useEffect(() => {
    resetStore();
    fetchProjects();
  }, [fetchProjects, resetStore]);

  // Event handlers
  const handleRetryProjects = () => {
    fetchProjects();
  };

  const handleProjectCreated = async (newProject) => {
    setToast({
      type: "success",
      message: `Project "${newProject.name}" created successfully!`,
    });
    setIsModalOpen(false);
    await fetchProjects();
  };

  const handleProjectError = (error) => {
    setToast({
      type: "error",
      message: error.message || "Failed to create project",
    });
  };

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  // Ensure arrays are properly formatted
  const projectsArray = Array.isArray(projects) ? projects : [];
  const displayProjects = Array.isArray(filteredProjects)
    ? filteredProjects
    : projectsArray;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 lg:w-4/5 h-screen overflow-hidden flex flex-col bg-dashboardBg font-lato">
        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-none">
            {/* Header Section - Fixed spacing */}
            <div className="px-4 sm:px-6 lg:px-[5%] pt-4 sm:pt-6 pb-4">
              <PageHeader
                title="My Projects"
                subtitle="Manage and track all your projects in one place"
                onCreateProject={handleCreateProject}
                isMobileMenuOpen={isOpen}
                setMobileMenuOpen={setIsOpen}
                showMobileMenu={true}
              />
            </div>

            {/* Error Message */}
            {projectError && (
              <div className="px-4 sm:px-6 lg:px-[5%] pb-4">
                <ErrorMessage
                  message={projectError}
                  onRetry={handleRetryProjects}
                />
              </div>
            )}

            {/* Search and Filters Section */}
            <div className="px-4 sm:px-6 lg:px-[5%] pb-4">
              <SearchAndFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                filters={filters}
                setFilters={setFilters}
                viewMode={viewMode}
                setViewMode={setViewMode}
                clearSearch={clearSearch}
                isSearching={isSearching}
                resultsCount={displayProjects.length}
                showViewToggle={true}
              />
            </div>

            {/* Projects Content Section */}
            <div className="px-4 sm:px-6 lg:px-[5%] pb-6">
              <ProjectGrid
                projects={displayProjects}
                viewMode={viewMode}
                formatDate={formatDate}
                isLoading={projectLoading}
                isSearching={isSearching}
                searchQuery={searchQuery}
                hasActiveFilters={hasActiveFilters}
                onCreateProject={handleCreateProject}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Notifications - Fixed positioning */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
        onError={handleProjectError}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Projects;
