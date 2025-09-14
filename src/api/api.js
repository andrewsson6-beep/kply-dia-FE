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

// (removed mockForanes; real API in use)

// (removed mockParishes; real API in use)

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
const formatINR = val => {
  const num = Number(val);
  if (Number.isNaN(num)) return String(val ?? '');
  // Keep decimals only if present and non-zero
  const hasDecimals =
    String(val).includes('.') && Number(String(val).split('.')[1]) > 0;
  return `Rs. ${num.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`;
};

export const domainApi = {
  fetchForanes: async () => {
    try {
      const res = await axiosInstance.get('/forane-list');
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !Array.isArray(data)) {
        throw new Error(msg || 'Failed to load foranes');
      }
      const items = data.map(row => ({
        id: row.for_id,
        churchName: row.for_name,
        place: row.for_location,
        vicarName: row.for_vicar_name,
        contactNumber: row.for_contact_number,
        totalAmount: formatINR(row.for_total_contribution_amount),
        imageUrl: undefined,
      }));
      const options = data.map(row => ({
        id: row.for_id,
        name: row.for_name,
        location: row.for_location,
      }));
      return { items, options };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to load foranes'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addForane: async payload => {
    try {
      const res = await axiosInstance.post('/add-new-forane', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to add forane'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to add forane'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchParishes: async () => {
    try {
      const res = await axiosInstance.get('/all-parish-list');
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !Array.isArray(data)) {
        throw new Error(msg || 'Failed to load parishes');
      }
      const items = data.map(row => ({
        id: row.par_id,
        churchName: row.par_name,
        place: row.par_location,
        vicarName: row.par_vicar_name,
        contactNumber: row.par_contact_number || '',
        totalAmount: formatINR(row.par_total_contribution_amount),
        imageUrl: undefined,
        foraneId: row.par_for_id,
        code: row.par_code,
      }));
      return items;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to load parishes'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addParish: async payload => {
    try {
      const res = await axiosInstance.post('/add-new-parish', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to add parish'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to add parish'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addIndividual: async payload => {
    try {
      const res = await axiosInstance.post(
        '/individual/add-new-individual',
        payload
      );
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add individual'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add individual'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  updateIndividual: async payload => {
    // payload: { ind_id, ind_full_name, ind_phone_number, ind_email, ind_address }
    try {
      const res = await axiosInstance.put('/individual/', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update individual'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update individual'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addIndividualContribution: async payload => {
    try {
      const res = await axiosInstance.post(
        '/individual/add-individual-contribution',
        payload
      );
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add contribution'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add contribution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchIndividuals: async () => {
    try {
      const res = await axiosInstance.get('/individual/individuals-list');
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !Array.isArray(data)) {
        throw new Error(msg || 'Failed to load individuals');
      }
      const items = data.map(row => {
        const address = row.ind_address || '';
        const parts = address
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const place = parts.length ? parts[parts.length - 1] : '';
        const houseName = parts.length
          ? parts.slice(0, -1).join(', ')
          : address;
        return {
          id: row.ind_id,
          individualName: row.ind_full_name,
          contactNumber: row.ind_phone_number || '',
          email: row.ind_email || '',
          address,
          houseName,
          place,
          totalAmount: formatINR(row.ind_total_contribution_amount),
        };
      });
      return items;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load individuals'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchIndividualDetails: async ind_id => {
    try {
      const res = await axiosInstance.post('/individual/individual-details', {
        ind_id,
      });
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to load individual');
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load individual'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  updateIndividualContribution: async payload => {
    try {
      const res = await axiosInstance.post(
        '/individual/update-individual-contribution',
        payload
      );
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update contribution'
        );
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update contribution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
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
