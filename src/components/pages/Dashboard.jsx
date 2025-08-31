import React from 'react';
import Header from '../layout/Header';

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-full">
      <Header title="Dashboard" />
      <div className="p-6 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome to Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Total Users
              </h3>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Revenue
              </h3>
              <p className="text-2xl font-bold text-green-600">$45,678</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Orders
              </h3>
              <p className="text-2xl font-bold text-purple-600">567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
