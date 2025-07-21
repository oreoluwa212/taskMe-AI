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
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useProjectSearch from "../../hooks/useProjectSearch";
import { formatDate } from "../../utils/dateUtils";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [initialLoading, setInitialLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

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
    const initializeProjects = async () => {
      try {
        resetStore();
        await fetchProjects();
      } catch (error) {
        console.error("Failed to initialize projects:", error);
      } finally {
        setInitialLoading(false);
        setHasInitialized(true);
      }
    };

    initializeProjects();
  }, [fetchProjects, resetStore]);

  // Event handlers
  const handleRetryProjects = async () => {
    setInitialLoading(true);
    setHasInitialized(false);
    try {
      await fetchProjects();
    } finally {
      setInitialLoading(false);
      setHasInitialized(true);
    }
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

  // Determine loading state
  const isLoading =
    initialLoading ||
    !hasInitialized ||
    (projectLoading && projectsArray.length === 0);

  // Only show error if we're not loading and we have an error
  const shouldShowError = projectError && !isLoading;

  return (
    <div className="w-full">
      {/* Page Header - Remove duplicate padding since DashboardLayout handles it */}
      <div className="mb-6">
        <PageHeader
          title="My Projects"
          subtitle="Manage and track all your projects in one place"
          onCreateProject={handleCreateProject}
          showMobileMenu={false} // Don't show mobile menu here since DashboardLayout handles it
        />
      </div>

      {/* Error Message */}
      {shouldShowError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ErrorMessage message={projectError} onRetry={handleRetryProjects} />
        </div>
      )}

      {/* Search and Filters */}
      {!isLoading && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
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
      )}

      {/* Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ProjectGrid
            projects={displayProjects}
            viewMode={viewMode}
            formatDate={formatDate}
            isLoading={isLoading}
            isSearching={isSearching}
            searchQuery={searchQuery}
            hasActiveFilters={hasActiveFilters}
            onCreateProject={handleCreateProject}
            hasInitialized={hasInitialized}
          />
        )}
      </div>

      {/* Modals and Notifications */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProjectCreated}
          onError={handleProjectError}
        />
      )}

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
