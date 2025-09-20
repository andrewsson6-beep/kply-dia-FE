import React from 'react';
import SideBar from './SideBar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ForaneList from '../pages/ForaneList';
import AddForane from '../pages/AddForane';
import ParishList from '../pages/ParishList';
import AddParish from '../pages/AddParish';
import InstitutionList from '../pages/InstitutionList';
import AddInstitution from '../pages/AddInstitution';
import InstitutionVisit from '../pages/InstitutionVisit';
import FamilyList from '../pages/FamilyList';
import AddFamily from '../pages/AddFamily';
import CommunityList from '../pages/CommunityList';
import ForaneParishList from '../pages/ForaneParishList';
import OthersList from '../pages/OthersList';
import IndividualVisit from '../pages/IndividualVisit';
import UserProfile from '../pages/UserProfile';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile toggle (hamburger) button */}
      {!sidebarOpen && (
        <button
          type="button"
          aria-label="Open sidebar menu"
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200 shadow hover:bg-gray-50 active:scale-95 transition"
        >
          <span className="block w-5 h-[2px] bg-gray-700 mb-1" />
          <span className="block w-5 h-[2px] bg-gray-700 mb-1" />
          <span className="block w-5 h-[2px] bg-gray-700" />
        </button>
      )}

      <main className={`flex-1 overflow-y-auto transition-all duration-300`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forane/list" element={<ForaneList />} />
          <Route path="/forane/add" element={<AddForane />} />
          <Route path="/parish/list" element={<ParishList />} />
          <Route path="/parish/add" element={<AddParish />} />
          {/* Forane -> Parishes under this Forane */}
          <Route
            path="/forane/list/:foraneId/community/list"
            element={<ForaneParishList />}
          />
          <Route
            path="/forane/list/:foraneId/community/:communityId/visit"
            element={<FamilyList />}
          />
          <Route path="/institution/list" element={<InstitutionList />} />
          <Route path="/institution/add" element={<AddInstitution />} />
          <Route
            path="/institution/:institutionId/visit"
            element={<InstitutionVisit />}
          />
          <Route path="/others" element={<OthersList />} />
          <Route
            path="/others/individual/:individualId/visit"
            element={<IndividualVisit />}
          />
          <Route path="/user-profile" element={<UserProfile />} />

          <Route
            path="/parish/list/:parishId/community/list"
            element={<CommunityList />}
          />
          <Route
            path="/parish/list/:parishId/community/:communityId/visit"
            element={<FamilyList />}
          />
          <Route
            path="/parish/list/:parishId/community/:communityId/family/add"
            element={<AddFamily />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
