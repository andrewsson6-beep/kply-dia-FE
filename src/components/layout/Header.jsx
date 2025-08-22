import React from 'react';

const Header = ({ title = 'Dashboard' }) => {
  return (
    <header className="header bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-20">
      <h1 className="header-title text-xl font-semibold text-gray-800">
        {title}
      </h1>
    </header>
  );
};

export default Header;
