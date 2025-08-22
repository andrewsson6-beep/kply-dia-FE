import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '../../constants';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

const SideBar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleSubmenu = label => {
    setExpandedMenus(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isSubmenuActive = submenu => {
    return submenu?.some(item => location.pathname === item.path) || false;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-50 text-gray-700 transform transition-transform duration-300 ease-in-out z-30 border-r border-gray-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:h-screen`}
      >
        <div className="sidebar-header p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-blue-500 text-center">MENU</h2>
        </div>
        <nav className="p-4 sidebar-nav">
          <ul className="space-y-1">
            {menuItems.map(item => {
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.label);
              const isActive = item.path
                ? location.pathname === item.path
                : false;
              const isSubmenuItemActive = hasSubmenu
                ? isSubmenuActive(item.submenu)
                : false;

              return (
                <li key={item.path || item.label}>
                  {hasSubmenu ? (
                    <>
                      {/* Menu item with submenu */}
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-colors ${
                          isSubmenuItemActive
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg w-5 flex justify-center">
                            <item.icon />
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-sm">
                          {isExpanded ? (
                            <IoChevronUpOutline />
                          ) : (
                            <IoChevronDownOutline />
                          )}
                        </span>
                      </button>

                      {/* Submenu items */}
                      {isExpanded && item.submenu && (
                        <ul className="ml-8 mt-2 space-y-1">
                          {item.submenu.map(subItem => {
                            const isSubActive =
                              location.pathname === subItem.path;
                            return (
                              <li key={subItem.path}>
                                <Link
                                  to={subItem.path}
                                  onClick={handleLinkClick}
                                  className={`block p-2 rounded-lg transition-colors ${
                                    isSubActive
                                      ? 'bg-blue-400 text-white shadow-sm'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                  }`}
                                >
                                  <span className="font-medium text-sm">
                                    {subItem.label}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    /* Regular menu item without submenu */
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      <span className="text-lg w-5 flex justify-center">
                        <item.icon />
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
