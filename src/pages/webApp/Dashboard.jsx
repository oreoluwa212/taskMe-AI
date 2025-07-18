// src/pages/webApp/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaClock,
  FaCalendarAlt,
  FaTag,
  FaChartBar,
} from "react-icons/fa";
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
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

// Enhanced Reusable components
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
    stats,
    statsLoading,
    statsError,
    fetchProjects,
    fetchProjectStats,
    getProjectStats,
    resetStore,
    clearError,
    clearStatsError,
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

  // Enhanced dashboard data state
  const [dashboardData, setDashboardData] = useState({
    currentProject: null,
    todaysTask: null,
    upcomingDeadlines: [],
    recentProjects: [],
    highPriorityProjects: [],
    overdueTasks: [],
    categoryBreakdown: {},
    workloadAnalysis: null,
    tagCloud: {},
    timelineInsights: null,
  });

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Update dashboard data when projects change
  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      updateDashboardData();
    }
  }, [projects]);

  const initializeData = async () => {
    try {
      resetStore();

      if (!user) {
        await getProfile();
      }

      // Fetch projects and stats in parallel
      await Promise.all([fetchProjects(), fetchProjectStats()]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      setToast({
        type: "error",
        message: "Failed to load dashboard data",
      });
    }
  };

  const updateDashboardData = () => {
    const projectsArray = Array.isArray(projects) ? projects : [];
    const now = new Date();

    // Enhanced current project logic
    const currentProj =
      projectsArray.find((p) => p.status === "In Progress") ||
      projectsArray.find((p) => p.progress > 0 && p.progress < 100) ||
      projectsArray.find(
        (p) => p.status === "Pending" && p.priority === "High"
      ) ||
      projectsArray[0];

    // Enhanced upcoming deadlines (next 7 days)
    const upcomingDeadlines = projectsArray
      .filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false;
        const dueDate = new Date(p.dueDate);
        const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 7;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3);

    // High priority projects
    const highPriorityProjects = projectsArray
      .filter((p) => p.priority === "High" && p.status !== "Completed")
      .slice(0, 3);

    // Overdue tasks
    const overdueTasks = projectsArray
      .filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false;
        return new Date(p.dueDate) < now;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    // Recent projects (last 30 days)
    const recentProjects = projectsArray
      .filter((p) => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        const daysDiff = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= 30;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Category breakdown
    const categoryBreakdown = projectsArray.reduce((acc, project) => {
      const category = project.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { count: 0, completed: 0, inProgress: 0, pending: 0 };
      }
      acc[category].count++;
      acc[category][project.status.toLowerCase().replace(" ", "")] =
        (acc[category][project.status.toLowerCase().replace(" ", "")] || 0) + 1;
      return acc;
    }, {});

    // Tag cloud
    const tagCloud = projectsArray.reduce((acc, project) => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    }, {});

    // Workload analysis
    const workloadAnalysis = {
      totalEstimatedHours: projectsArray.reduce(
        (sum, p) => sum + (p.subtaskStats?.totalEstimatedHours || 0),
        0
      ),
      averageTimeline:
        projectsArray.length > 0
          ? Math.round(
              projectsArray.reduce((sum, p) => sum + (p.timeline || 0), 0) /
                projectsArray.length
            )
          : 0,
      totalSubtasks: projectsArray.reduce(
        (sum, p) => sum + (p.subtaskStats?.totalSubtasks || 0),
        0
      ),
      completedSubtasks: projectsArray.reduce(
        (sum, p) => sum + (p.subtaskStats?.completedSubtasks || 0),
        0
      ),
      pendingSubtasks: projectsArray.reduce(
        (sum, p) => sum + (p.subtaskStats?.pendingSubtasks || 0),
        0
      ),
      inProgressSubtasks: projectsArray.reduce(
        (sum, p) => sum + (p.subtaskStats?.inProgressSubtasks || 0),
        0
      ),
    };

    // Timeline insights
    const timelineInsights = {
      shortTerm: projectsArray.filter((p) => (p.timeline || 0) <= 30).length,
      mediumTerm: projectsArray.filter(
        (p) => (p.timeline || 0) > 30 && (p.timeline || 0) <= 90
      ).length,
      longTerm: projectsArray.filter((p) => (p.timeline || 0) > 90).length,
      averageProgress:
        projectsArray.length > 0
          ? Math.round(
              projectsArray.reduce((sum, p) => sum + (p.progress || 0), 0) /
                projectsArray.length
            )
          : 0,
    };

    setDashboardData({
      currentProject: currentProj
        ? {
            id: currentProj._id || currentProj.id,
            name: currentProj.name,
            description: currentProj.description,
            progress: currentProj.progress || 0,
            deadline: currentProj.dueDate,
            dueTime: currentProj.dueTime,
            status: currentProj.status,
            priority: currentProj.priority,
            category: currentProj.category,
            tags: currentProj.tags,
            timeline: currentProj.timeline,
            subtaskStats: currentProj.subtaskStats,
          }
        : null,
      todaysTask: currentProj
        ? {
            id: 1,
            name: getTaskNameForProject(currentProj),
            project: currentProj.name,
            priority: currentProj.priority || "Medium",
            status: "In Progress",
            dueTime: currentProj.dueTime || "3:00 PM",
            projectId: currentProj._id || currentProj.id,
            estimatedHours: currentProj.subtaskStats?.totalEstimatedHours || 0,
            category: currentProj.category,
          }
        : null,
      upcomingDeadlines: upcomingDeadlines.map((p) => ({
        project: p.name,
        taskName: getTaskNameForProject(p),
        dueDate: p.dueDate,
        dueTime: p.dueTime || "5:00 PM",
        priority: p.priority || "Medium",
        taskId: p._id || p.id,
        projectId: p._id || p.id,
        category: p.category,
        progress: p.progress || 0,
      })),
      recentProjects,
      highPriorityProjects,
      overdueTasks,
      categoryBreakdown,
      workloadAnalysis,
      tagCloud,
      timelineInsights,
    });
  };

  // Helper function to generate task names based on project
  const getTaskNameForProject = (project) => {
    const taskNames = {
      "Web Development": "Setup Development Environment",
      "Mobile App": "Design User Interface",
      writing: "Draft Chapter Outline",
      publishing: "Research Publishing Options",
      marketing: "Create Marketing Strategy",
      design: "Create Design System",
      research: "Conduct Market Research",
      analysis: "Analyze Requirements",
    };

    const category = project.category?.toLowerCase() || "";
    const projectName = project.name.toLowerCase();

    // First try to match by category
    for (const [key, value] of Object.entries(taskNames)) {
      if (category.includes(key.toLowerCase())) {
        return value;
      }
    }

    // Then try to match by project name
    for (const [key, value] of Object.entries(taskNames)) {
      if (projectName.includes(key.toLowerCase())) {
        return value;
      }
    }

    // Default based on project status and progress
    if (project.progress === 0) {
      return `Initialize ${project.name}`;
    } else if (project.progress < 30) {
      return `Setup ${project.name} Foundation`;
    } else if (project.progress < 70) {
      return `Develop ${project.name} Core Features`;
    } else {
      return `Finalize ${project.name}`;
    }
  };

  const handleRetryProfile = async () => {
    try {
      await getProfile();
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to load profile",
      });
    }
  };

  const handleRetryProjects = async () => {
    try {
      await Promise.all([fetchProjects(), fetchProjectStats()]);
    } catch (error) {
      setToast({
        type: "error",
        message: "Failed to load projects",
      });
    }
  };

  const handleProjectCreated = async (newProject) => {
    setToast({
      type: "success",
      message: `Project "${newProject.name}" created successfully!`,
    });

    setIsModalOpen(false);

    // Refresh data after creating project
    await Promise.all([fetchProjects(), fetchProjectStats()]);
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

  const handleClearErrors = () => {
    clearError();
    clearStatsError();
  };

  // Get safe stats - fallback to calculated stats if API fails
  const safeStats = React.useMemo(() => {
    if (statsError) {
      return getProjectStats();
    }
    return stats;
  }, [stats, statsError, getProjectStats]);

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
        statsError={statsError}
        onRetryProfile={handleRetryProfile}
        onRetryProjects={handleRetryProjects}
        onClearErrors={handleClearErrors}
      />

      <PageHeader
        title={`Welcome back, ${
          user?.data?.firstname || user?.firstname || "User"
        }!`}
        subtitle="Here's what's on your plate today."
        onCreateProject={handleCreateProject}
      />

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <EnhancedDashboardStatsCards
        stats={safeStats}
        workloadAnalysis={dashboardData.workloadAnalysis}
        isLoading={statsLoading}
      />

      {activeTab === "overview" && (
        <EnhancedOverviewContent
          dashboardData={dashboardData}
          onCreateProject={handleCreateProject}
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
  statsError,
  onRetryProfile,
  onRetryProjects,
  onClearErrors,
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
    {statsError && (
      <ErrorMessage
        message={`Stats error: ${statsError}`}
        onRetry={onRetryProjects}
        onClose={onClearErrors}
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

// Enhanced Component: Dashboard Stats Cards
const EnhancedDashboardStatsCards = ({
  stats,
  workloadAnalysis,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center min-h-[120px] w-full animate-pulse"
          >
            <div className="w-8 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-12 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-8">
      <HomeCard
        title="Total Projects"
        value={stats.total}
        className="text-gray-800"
        icon="📊"
      />
      <HomeCard
        title="Pending"
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
};

// Enhanced Component: Overview Content
const EnhancedOverviewContent = ({ dashboardData, onCreateProject }) => {
  const {
    currentProject,
    todaysTask,
    upcomingDeadlines,
    recentProjects,
    highPriorityProjects,
    overdueTasks,
    categoryBreakdown,
    workloadAnalysis,
    tagCloud,
    timelineInsights,
  } = dashboardData;

  if (!currentProject && !todaysTask && upcomingDeadlines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <HiOutlineFolder className="mx-auto h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No active projects
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first project to see your overview.
        </p>
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus size={14} />
          Create Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Overview Cards */}
      <div className="flex flex-col gap-6">
        {/* Current Project - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <CurrentProjectCard project={currentProject} />
        </div>

        {/* Today's Task - Takes 1 column */}
        <div className="lg:col-span-1">
          <TodaysTaskCard task={todaysTask} />
        </div>
      </div>

      {/* Upcoming Deadlines and Priority Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-orange-500" />
            Upcoming Deadlines
          </h3>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {deadline.project}
                    </h4>
                    <p className="text-sm text-gray-600">{deadline.taskName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(deadline.dueDate)} at {deadline.dueTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        deadline.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : deadline.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {deadline.priority}
                    </span>
                    <div className="w-12 text-right">
                      <div className="text-xs font-medium text-gray-600">
                        {deadline.progress}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${deadline.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No upcoming deadlines
            </p>
          )}
        </div>

        {/* High Priority Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineExclamationCircle className="text-red-500" />
            High Priority Projects
          </h3>
          {highPriorityProjects.length > 0 ? (
            <div className="space-y-3">
              {highPriorityProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-600">{project.category}</p>
                    <p className="text-xs text-gray-500">
                      Due: {formatDate(project.dueDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        project.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : project.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {project.status}
                    </span>
                    <div className="w-12 text-right">
                      <div className="text-xs font-medium text-gray-600">
                        {project.progress || 0}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No high priority projects
            </p>
          )}
        </div>
      </div>

      {/* Analytics and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-500" />
            Category Breakdown
          </h3>
          {Object.keys(categoryBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, data]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{data.count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(data.completed / data.count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No category data</p>
          )}
        </div>

        {/* Workload Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-purple-500" />
            Workload Analysis
          </h3>
          {workloadAnalysis && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-medium">
                  {workloadAnalysis.totalSubtasks}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-medium text-green-600">
                  {workloadAnalysis.completedSubtasks}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-medium text-blue-600">
                  {workloadAnalysis.inProgressSubtasks}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">
                  {workloadAnalysis.pendingSubtasks}
                </span>
              </div>
              // Continue from the previous Dashboard.jsx file - Enhanced
              sections
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Est. Total Hours
                  </span>
                  <span className="font-medium text-indigo-600">
                    {workloadAnalysis.totalEstimatedHours}h
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tag Cloud & Timeline Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaTag className="text-green-500" />
            Popular Tags & Timeline
          </h3>
          {Object.keys(tagCloud).length > 0 && timelineInsights && (
            <div className="space-y-4">
              {/* Tag Cloud */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(tagCloud)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([tag, count]) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        style={{
                          fontSize: `${Math.max(
                            10,
                            Math.min(14, 10 + count * 2)
                          )}px`,
                        }}
                      >
                        {tag} ({count})
                      </span>
                    ))}
                </div>
              </div>

              {/* Timeline Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Timeline Distribution
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {timelineInsights.shortTerm}
                    </div>
                    <div className="text-xs text-gray-600">Short (≤30d)</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-lg font-bold text-yellow-600">
                      {timelineInsights.mediumTerm}
                    </div>
                    <div className="text-xs text-gray-600">Medium (31-90d)</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-lg font-bold text-red-600">
                      {timelineInsights.longTerm}
                    </div>
                    <div className="text-xs text-gray-600">Long (90d)</div>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-600">
                    Average Progress:{" "}
                    <span className="font-medium text-blue-600">
                      {timelineInsights.averageProgress}%
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overdue Projects Alert (if any) */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HiOutlineExclamationCircle
              className="text-red-500 mt-1 flex-shrink-0"
              size={20}
            />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">
                ⚠️ {overdueTasks.length} Overdue Project
                {overdueTasks.length > 1 ? "s" : ""}
              </h3>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map((project, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded border"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {project.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Due: {formatDate(project.dueDate)} at{" "}
                        {project.dueTime || "5:00 PM"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {project.category} • {project.priority} Priority
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {Math.ceil(
                          (new Date() - new Date(project.dueDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days overdue
                      </div>
                      <div className="text-xs text-gray-500">
                        {project.progress || 0}% complete
                      </div>
                    </div>
                  </div>
                ))}
                {overdueTasks.length > 3 && (
                  <p className="text-sm text-red-600 text-center">
                    and {overdueTasks.length - 3} more overdue project
                    {overdueTasks.length - 3 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Projects Activity */}
      {recentProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiOutlineCheckCircle className="text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">
                      {project.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : project.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {project.category}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Created: {formatDate(project.createdAt)}</span>
                    <span>Timeline: {project.timeline} days</span>
                    {project.subtaskStats && (
                      <span>Tasks: {project.subtaskStats.totalSubtasks}</span>
                    )}
                    {project.subtaskStats && (
                      <span>
                        Est: {project.subtaskStats.totalEstimatedHours}h
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {project.tags &&
                    project.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {project.progress || 0}%
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Component: Projects Section with better data utilization
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
  <div className="space-y-6">
    {/* Enhanced Search and Filters */}
    <SearchAndFilters
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      filters={filters}
      setFilters={setFilters}
      clearSearch={clearSearch}
      hasActiveFilters={hasActiveFilters}
      projects={projects}
    />

    {/* View Mode Toggle and Stats */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <HiOutlineViewGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <HiOutlineFolder size={20} />
          </button>
        </div>

        <div className="text-sm text-gray-600">
          {isSearching ? (
            <span>Searching...</span>
          ) : (
            <span>
              {projects.length} project{projects.length !== 1 ? "s" : ""}
              {hasActiveFilters && " (filtered)"}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onCreateProject}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlus size={14} />
        New Project
      </button>
    </div>

    {/* Enhanced Project Grid/List */}
    <div ref={cardContainerRef}>
      {projectLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <HiOutlineFolder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters
              ? "No projects match your filters"
              : "No projects yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters
              ? "Try adjusting your search criteria or filters."
              : "Get started by creating your first project."}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={onCreateProject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus size={14} />
              Create Your First Project
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          viewMode={viewMode}
          formatDate={formatDate}
        />
      )}
    </div>
  </div>
);

export default Dashboard;
