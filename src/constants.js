import { MdDashboard } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import { FaRegListAlt } from 'react-icons/fa';
import { VscSettings } from 'react-icons/vsc';
import { MdOutlineLogout } from 'react-icons/md';

export const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/user-profile', label: 'User Profile', icon: FaUserAlt },
  {
    label: 'Forane',
    icon: FaRegListAlt,
    submenu: [
      { path: '/forane/list', label: 'Forane List' },
      { path: '/forane/add', label: 'Add Forane' },
    ],
  },
  {
    label: 'Parish',
    icon: FaRegListAlt,
    submenu: [
      { path: '/parish/list', label: 'Parish List' },
      { path: '/parish/add', label: 'Add Parish' },
    ],
  },
  { path: '/institution', label: 'Institution', icon: FaRegListAlt },
  { path: '/others', label: 'Others', icon: VscSettings },
  { path: '/logout', label: 'Log out', icon: MdOutlineLogout },
];
