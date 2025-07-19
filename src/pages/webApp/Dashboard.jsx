// src/pages/webApp/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaClock } from "react-icons/fa";
import {
  HiOutlineFolder,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import useSubtaskStore from "../../store/subtaskStore";
import { formatDate } from "../../utils/dateUtils";
import HomeCard from "../../components/webApp/cards/HomeCard";
import PageHeader from "../../components/webApp/PageHeader";
import ProjectModal from "../../components/webApp/modals/ProjectModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Toast from "../../components/ui/Toast";
import CurrentProjectCard from "../../components/webApp/cards/CurrentProjectCard";
import { icon1, icon2, icon3, icon4 } from "../../../public";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

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

  const {
    getRecentSubtasks,
    getOverdueSubtasks,
    getWeeklyProductivity,
    recentSubtasks,
    overdueSubtasks,
    loading: subtaskLoading,
    error: subtaskError,
  } = useSubtaskStore();

  // Enhanced dashboard data state
  const [dashboardData, setDashboardData] = useState({
    currentProject: null,
    todaysTask: null,
    todaysTasks: [],
    upcomingDeadlines: [],
    recentProjects: [],
    overdueTasks: [],
    workloadAnalysis: null,
    subtaskStats: null,
  });

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  // Update dashboard data when projects or subtasks change
  useEffect(() => {
    if (Array.isArray(projects) && projects.length > 0) {
      updateDashboardData();
    }
  }, [projects, recentSubtasks, overdueSubtasks]);

  const initializeData = async () => {
    try {
      resetStore();

      if (!user) {
        await getProfile();
      }

      // Fetch all data in parallel with better error handling
      const dataPromises = [
        fetchProjects().catch((err) =>
          console.error("Projects fetch error:", err)
        ),
        fetchProjectStats().catch((err) =>
          console.error("Project stats error:", err)
        ),
        getRecentSubtasks({ limit: 20 }).catch((err) =>
          console.error("Recent subtasks error:", err)
        ),
        getOverdueSubtasks().catch((err) =>
          console.error("Overdue subtasks error:", err)
        ),
        getWeeklyProductivity().catch((err) =>
          console.error("Weekly productivity error:", err)
        ),
      ];

      await Promise.allSettled(dataPromises);
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
    const recentSubtasksArray = Array.isArray(recentSubtasks)
      ? recentSubtasks
      : [];
    const overdueSubtasksArray = Array.isArray(overdueSubtasks)
      ? overdueSubtasks
      : [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Enhanced current project logic
    const currentProj =
      projectsArray.find((p) => p.status === "In Progress") ||
      projectsArray.find((p) => p.progress > 0 && p.progress < 100) ||
      projectsArray.find(
        (p) => p.status === "Pending" && p.priority === "High"
      ) ||
      projectsArray[0];

    // Get today's tasks from recent subtasks (filtering by due date)
    const todaysTasks = recentSubtasksArray
      .filter((subtask) => {
        if (!subtask.dueDate) return false;
        const dueDate = new Date(subtask.dueDate);
        const taskDate = new Date(
          dueDate.getFullYear(),
          dueDate.getMonth(),
          dueDate.getDate()
        );
        return (
          taskDate.getTime() === today.getTime() &&
          subtask.status !== "Completed"
        );
      })
      .slice(0, 5);

    // Get primary today's task
    const todaysTask =
      todaysTasks.length > 0
        ? {
            id: todaysTasks[0]._id,
            name: todaysTasks[0].title,
            description: todaysTasks[0].description,
            project: todaysTasks[0].projectId?.name || "Unknown Project",
            priority: todaysTasks[0].priority || "Medium",
            status: todaysTasks[0].status,
            dueTime: todaysTasks[0].dueTime || "5:00 PM",
            projectId: todaysTasks[0].projectId?._id,
            estimatedHours: todaysTasks[0].estimatedHours || 0,
            category: todaysTasks[0].projectId?.category,
            tags: todaysTasks[0].tags || [],
          }
        : null;

    // Enhanced upcoming deadlines using recent subtasks
    const upcomingSubtasks = recentSubtasksArray
      .filter((subtask) => {
        if (!subtask.dueDate || subtask.status === "Completed") return false;
        const dueDate = new Date(subtask.dueDate);
        const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 && daysDiff <= 7;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    const upcomingDeadlines = upcomingSubtasks.map((subtask) => ({
      project: subtask.projectId?.name || "Unknown Project",
      taskName: subtask.title,
      taskDescription: subtask.description,
      dueDate: subtask.dueDate,
      dueTime: subtask.dueTime || "5:00 PM",
      priority: subtask.priority || "Medium",
      taskId: subtask._id,
      projectId: subtask.projectId?._id,
      category: subtask.projectId?.category,
      progress: calculateSubtaskProgress(subtask),
      estimatedHours: subtask.estimatedHours || 0,
    }));

    // Enhanced overdue tasks using subtasks
    const overdueTasksFromSubtasks = overdueSubtasksArray.map((subtask) => ({
      id: subtask._id,
      name: subtask.projectId?.name || "Unknown Project",
      taskName: subtask.title,
      taskDescription: subtask.description,
      dueDate: subtask.dueDate,
      dueTime: subtask.dueTime || "5:00 PM",
      priority: subtask.priority || "Medium",
      category: subtask.projectId?.category,
      progress: calculateSubtaskProgress(subtask),
      type: "subtask",
      projectId: subtask.projectId?._id,
    }));

    // Combine project-level and subtask-level overdue items
    const overdueProjects = projectsArray
      .filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false;
        return new Date(p.dueDate) < now;
      })
      .map((project) => ({
        id: project._id,
        name: project.name,
        dueDate: project.dueDate,
        dueTime: project.dueTime || "5:00 PM",
        priority: project.priority || "Medium",
        category: project.category,
        progress: project.progress || 0,
        type: "project",
      }));

    const overdueTasks = [...overdueProjects, ...overdueTasksFromSubtasks].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );

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

    // Enhanced workload analysis using available subtask data
    const workloadAnalysis = {
      totalEstimatedHours: recentSubtasksArray.reduce(
        (sum, s) => sum + (s.estimatedHours || 0),
        0
      ),
      totalActualHours: recentSubtasksArray.reduce(
        (sum, s) => sum + (s.actualHours || 0),
        0
      ),
      averageTimeline:
        projectsArray.length > 0
          ? Math.round(
              projectsArray.reduce((sum, p) => sum + (p.timeline || 0), 0) /
                projectsArray.length
            )
          : 0,
      totalSubtasks: recentSubtasksArray.length,
      completedSubtasks: recentSubtasksArray.filter(
        (s) => s.status === "Completed"
      ).length,
      pendingSubtasks: recentSubtasksArray.filter((s) => s.status === "Pending")
        .length,
      inProgressSubtasks: recentSubtasksArray.filter(
        (s) => s.status === "In Progress"
      ).length,
      todaysTaskCount: todaysTasks.length,
      overdueTaskCount: overdueTasksFromSubtasks.length,
    };

    // Subtask statistics using available data
    const subtaskStats = {
      byPriority: {
        high: recentSubtasksArray.filter((s) => s.priority === "High").length,
        medium: recentSubtasksArray.filter((s) => s.priority === "Medium")
          .length,
        low: recentSubtasksArray.filter((s) => s.priority === "Low").length,
      },
      byStatus: {
        completed: recentSubtasksArray.filter((s) => s.status === "Completed")
          .length,
        inProgress: recentSubtasksArray.filter(
          (s) => s.status === "In Progress"
        ).length,
        pending: recentSubtasksArray.filter((s) => s.status === "Pending")
          .length,
      },
      averageEstimatedHours:
        recentSubtasksArray.length > 0
          ? (
              recentSubtasksArray.reduce(
                (sum, s) => sum + (s.estimatedHours || 0),
                0
              ) / recentSubtasksArray.length
            ).toFixed(1)
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
      todaysTask,
      todaysTasks,
      upcomingDeadlines,
      recentProjects,
      overdueTasks,
      workloadAnalysis,
      subtaskStats,
    });
  };

  // Helper function to calculate subtask progress
  const calculateSubtaskProgress = (subtask) => {
    if (subtask.status === "Completed") return 100;
    if (subtask.status === "In Progress") return 50;
    return 0;
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

  if (userLoading) {
    return <DashboardLoader />;
  }

  return (
    <>
      <ErrorMessages
        userError={userError}
        projectError={projectError}
        statsError={statsError}
        subtaskError={subtaskError}
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

      <EnhancedDashboardStatsCards
        stats={safeStats}
        workloadAnalysis={dashboardData.workloadAnalysis}
        subtaskStats={dashboardData.subtaskStats}
        isLoading={statsLoading || subtaskLoading}
      />

      <EnhancedOverviewContent
        dashboardData={dashboardData}
        onCreateProject={handleCreateProject}
        isLoading={projectLoading || subtaskLoading}
      />

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

// Enhanced Component: Error Messages
const ErrorMessages = ({
  userError,
  projectError,
  statsError,
  subtaskError,
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
    {subtaskError && (
      <ErrorMessage
        message={`Subtask error: ${subtaskError}`}
        onRetry={onRetryProjects}
        onClose={onClearErrors}
        className="mb-6"
      />
    )}
  </>
);

// Enhanced Component: Dashboard Stats Cards with Subtask Data
const EnhancedDashboardStatsCards = ({
  stats,
  workloadAnalysis,
  subtaskStats,
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
    <>
      {/* Project Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <HomeCard
          title="Total Projects"
          value={stats?.total || 0}
          className="text-gray-800"
          icon={icon1}
        />
        <HomeCard
          title="Pending"
          value={stats?.pending || 0}
          className="text-yellow-600"
          icon={icon2}
        />
        <HomeCard
          title="In Progress"
          value={stats?.inProgress || 0}
          className="text-blue-600"
          icon={icon3}
        />
        <HomeCard
          title="Completed"
          value={stats?.completed || 0}
          className="text-green-600"
          icon={icon4}
        />
      </div>
    </>
  );
};

// Enhanced Component: Overview Content with Real Data
const EnhancedOverviewContent = ({
  dashboardData,
  onCreateProject,
  isLoading,
}) => {
  const {
    currentProject,
    todaysTask,
    todaysTasks,
    upcomingDeadlines,
    recentProjects,
    overdueTasks,
  } = dashboardData;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (
    !currentProject &&
    !todaysTask &&
    upcomingDeadlines.length === 0 &&
    recentProjects.length === 0
  ) {
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
        {/* Current Project - Takes full width on mobile, 2/3 on desktop */}
        <div className="w-full">
          <CurrentProjectCard project={currentProject} />
        </div>
      </div>

      {/* Today's Tasks Overview */}
      {todaysTasks && todaysTasks.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-blue-500" />
            All Today's Tasks ({todaysTasks.length})
          </h3>
          <div className="grid gap-3">
            {todaysTasks.slice(1, 6).map((task, index) => (
              <div
                key={task.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.name}</h4>
                  <p className="text-sm text-gray-600">{task.project}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>Due: {task.dueTime}</span>
                    <span>Est: {task.estimatedHours}h</span>
                    {task.category && <span>{task.category}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      task.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : task.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
            {todaysTasks.length > 6 && (
              <div className="text-center text-sm text-gray-500 py-2">
                +{todaysTasks.length - 6} more tasks for today
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overdue Tasks Alert (if any) */}
      {overdueTasks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HiOutlineExclamationCircle
              className="text-red-500 mt-1 flex-shrink-0"
              size={20}
            />
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-2">
                ⚠️ {overdueTasks.length} Overdue Item
                {overdueTasks.length > 1 ? "s" : ""}
              </h3>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between bg-white p-3 rounded border"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      {item.taskName && (
                        <p className="text-sm text-gray-700 font-medium">
                          Task: {item.taskName}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Due: {formatDate(item.dueDate)} at{" "}
                        {item.dueTime || "5:00 PM"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{item.category}</span>
                        <span>{item.priority} Priority</span>
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {item.type === "subtask" ? "Task" : "Project"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-red-600">
                        {Math.ceil(
                          (new Date() - new Date(item.dueDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days overdue
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.progress || 0}% complete
                      </div>
                    </div>
                  </div>
                ))}
                {overdueTasks.length > 3 && (
                  <div className="text-center">
                    <p className="text-sm text-red-600">
                      and {overdueTasks.length - 3} more overdue item
                      {overdueTasks.length - 3 > 1 ? "s" : ""}
                    </p>
                  </div>
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
            Recent Activity ({recentProjects.length})
          </h3>
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <div
                key={project._id || index}
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
                    {project.timeline && (
                      <span>Timeline: {project.timeline} days</span>
                    )}
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

export default Dashboard;
