import axios from 'axios';

// Base URL from env; fallback to local dev
const API_BASE_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:8000';

// Token accessor (injected from store setup)
let getTokens = () => ({ accessToken: null, sessionUuid: null });
export const setTokenAccessor = fn => {
  getTokens = fn;
};

// Unauthorized handler to be provided by store setup
let onUnauthorized = null;
export const setUnauthorizedHandler = fn => {
  onUnauthorized = fn;
};

// Axios instance (all non-auth requests add bearer automatically)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(config => {
  const { accessToken, sessionUuid } = getTokens() || {};
  // Avoid sending any mock/dev tokens to real backend
  const isMockToken =
    typeof accessToken === 'string' &&
    accessToken.startsWith('mock-jwt-token-');
  if (accessToken && !isMockToken && !config.headers?.Authorization) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }
  if (sessionUuid && !config.headers?.session_uuid) {
    config.headers = {
      ...config.headers,
      session_uuid: sessionUuid,
    };
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const res = error.response;
    const msg = res?.data?.msg || res?.data?.data || error.message || '';
    const code = res?.data?.code;
    if (
      res?.status === 401 ||
      code === 401 ||
      /token invalid/i.test(String(msg))
    ) {
      try {
        onUnauthorized && onUnauthorized();
      } catch {
        // no-op
      }
    }
    return Promise.reject(error);
  }
);

// --- Mock helpers ---------------------------------------------------------
const delay = ms => new Promise(res => setTimeout(res, ms));

// (removed mockForanes; real API in use)

// (removed mockParishes; real API in use)

// (removed mockCommunities; real communities API in use)

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
      if (code !== 200) {
        throw new Error(msg || 'Failed to load foranes');
      }
      // Backend may return a string like 'No Foranes Present' when empty
      const list = Array.isArray(data) ? data : [];
      const items = list.map(row => ({
        id: row.for_id,
        churchName: row.for_name,
        place: row.for_location,
        vicarName: row.for_vicar_name,
        contactNumber: row.for_contact_number,
        totalAmount: formatINR(row.for_total_contribution_amount),
        imageUrl: undefined,
      }));
      const options = list.map(row => ({
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
  fetchParishesByForane: async forane_id => {
    try {
      const res = await axiosInstance.post('/all_forane_parishes', {
        forane_id,
      });
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(msg || 'Failed to load parishes for forane');
      }
      // Some backends return a string message when empty
      const list = Array.isArray(data) ? data : [];
      const items = list.map(row => ({
        id: row.par_id,
        churchName: row.par_name,
        place: row.par_location,
        vicarName: row.par_vicar_name || '',
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
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load parishes for forane'
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
  fetchInstitutions: async () => {
    try {
      const res = await axiosInstance.get('/institution/institution-list');
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !Array.isArray(data)) {
        throw new Error(msg || 'Failed to load institutions');
      }
      const items = data.map(row => {
        const address = row.ins_address || '';
        const parts = address
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        const place = parts.length ? parts[parts.length - 1] : '';
        return {
          id: row.ins_id,
          institutionName: row.ins_name,
          place,
          managerName: row.ins_head_name || '',
          managerContact: row.ins_phone || '',
          principalName: '',
          principalContact: '',
          administratorName: '',
          administratorContact: '',
          totalAmount: formatINR(row.ins_total_contribution_amount || 0),
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
            'Failed to load institutions'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addInstitution: async payload => {
    try {
      const res = await axiosInstance.post(
        '/institution/add-new-institution',
        payload
      );
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add institution'
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
            'Failed to add institution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchInstitutionDetails: async ins_id => {
    try {
      const res = await axiosInstance.post('/institution/institution-details', {
        ins_id,
      });
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to load institution');
      }
      return data;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load institution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addInstitutionContribution: async payload => {
    // payload: { incon_ins_id, incon_amount, incon_purpose }
    try {
      const res = await axiosInstance.post(
        '/institution/add-institution-contribution',
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
  updateInstitutionContribution: async payload => {
    // payload: { incon_id, incon_amount, incon_purpose }
    try {
      const res = await axiosInstance.post(
        '/institution/update-institution-contribution',
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
  updateInstitution: async payload => {
    // payload: { ins_id, ins_name, ins_phone, ins_email, ins_address, ins_type, ins_website, ins_head_name, ins_total_contribution_amount? }
    try {
      const res = await axiosInstance.put('/institution', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update institution'
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
            'Failed to update institution'
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
  updateCommunity: async payload => {
    // payload: { com_id, com_name?, com_total_contribution_amount?, com_updated_by }
    try {
      const res = await axiosInstance.post('/update-community', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200) {
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update community'
        );
      }
      // If API returns object data, map to UI model; otherwise return minimal info
      if (data && typeof data === 'object') {
        return {
          id: data.com_id,
          number: data.com_unique_no,
          name: data.com_name,
          code: data.com_code,
          parishId: data.com_par_id,
          foraneId: data.com_for_id,
          totalAmount: formatINR(data.com_total_contribution_amount || 0),
        };
      }
      // Fallback: just echo back the changed fields we know
      return {
        id: payload.com_id,
        name: payload.com_name,
        totalAmount:
          payload.com_total_contribution_amount !== undefined
            ? formatINR(payload.com_total_contribution_amount)
            : undefined,
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update community'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchCommunityDetails: async com_id => {
    try {
      const res = await axiosInstance.post('/community-details', { com_id });
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to load community');
      }
      // Map to UI model similar to fetchCommunities
      return {
        id: data.com_id,
        number: data.com_unique_no,
        name: data.com_name,
        code: data.com_code,
        parishId: data.com_par_id,
        foraneId: data.com_for_id,
        totalAmount: formatINR(data.com_total_contribution_amount || 0),
        families: Array.isArray(data.families) ? data.families : [],
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load community'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchCommunities: async (parentType, parentId) => {
    // Currently supported only for parish context
    console.log('parentType, parentid', parentType, parentId);
    if (parentType !== 'parish') {
      throw new Error('Communities can only be fetched for a parish');
    }
    try {
      const res = await axiosInstance.post('/community-list', {
        parish_id: parentId,
      });
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !Array.isArray(data)) {
        throw new Error(msg || 'Failed to load communities');
      }
      // Map API rows to UI model
      const items = data.map(row => ({
        id: row.com_id,
        number: row.com_unique_no,
        name: row.com_name,
        code: row.com_code,
        parishId: row.com_par_id,
        foraneId: row.com_for_id,
        totalAmount: formatINR(row.com_total_contribution_amount || 0),
        createdAt: row.com_created_at,
        createdBy: row.com_created_by,
      }));
      return items;
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to load communities'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addCommunity: async (parentType, parentId, data) => {
    if (parentType !== 'parish') {
      throw new Error('Communities can only be added under a parish');
    }
    try {
      const payload = {
        com_par_id: parentId,
        // accept either UI field `name` or API-shaped `com_name`
        com_name: (data?.com_name || data?.name || '').trim(),
      };
      const res = await axiosInstance.post('/create-new-community', payload);
      const { code, data: resp, msg } = res.data || {};
      if (code !== 200 || !resp) {
        throw new Error(
          (typeof resp === 'string' && resp) || msg || 'Failed to add community'
        );
      }
      // Map created record to UI model
      return {
        id: resp.com_id,
        number: resp.com_unique_no,
        name: resp.com_name,
        code: resp.com_code,
        parishId: resp.com_par_id,
        foraneId: resp.com_for_id,
        totalAmount: formatINR(resp.com_total_contribution_amount || 0),
        createdAt: resp.com_created_at,
        createdBy: resp.com_created_by,
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to add community'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  fetchFamilies: async communityId => {
    await delay(400);
    return [...(mockFamilies[communityId] || [])];
  },
  addFamily: async (communityId, data) => {
    // Real API: create-new-family
    try {
      const payload = {
        fam_com_id: communityId,
        fam_house_name: (data.familyName || '').trim(),
        fam_head_name: (data.familyHead || '').trim(),
        fam_phone_number: (data.contactNumber || '').trim(),
      };
      const res = await axiosInstance.post('/create-new-family', payload);
      const { code, data: resp, msg } = res.data || {};
      if (code !== 200 || !resp) {
        throw new Error(
          (typeof resp === 'string' && resp) || msg || 'Failed to add family'
        );
      }
      // Map response to UI model
      return {
        id: resp.fam_id,
        familyName: resp.fam_house_name,
        community: '',
        familyHead: resp.fam_head_name,
        contactNumber: resp.fam_phone_number || '',
        totalAmount: formatINR(resp.fam_total_contribution_amount || 0),
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data: d, msg } = res.data;
        throw new Error(
          (typeof d === 'string' && d) || msg || 'Failed to add family'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  updateFamily: async (communityIdOrPayload, maybeData) => {
    try {
      // Support legacy signature (communityId, data) and new (payload)
      const data = maybeData || communityIdOrPayload;
      const payload = {
        fam_id: data.id ?? data.fam_id,
        fam_house_name: (data.familyName ?? data.fam_house_name ?? '').trim(),
        fam_head_name: (data.familyHead ?? data.fam_head_name ?? '').trim(),
        fam_phone_number: (
          data.contactNumber ??
          data.fam_phone_number ??
          ''
        ).trim(),
        fam_total_contribution_amount: Number(
          typeof data.totalAmount === 'number'
            ? data.totalAmount
            : String(
                data.totalAmount ?? data.fam_total_contribution_amount ?? '0'
              ).replace(/[^0-9.]/g, '') || 0
        ),
      };
      const res = await axiosInstance.post('/update-family', payload);
      const { code, data: resp, msg } = res.data || {};
      if (code !== 200 || !resp) {
        throw new Error(
          (typeof resp === 'string' && resp) || msg || 'Failed to update family'
        );
      }
      return {
        id: resp.fam_id,
        familyName: resp.fam_house_name,
        community: '',
        familyHead: resp.fam_head_name,
        contactNumber: resp.fam_phone_number || '',
        totalAmount: formatINR(resp.fam_total_contribution_amount || 0),
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to update family'
        );
      }
      throw new Error(error.message || 'Network error');
    }
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
  fetchFamilyDetails: async fam_id => {
    try {
      const res = await axiosInstance.post('/family-details', { fam_id });
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to load family');
      }
      return {
        id: data.fam_id,
        code: data.fam_code,
        houseName: data.fam_house_name,
        headName: data.fam_head_name,
        phoneNumber: data.fam_phone_number,
        totalAmount: formatINR(data.fam_total_contribution_amount || 0),
        totalAmountRaw:
          Number(
            String(data.fam_total_contribution_amount || 0).replace(
              /[^0-9.]/g,
              ''
            )
          ) || 0,
        contributions: Array.isArray(data.contributions)
          ? data.contributions.map(r => ({
              id: r.fcon_id,
              amount: r.fcon_amount,
              date: r.fcon_date,
              purpose: r.fcon_purpose || '',
            }))
          : [],
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) || msg || 'Failed to load family'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  addFamilyContribution: async payload => {
    try {
      // payload: { fcon_fam_id, fcon_amount, fcon_purpose }
      const res = await axiosInstance.post('/add-family-contribution', payload);
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to add family contribution');
      }
      // Return normalized contribution row
      return {
        id: data.fcon_id,
        famId: data.fcon_fam_id,
        amount: data.fcon_amount,
        date: data.fcon_date,
        purpose: data.fcon_purpose || '',
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to add family contribution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
  updateFamilyContribution: async payload => {
    try {
      // payload: { fcon_id, fcon_amount, fcon_purpose }
      const res = await axiosInstance.post(
        '/update-family-contribution',
        payload
      );
      const { code, data, msg } = res.data || {};
      if (code !== 200 || !data) {
        throw new Error(msg || 'Failed to update family contribution');
      }
      return {
        id: data.fcon_id,
        famId: data.fcon_fam_id,
        amount: data.fcon_amount,
        date: data.fcon_date,
        purpose: data.fcon_purpose || '',
      };
    } catch (error) {
      const res = error.response;
      if (res?.data) {
        const { data, msg } = res.data;
        throw new Error(
          (typeof data === 'string' && data) ||
            msg ||
            'Failed to update family contribution'
        );
      }
      throw new Error(error.message || 'Network error');
    }
  },
};

export { axiosInstance };
