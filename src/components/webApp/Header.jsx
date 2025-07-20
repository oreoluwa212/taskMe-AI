import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineX,
} from "react-icons/hi";
import { BiSolidUserCircle } from "react-icons/bi";
import useAuthStore from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import api from "../../services/api";

const Header = () => {
  const { user, logout } = useAuthStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate(); // Add this line
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    status: "",
    progressMin: "",
    progressMax: "",
    dueDateFrom: "",
    dueDateTo: "",
  });

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search functionality
  const performSearch = async (query, filters = {}) => {
    if (!query.trim() && !Object.values(filters).some((v) => v)) return;

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append("query", query.trim());

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/projects/search?${params.toString()}`);
      const results = response.data?.data || response.data || [];
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to local search if API fails
      const localResults = projects.filter(
        (project) =>
          project.name?.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(localResults);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery || Object.values(searchFilters).some((v) => v)) {
        performSearch(searchQuery, searchFilters);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchFilters]);

  const getUserData = () => {
    if (!user) return { name: "Guest", email: "", initials: "G", avatar: null };

    // Handle different possible user data structures
    let userData = user;

    // If user has a data property, use that
    if (user.data) {
      userData = user.data;
    }

    let name = "Guest";
    let email = userData.email || "";
    let initials = "G";
    let avatar = userData.avatar?.url || null; // Extract avatar URL

    // Get name from different possible formats
    if (userData.firstname && userData.lastname) {
      name = `${userData.firstname} ${userData.lastname}`;
      initials = (userData.firstname[0] + userData.lastname[0]).toUpperCase();
    } else if (userData.firstname) {
      name = userData.firstname;
      initials = userData.firstname[0].toUpperCase();
    } else if (userData.name) {
      name = userData.name;
      const nameParts = userData.name.trim().split(" ");
      if (nameParts.length >= 2) {
        initials = (
          nameParts[0][0] + nameParts[nameParts.length - 1][0]
        ).toUpperCase();
      } else {
        initials = nameParts[0][0].toUpperCase();
      }
    }

    return { name, email, initials, avatar };
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fixed navigation function
  const handleSearchSelect = (project) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);

    // Use React Router's navigate instead of window.location.href
    // Fixed route path to match App.jsx (singular 'project', not 'projects')
    navigate(`/project/${project.id || project._id}/details`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchFilters({
      status: "",
      progressMin: "",
      progressMax: "",
      dueDateFrom: "",
      dueDateTo: "",
    });
  };

  const { name, email, initials, avatar } = getUserData();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Date and Search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:block">
              <h1 className="text-sm text-gray-500 font-medium">
                {formattedDate}
              </h1>
            </div>

            {/* Enhanced Search bar */}
            <div className="relative flex-1 max-w-lg" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search projects, tasks, or files..."
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white sm:text-sm transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <HiOutlineX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (searchQuery || searchResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto z-50">
                  {/* Search Filters */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <select
                        value={searchFilters.status}
                        onChange={(e) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="px-2 py-1 border rounded text-xs"
                      >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Min Progress"
                        value={searchFilters.progressMin}
                        onChange={(e) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            progressMin: e.target.value,
                          }))
                        }
                        className="px-2 py-1 border rounded text-xs w-20"
                      />
                      <input
                        type="number"
                        placeholder="Max Progress"
                        value={searchFilters.progressMax}
                        onChange={(e) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            progressMax: e.target.value,
                          }))
                        }
                        className="px-2 py-1 border rounded text-xs w-20"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((project) => (
                        <button
                          key={project.id || project._id}
                          onClick={() => handleSearchSelect(project)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {project.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {project.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  project.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : project.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {project.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {project.progress}%
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">
                        No projects found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">
                        Start typing to search projects...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right section - Notifications and User */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
              <span className="sr-only">View notifications</span>
              <HiOutlineBell className="h-6 w-6" />
              {/* Notification dot */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      avatar ? "hidden" : "flex"
                    }`}
                  >
                    {initials}
                  </div>
                </div>

                {/* User info - hidden on mobile */}
                <div className="hidden sm:block text-left">
                  <div className="text-gray-900 font-medium">{name}</div>
                  {email && (
                    <div className="text-gray-500 text-xs truncate max-w-[150px]">
                      {email}
                    </div>
                  )}
                </div>

                <HiOutlineChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{name}</div>
                      {email && (
                        <div className="text-gray-500 text-xs truncate">
                          {email}
                        </div>
                      )}
                    </div>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile date - shown only on mobile */}
      <div className="sm:hidden px-4 pb-3">
        <p className="text-sm text-gray-500 font-medium">{formattedDate}</p>
      </div>
    </header>
  );
};

export default Header;
