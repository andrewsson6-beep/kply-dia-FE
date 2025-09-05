import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import { FaLayerGroup, FaChurch, FaUsers, FaUser } from 'react-icons/fa';

// Temporary mock counts (replace with real aggregated state / API later)
// These could be lifted to a context/store when backend available.
const useDashboardStats = () => {
  // Simulated data sources (replace with selectors when integrated)
  const foranes = useMemo(() => [1, 2, 3], []); // ForaneList shows 3
  const parishes = useMemo(() => [1, 2, 3], []); // ParishList shows 3
  const communities = useMemo(() => [1, 2, 3], []); // CommunityList initial 3
  const individuals = useMemo(() => new Array(17).fill(0), []); // Placeholder

  return {
    forane: foranes.length,
    parish: parishes.length,
    community: communities.length,
    individual: individuals.length,
  };
};

const accentClassMap = {
  blue: {
    border: 'border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
    value: 'text-blue-600',
    view: 'text-blue-600 bg-blue-50 border-blue-200',
    blob: 'bg-blue-400/20',
    bar: 'from-blue-400 via-blue-500 to-blue-600',
    ring: 'focus:ring-blue-300',
  },
  cyan: {
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100 text-cyan-600',
    value: 'text-cyan-600',
    view: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    blob: 'bg-cyan-400/20',
    bar: 'from-cyan-400 via-cyan-500 to-cyan-600',
    ring: 'focus:ring-cyan-300',
  },
  violet: {
    border: 'border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600',
    value: 'text-violet-600',
    view: 'text-violet-600 bg-violet-50 border-violet-200',
    blob: 'bg-violet-400/20',
    bar: 'from-violet-400 via-violet-500 to-violet-600',
    ring: 'focus:ring-violet-300',
  },
  rose: {
    border: 'border-rose-200',
    iconBg: 'bg-rose-100 text-rose-600',
    value: 'text-rose-600',
    view: 'text-rose-600 bg-rose-50 border-rose-200',
    blob: 'bg-rose-400/20',
    bar: 'from-rose-400 via-rose-500 to-rose-600',
    ring: 'focus:ring-rose-300',
  },
};

const StatCard = ({ title, value, icon, accent, onClick, subtitle }) => {
  const a = accentClassMap[accent] || accentClassMap.blue;
  const IconComp = icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 text-left shadow-lg border bg-gradient-to-br from-white/90 via-white/80 to-white/60 backdrop-blur hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 ${a.border} ${a.ring}`}
    >
      <div
        className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 ${a.blob}`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center justify-center rounded-lg w-10 h-10 shadow-inner shadow-white/30 ${a.iconBg}`}
            >
              {IconComp && <IconComp className="text-lg" />}
            </span>
            <h3 className="text-sm font-semibold tracking-wide text-gray-600 uppercase">
              {title}
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-extrabold tracking-tight tabular-nums ${a.value}`}
            >
              {value}
            </span>
            {subtitle && (
              <span className="text-xs text-gray-400 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        <div
          className={`opacity-0 group-hover:opacity-100 transition duration-300 text-xs font-medium px-2 py-1 rounded-full border shadow-sm ${a.view}`}
        >
          View
        </div>
      </div>
      <div className="relative mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 w-full origin-left scale-x-0 group-hover:scale-x-100 bg-gradient-to-r transition-transform duration-700 ${a.bar}`}
        />
      </div>
    </button>
  );
};

const Dashboard = () => {
  const stats = useDashboardStats();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
      <Header title="Dashboard" />
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[5%] h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[0%] h-80 w-80 rounded-full bg-indigo-300/10 blur-3xl" />
      </div>
      <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              A quick summary of hierarchical records in the system.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Forane"
            value={stats.forane}
            icon={FaLayerGroup}
            accent="blue"
            onClick={() => navigate('/forane/list')}
            subtitle="regions"
          />
          <StatCard
            title="Parish"
            value={stats.parish}
            icon={FaChurch}
            accent="cyan"
            onClick={() => navigate('/parish/list')}
            subtitle="churches"
          />
          <StatCard
            title="Community"
            value={stats.community}
            icon={FaUsers}
            accent="violet"
            // onClick={() => navigate('/parish/list/1/community/list')}
            subtitle="groups"
          />
          <StatCard
            title="Individual"
            value={stats.individual}
            icon={FaUser}
            accent="rose"
            onClick={() => navigate('/institution/list')}
            subtitle="members"
          />
        </div>

        {/* Future expansion area / placeholder */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Activity Timeline (Coming Soon)
            </h2>
            <p className="text-sm text-gray-500">
              This area will display recent changes like newly added parishes,
              communities, and member activity.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Actions
            </h2>
            <ul className="space-y-2 text-sm text-blue-600">
              <li>
                <button
                  onClick={() => navigate('/forane/add')}
                  className="hover:underline"
                >
                  + Add Forane
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/parish/add')}
                  className="hover:underline"
                >
                  + Add Parish
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/institution/add')}
                  className="hover:underline"
                >
                  + Add Institution
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
