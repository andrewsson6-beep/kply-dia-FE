import React from 'react';
import SideBar from './SideBar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ForaneList from '../pages/ForaneList';
import AddForane from '../pages/AddForane';
import ParishList from '../pages/ParishList';
import AddParish from '../pages/AddParish';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forane/list" element={<ForaneList />} />
          <Route path="/forane/add" element={<AddForane />} />
          <Route path="/parish/list" element={<ParishList />} />
          <Route path="/parish/add" element={<AddParish />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
