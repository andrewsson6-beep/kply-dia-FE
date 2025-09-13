import axios from 'axios';

// Base URL from env; fallback to local dev
const API_BASE_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8000';

// Token accessor (injected from store setup)
let getTokens = () => ({ accessToken: null });
export const setTokenAccessor = fn => {
  getTokens = fn;
};

// Axios instance (all non-auth requests add bearer automatically)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

axiosInstance.interceptors.request.use(config => {
  const { accessToken } = getTokens() || {};
  if (accessToken && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return config;
});

// --- Mock helpers ---------------------------------------------------------
const delay = ms => new Promise(res => setTimeout(res, ms));

// Seed mock data (would be replaced by server data later)
let mockForanes = [
  {
    id: 1,
    churchName: 'Our Lady of Dolours Church',
    place: 'Mundakkayam',
    vicarName: 'Rev. Fr. James Muthanattu',
    contactNumber: '9633104090',
    totalAmount: 'Rs. 12,00,692',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
  },
  {
    id: 2,
    churchName: "St. Mary's Cathedral",
    place: 'Kochi',
    vicarName: 'Rev. Fr. John Doe',
    contactNumber: '9876543210',
    totalAmount: 'Rs. 15,00,000',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
  },
  {
    id: 3,
    churchName: 'Holy Cross Church',
    place: 'Thrissur',
    vicarName: 'Rev. Fr. Michael',
    contactNumber: '9999888777',
    totalAmount: 'Rs. 8,50,000',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnacSXF9M0AX7bnQVOMKA8HjSHIiPRF1NA9g&s',
  },
];

// For simplicity parishes reuse same initial data
let mockParishes = mockForanes.map(p => ({ ...p, id: p.id }));

// Communities by parent key `${type}:${id}`
const mockCommunities = {};
const ensureCommunitySeed = parentKey => {
  if (!mockCommunities[parentKey]) {
    mockCommunities[parentKey] = [
      { id: 1, number: 1, name: 'St Bartholomew' },
      { id: 2, number: 2, name: 'St Evaparasiamma' },
      { id: 3, number: 3, name: 'St Thomas' },
    ];
  }
};

// Families per community id
const mockFamilies = {
  1: [
    {
      id: 1,
      familyName: 'The Johnsons',
      community: "St. Mary's",
      familyHead: 'Michael Johnson',
      contactNumber: '123-456-7890',
      totalAmount: 'Rs. 50,000',
    },
  ],
  2: [
    {
      id: 2,
      familyName: 'The Smiths',
      community: 'St. Thomas',
      familyHead: 'Sarah Smith',
      contactNumber: '987-654-3210',
      totalAmount: 'Rs. 65,300',
    },
  ],
  3: [
    {
      id: 3,
      familyName: 'The Browns',
      community: 'Holy Family',
      familyHead: 'David Brown',
      contactNumber: '555-123-0000',
      totalAmount: 'Rs. 42,780',
    },
  ],
};

// --- Auth (real) ----------------------------------------------------------
export const authApi = {
  // credentials: { email, password }
  login: async ({ email, password }) => {
    // Map fields to API contract
    const payload = {
      useremail: email,
      userpassword: password,
    };

    try {
      const res = await axiosInstance.post('/userlogin', payload);

      // Some backends wrap in { code, msg, data }
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        const reason =
          (typeof data === 'string' && data) || msg || 'Login failed';
        const err = new Error(reason);
        err.status = res.status;
        throw err;
      }

      const {
        access_token,
        access_token_expire_time,
        session_uuid,
        usr_id,
        usr_username,
        usr_email,
        usr_rol_id,
      } = data;

      // Build app user model
      const user = {
        id: usr_id,
        username: usr_username,
        email: usr_email,
        roleId: usr_rol_id,
      };

      return {
        user,
        accessToken: access_token,
        refreshToken: null,
        tokenExpiresAt: access_token_expire_time || null,
        sessionUuid: session_uuid || null,
      };
    } catch (error) {
      // Normalize error message
      const res = error.response;
      if (res?.data) {
        const { code, data, msg } = res.data;
        if (code === 400) {
          throw new Error(
            (typeof data === 'string' && data) || msg || 'Invalid Credentials'
          );
        }
        throw new Error(msg || 'Login failed');
      }
      throw new Error(error.message || 'Network error');
    }
  },
  changePassword: async ({ current_password, new_password }) => {
    try {
      const res = await axiosInstance.post('/changepassword', {
        current_password,
        new_password,
      });
      const { code, msg, data } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Change password failed'
        );
      }
      return {
        message:
          typeof data === 'string' ? data : 'Password changed successfully',
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { msg, data } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Change password failed'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  logout: async () => {
    // If backend supports logout, call it. For now, just resolve.
    await delay(100);
    return { success: true };
  },
};

// --- Domain APIs ----------------------------------------------------------
export const domainApi = {
  fetchForanes: async () => {
    await delay(500);
    return [...mockForanes];
  },
  fetchParishes: async () => {
    await delay(500);
    return [...mockParishes];
  },
  fetchCommunities: async (parentType, parentId) => {
    await delay(400);
    const key = `${parentType}:${parentId}`;
    ensureCommunitySeed(key);
    return [...mockCommunities[key]];
  },
  addCommunity: async (parentType, parentId, data) => {
    await delay(400);
    const key = `${parentType}:${parentId}`;
    ensureCommunitySeed(key);
    const list = mockCommunities[key];
    const nextId = list.length ? Math.max(...list.map(c => c.id)) + 1 : 1;
    const number =
      data.number ||
      (list.length ? Math.max(...list.map(c => c.number)) + 1 : 1);
    const created = { id: nextId, number, name: data.name };
    list.push(created);
    return created;
  },
  fetchFamilies: async communityId => {
    await delay(400);
    return [...(mockFamilies[communityId] || [])];
  },
  addFamily: async (communityId, data) => {
    await delay(400);
    if (!mockFamilies[communityId]) mockFamilies[communityId] = [];
    const list = mockFamilies[communityId];
    const nextId = list.length ? Math.max(...list.map(f => f.id)) + 1 : 1;
    const created = {
      id: nextId,
      familyName: data.familyName,
      community: data.community,
      familyHead: data.familyHead,
      contactNumber: data.contactNumber,
      totalAmount: data.totalAmount || 'Rs. 0',
    };
    list.push(created);
    return created;
  },
  updateFamily: async (communityId, data) => {
    await delay(400);
    const list = mockFamilies[communityId] || [];
    const idx = list.findIndex(f => f.id === data.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      return list[idx];
    }
    throw new Error('Family not found');
  },
  deleteFamily: async (communityId, id) => {
    await delay(300);
    const list = mockFamilies[communityId] || [];
    const idx = list.findIndex(f => f.id === id);
    if (idx !== -1) {
      const removed = list.splice(idx, 1)[0];
      return removed;
    }
    throw new Error('Family not found');
  },
  addContribution: async (communityId, familyId, data) => {
    await delay(300);
    const list = mockFamilies[communityId] || [];
    const fam = list.find(f => f.id === familyId);
    if (fam) {
      const current =
        Number((fam.totalAmount || '0').replace(/[^0-9]/g, '')) || 0;
      const updatedValue = current + data.amount;
      fam.totalAmount = `Rs. ${updatedValue.toLocaleString('en-IN')}`;
      return { ...fam };
    }
    throw new Error('Family not found');
  },
};

export { axiosInstance };
