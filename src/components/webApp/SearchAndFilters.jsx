// components/webApp/SearchAndFilters.jsx
import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiOutlineX, HiOutlineViewGrid, HiOutlineFolder } from "react-icons/hi";
import LoadingSpinner from "../ui/LoadingSpinner";

const SearchAndFilters = ({
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
  resultsCount,
  showViewToggle = false,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (v) => v && v !== "createdAt" && v !== "desc"
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Projects ({resultsCount})
            </h3>
            {isSearching && <LoadingSpinner size={20} />}
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <FilterToggle
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            {showViewToggle && (
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            )}

            {(searchQuery || hasActiveFilters) && (
              <button
                onClick={clearSearch}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel filters={filters} setFilters={setFilters} />
        )}
      </div>
    </div>
  );
};

const SearchInput = ({ searchQuery, setSearchQuery }) => (
  <div className="relative">
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search projects..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <HiOutlineX className="h-4 w-4" />
      </button>
    )}
  </div>
);

const FilterToggle = ({ showFilters, setShowFilters }) => (
  <button
    onClick={() => setShowFilters(!showFilters)}
    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
      showFilters
        ? "bg-blue-50 border-blue-300 text-blue-700"
        : "border-gray-300 text-gray-700 hover:bg-gray-50"
    }`}
  >
    <FaFilter className="h-4 w-4" />
    Filters
  </button>
);

const ViewModeToggle = ({ viewMode, setViewMode }) => (
  <div className="flex items-center border border-gray-300 rounded-lg">
    <button
      onClick={() => setViewMode("grid")}
      className={`p-2 rounded-l-lg transition-colors ${
        viewMode === "grid"
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <HiOutlineViewGrid className="h-4 w-4" />
    </button>
    <button
      onClick={() => setViewMode("list")}
      className={`p-2 rounded-r-lg transition-colors ${
        viewMode === "list"
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <HiOutlineFolder className="h-4 w-4" />
    </button>
  </div>
);

const FilterPanel = ({ filters, setFilters }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <FilterSelect
          label="Status"
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { value: "", label: "All" },
            { value: "Pending", label: "Pending" },
            { value: "In Progress", label: "In Progress" },
            { value: "Completed", label: "Completed" },
          ]}
        />

        <FilterInput
          label="Min Progress"
          type="number"
          min="0"
          max="100"
          value={filters.progressMin}
          onChange={(value) => updateFilter("progressMin", value)}
          placeholder="0"
        />

        <FilterInput
          label="Max Progress"
          type="number"
          min="0"
          max="100"
          value={filters.progressMax}
          onChange={(value) => updateFilter("progressMax", value)}
          placeholder="100"
        />

        <FilterInput
          label="Due From"
          type="date"
          value={filters.dueDateFrom}
          onChange={(value) => updateFilter("dueDateFrom", value)}
        />

        <FilterInput
          label="Due To"
          type="date"
          value={filters.dueDateTo}
          onChange={(value) => updateFilter("dueDateTo", value)}
        />

        <FilterSelect
          label="Sort By"
          value={filters.sortBy}
          onChange={(value) => updateFilter("sortBy", value)}
          options={[
            { value: "createdAt", label: "Created Date" },
            { value: "name", label: "Name" },
            { value: "dueDate", label: "Due Date" },
            { value: "progress", label: "Progress" },
          ]}
        />
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  ...props
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder={placeholder}
      {...props}
    />
  </div>
);

export default SearchAndFilters;
