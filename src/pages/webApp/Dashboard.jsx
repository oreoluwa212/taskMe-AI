// src/pages/webApp/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { HiOutlineViewGrid, HiOutlineFolder } from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import useProjectSearch from "../../hooks/useProjectSearch";
import { formatDate } from "../../utils/dateUtils";
import HomeCard from "../../components/webApp/cards/HomeCard";
import ProjectDetailCard from "../../components/webApp/cards/ProjectDetailCard";
import PageHeader from "../../components/webApp/PageHeader";
import SearchAndFilters from "../../components/webApp/SearchAndFilters";
import ProjectGrid from "../../components/webApp/ProjectGrid";
import ProjectModal from "../../components/webApp/modals/ProjectModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Toast from "../../components/ui/Toast";

// New reusable components
import CurrentProjectCard from "../../components/webApp/cards/CurrentProjectCard";
import TodaysTaskCard from "../../components/webApp/cards/TodaysTaskCard";
import UpcomingDeadlineCard from "../../components/webApp/cards/UpcomingDeadlineCard";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const cardContainerRef = useRef(null);

  // Store hooks
  const {
    user,
    loading: userLoading,
    error: userError,
    getProfile,
  } = useAuthStore();

  const {
    projects,
    loading: projectLoading,
    error: projectError,
    fetchProjects,
    getProjectStats,
    fetchProjectStats,
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

  // Dashboard stats state - keep original API structure
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    averageProgress: 0,
    highPriorityCount: 0,
    overdueCount: 0,
  });

  // Current project and tasks state with dummy data
  const [currentProject, setCurrentProject] = useState({
    id: 1,
    name: "Website Redesign",
    progress: 75,
    deadline: "2024-06-15",
  });

  const [todaysTask, setTodaysTask] = useState({
    id: 1,
    name: "Design Homepage",
    project: "Website Redesign",
    priority: "High",
    status: "In Progress",
    dueTime: "3:00 PM",
  });

  const [upcomingDeadline, setUpcomingDeadline] = useState({
    project: "Brand Design",
    taskName: "Finalize Logo Design",
    dueDate: "2024-06-17",
    dueTime: "5:00 PM",
    priority: "Medium",
    taskId: 2,
  });

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Keep overview as default - remove auto-switching logic

  // Update dashboard data when projects change
  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      updateDashboardData();
    }
  }, [projects]);

  const initializeData = async () => {
    resetStore();

    if (!user) {
      getProfile();
    }

    await fetchProjects();
    await loadDashboardStats();
  };

  const loadDashboardStats = async () => {
    try {
      // Try to fetch from API first - keep original structure
      const stats = await fetchProjectStats();
      setDashboardStats(stats);
    } catch (error) {
      // Fallback to calculated stats from store
      const projectStats = getProjectStats();
      setDashboardStats({
        total: projectStats.total || 0,
        pending: projectStats.pending || 0,
        inProgress: projectStats.inProgress || 0,
        completed: projectStats.completed || 0,
        averageProgress: 0,
        highPriorityCount: 0,
        overdueCount: 0,
      });
    }
  };

  const updateDashboardData = () => {
    const projectsArray = Array.isArray(projects) ? projects : [];

    // Find current project (most recent or in progress)
    const currentProj =
      projectsArray.find(
        (p) =>
          p.status === "In Progress" || (p.progress > 0 && p.progress < 100)
      ) || projectsArray[0];

    if (currentProj) {
      setCurrentProject({
        id: currentProj._id || currentProj.id,
        name: currentProj.name,
        progress: currentProj.progress || 0,
        deadline: currentProj.dueDate,
      });

      // Update today's task based on current project
      setTodaysTask({
        id: 1,
        name: "Design Homepage",
        project: currentProj.name,
        priority: "High",
        status: "In Progress",
        dueTime: "3:00 PM",
      });
    }

    // Find upcoming deadline
    const upcomingProj = projectsArray
      .filter((p) => p.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

    if (upcomingProj) {
      setUpcomingDeadline({
        project: upcomingProj.name,
        taskName: "Finalize Logo Design",
        dueDate: upcomingProj.dueDate,
        dueTime: "5:00 PM",
        priority: "Medium",
        taskId: 2,
      });
    }
  };

  const handleRetryProfile = () => {
    getProfile();
  };

  const handleRetryProjects = async () => {
    await fetchProjects();
    await loadDashboardStats();
  };

  const handleProjectCreated = async (newProject) => {
    setToast({
      type: "success",
      message: `Project "${newProject.name}" created successfully!`,
    });

    setIsModalOpen(false);
    await fetchProjects();
    await loadDashboardStats();
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

  // Use original stats structure - no transformation needed
  const safeStats = React.useMemo(() => {
    return (
      dashboardStats || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        averageProgress: 0,
        highPriorityCount: 0,
        overdueCount: 0,
      }
    );
  }, [dashboardStats]);

  // Ensure projects is always an array
  const projectsArray = Array.isArray(projects) ? projects : [];
  const displayProjects = Array.isArray(filteredProjects)
    ? filteredProjects
    : projectsArray;

  if (userLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <ErrorMessages
        userError={userError}
        projectError={projectError}
        onRetryProfile={handleRetryProfile}
        onRetryProjects={handleRetryProjects}
      />

      <PageHeader
        title={`Welcome back, ${
          user?.data?.firstname || user?.firstname || "David"
        }!`}
        subtitle="Here's what's on your plate today."
        onCreateProject={handleCreateProject}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <DashboardStatsCards stats={safeStats} />

      {activeTab === "overview" && (
        <OverviewContent
          currentProject={currentProject}
          todaysTask={todaysTask}
          upcomingDeadline={upcomingDeadline}
        />
      )}

      {activeTab === "projects" && (
        <ProjectsSection
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
          hasActiveFilters={hasActiveFilters}
          projects={displayProjects}
          projectLoading={projectLoading}
          formatDate={formatDate}
          cardContainerRef={cardContainerRef}
          onCreateProject={handleCreateProject}
        />
      )}

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
    </>
  );
};

// Component: Dashboard Loader
const DashboardLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size={40} />
      <p className="text-gray-600">Loading your dashboard...</p>
    </div>
  </div>
);

// Component: Error Messages
const ErrorMessages = ({
  userError,
  projectError,
  onRetryProfile,
  onRetryProjects,
}) => (
  <>
    {userError && (
      <ErrorMessage
        message={userError}
        onRetry={onRetryProfile}
        className="mb-6"
      />
    )}
    {projectError && (
      <ErrorMessage
        message={projectError}
        onRetry={onRetryProjects}
        className="mb-6"
      />
    )}
  </>
);

// Component: Tab Navigation
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="mb-6">
    <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
      <TabButton
        active={activeTab === "overview"}
        onClick={() => setActiveTab("overview")}
        icon={<HiOutlineViewGrid size={16} />}
        label="Overview"
      />
      <TabButton
        active={activeTab === "projects"}
        onClick={() => setActiveTab("projects")}
        icon={<HiOutlineFolder size={16} />}
        label="Projects"
      />
    </nav>
  </div>
);

// Component: Tab Button
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? "bg-white text-blue-600 shadow-sm"
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {icon}
    {label}
  </button>
);

// Component: Dashboard Stats Cards - Updated to use original API structure with proper icons
const DashboardStatsCards = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
    <HomeCard
      title="Total Projects"
      value={stats.total}
      className="text-gray-800"
      icon="📊"
    />
    <HomeCard
      title="Pending Projects"
      value={stats.pending}
      className="text-yellow-600"
      icon="⏳"
    />
    <HomeCard
      title="In Progress"
      value={stats.inProgress}
      className="text-blue-600"
      icon="🔄"
    />
    <HomeCard
      title="Completed"
      value={stats.completed}
      className="text-green-600"
      icon="✅"
    />
  </div>
);

// Component: Overview Content (New)
const OverviewContent = ({ currentProject, todaysTask, upcomingDeadline }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Current Project - Takes 2 columns on large screens */}
    <div className="lg:col-span-2">
      <CurrentProjectCard project={currentProject} />
    </div>

    {/* Upcoming Deadline - Takes 1 column */}
    <div className="lg:col-span-1">
      <UpcomingDeadlineCard deadline={upcomingDeadline} />
    </div>

    {/* Today's Task - Full width */}
    <div className="lg:col-span-3">
      <TodaysTaskCard task={todaysTask} />
    </div>
  </div>
);

// Component: Projects Section (Existing)
const ProjectsSection = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  clearSearch,
  isSearching,
  hasActiveFilters,
  projects,
  projectLoading,
  formatDate,
  cardContainerRef,
  onCreateProject,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
      resultsCount={projects.length}
      showViewToggle={true}
    />

    <div className="p-6">
      <ProjectGrid
        projects={projects}
        viewMode={viewMode}
        formatDate={formatDate}
        isLoading={projectLoading}
        isSearching={isSearching}
        searchQuery={searchQuery}
        hasActiveFilters={hasActiveFilters}
        onCreateProject={onCreateProject}
      />
    </div>
  </div>
);

export default Dashboard;
