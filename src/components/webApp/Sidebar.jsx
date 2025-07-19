import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { logo } from "../../../public";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeButton, setActiveButton] = useState(1);

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/dashboard" || currentPath === "/") {
      setActiveButton(1);
    } else if (
      currentPath.startsWith("/projects") ||
      currentPath.startsWith("/project/") ||
      currentPath.includes("/project/") ||
      currentPath.includes("subtask")
    ) {
      setActiveButton(2);
    } else if (currentPath === "/settings") {
      setActiveButton(3);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Helper function to get user data
  const getUserData = () => {
    if (!user) return { firstname: "User", email: "", initials: "U" };

    // Handle different possible user data structures
    let userData = user;

    // If user has a data property, use that
    if (user.data) {
      userData = user.data;
    }

    const firstname = userData.firstname || "User";
    const email = userData.email || "";
    const initials = firstname[0]?.toUpperCase() || "U";

    return { firstname, email, initials };
  };

  const { firstname, email, initials } = getUserData();

  const navigationItems = [
    {
      id: 1,
      title: "Overview",
      path: "/dashboard",
      icon: HiOutlineViewGrid,
    },
    {
      id: 2,
      title: "Projects",
      path: "/projects",
      icon: HiOutlineFolder,
    },
    {
      id: 3,
      title: "Settings",
      path: "/settings",
      icon: IoIosSettings,
    },
  ];

  const NavItem = ({ item, isActive, isMobile = false }) => (
    <Link
      to={item.path}
      onClick={isMobile ? closeSidebar : undefined}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.title}</span>
    </Link>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeButton === item.id}
              />
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {firstname}
                </p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <HiOutlineLogout size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className="relative flex flex-col w-64 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeButton === item.id}
                  isMobile={true}
                />
              ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {firstname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <HiOutlineLogout size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop content spacer */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0" />
    </>
  );
};

export default Sidebar;
