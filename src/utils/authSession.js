// Single source of truth for deciding whether the persisted session is usable.

// Returns the expiry as epoch ms, or null when missing/unparseable.
export const parseExpiry = value => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isNaN(t) ? null : t;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    // Treat small numbers as epoch seconds
    return value < 1e12 ? value * 1000 : value;
  }
  if (typeof value === 'string') {
    // Backend format: "YYYY-MM-DD HH:mm:ss"
    const ms = Date.parse(value.trim().replace(' ', 'T'));
    return Number.isNaN(ms) ? null : ms;
  }
  return null;
};

// Unknown/unparseable expiry is treated as not expired; the server stays the authority.
export const isTokenExpired = (tokenExpiresAt, now = Date.now()) => {
  const ms = parseExpiry(tokenExpiresAt);
  return ms !== null && now >= ms;
};

export const isMockToken = token =>
  typeof token === 'string' && token.startsWith('mock-jwt-token-');

export const isSessionValid = auth =>
  Boolean(
    auth &&
      auth.isAuthenticated &&
      auth.accessToken &&
      !isMockToken(auth.accessToken) &&
      !isTokenExpired(auth.tokenExpiresAt)
  );
