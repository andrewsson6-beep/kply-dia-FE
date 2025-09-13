import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useUser } from '../../store/hooks.js';
import { updateUserProfile } from '../../store/slices/authSlice.js';
import { authApi } from '../../api/api.js';

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const authUser = useUser();

  // Map backend structure to UI-friendly model
  const appUser = useMemo(() => {
    if (!authUser) return null;
    const roleLabel =
      authUser.role ||
      (authUser.roleId === 1
        ? 'admin'
        : authUser.roleId === 2
          ? 'user'
          : String(authUser.roleId || 'user'));
    return {
      name: authUser.username || authUser.name || 'User',
      email: authUser.email,
      role: roleLabel,
      createdAt: authUser.createdAt || null,
      lastLoginAt: authUser.lastLoginAt || null,
    };
  }, [authUser]);

  const [form, setForm] = useState(() => ({ name: '', email: '', role: '' }));
  const [original, setOriginal] = useState(() => ({
    name: '',
    email: '',
    role: '',
  }));

  useEffect(() => {
    if (appUser) {
      const initial = {
        name: appUser.name || '',
        email: appUser.email || '',
        role: appUser.role || '',
      };
      setForm(initial);
      setOriginal(initial);
    }
  }, [appUser]);
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  // Avatar ref removed (no profile image management required)
  const nameInputRef = useRef(null);
  const [highlightName, setHighlightName] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const focusNameField = () => {
    nameInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    // Focus slightly after scroll for better UX
    setTimeout(() => nameInputRef.current?.focus(), 300);
    setHighlightName(true);
    setTimeout(() => setHighlightName(false), 1500);
  };

  const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validatePw = () => {
    if (!pwForm.current && !pwForm.next && !pwForm.confirm) return true; // optional
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwErrors('All password fields are required to change password');
      return false;
    }
    if (pwForm.next.length < 6) {
      setPwErrors('New password must be at least 6 characters');
      return false;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwErrors('New password & confirmation do not match');
      return false;
    }
    setPwErrors(null);
    return true;
  };

  // Avatar management removed per requirement (no profile image)

  const handleSave = e => {
    if (e) e.preventDefault();
    setSaving(true);
    setGlobalMsg(null);
    // Persist change to Redux (update username/name only; email/role immutable here)
    dispatch(updateUserProfile({ username: form.name, name: form.name }));
    setTimeout(() => {
      setSaving(false);
      setGlobalMsg('Profile updated successfully');
      setOriginal({ name: form.name, email: form.email, role: form.role });
      setTimeout(() => setGlobalMsg(null), 2500);
    }, 300);
  };

  const handlePasswordUpdate = async () => {
    if (!validatePw()) return;
    setPwSaving(true);
    try {
      await authApi.changePassword({
        current_password: pwForm.current,
        new_password: pwForm.next,
      });
      setPwForm({ current: '', next: '', confirm: '' });
      setGlobalMsg('Password changed successfully');
      setPwErrors(null);
    } catch (err) {
      setPwErrors(err.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
      setTimeout(() => setGlobalMsg(null), 2500);
    }
  };

  const logoutOtherDevices = () => {
    setGlobalMsg('Logged out from other devices');
    setTimeout(() => setGlobalMsg(null), 2500);
  };

  return (
    <div className="min-h-full pb-16">
      {/* Hero / Banner */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full px-6 sm:px-10 pb-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            User Profile
          </h1>
          <p className="text-sm text-indigo-100 mt-1">
            Manage your personal information and account settings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-indigo-100 rounded-full opacity-30" />
              <div className="relative flex flex-col items-center text-center">
                <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
                  <h2 className="text-lg font-semibold text-gray-900 max-w-full break-words">
                    {form.name}
                  </h2>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={focusNameField}
                      className="p-1 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label="Edit name"
                      title="Edit name"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-.793.793-2.828-2.828.793-.793Z" />
                        <path d="M11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
                      </svg>
                    </button>
                    {form.name !== original.name && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSave()}
                          className="px-2 py-1 text-[10px] font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-500 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setForm(original);
                          }}
                          className="px-2 py-1 text-[10px] font-medium rounded-md border border-gray-200 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{form.email}</p>
                <span className="inline-flex items-center mt-3 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {form.role || 'user'}
                </span>
                <dl className="mt-6 grid grid-cols-3 gap-3 w-full text-center">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">
                      Member Since
                    </dt>
                    <dd className="text-xs font-medium text-gray-800 mt-1">
                      {appUser?.createdAt
                        ? new Date(appUser.createdAt).toLocaleDateString()
                        : '—'}
                    </dd>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50">
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">
                      Last Login
                    </dt>
                    <dd className="text-xs font-medium text-gray-800 mt-1">
                      {appUser?.lastLoginAt
                        ? new Date(appUser.lastLoginAt).toLocaleDateString()
                        : '—'}
                    </dd>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50">
                    <dt className="text-[10px] uppercase tracking-wide text-gray-500">
                      Status
                    </dt>
                    <dd className="text-xs font-medium text-green-600 mt-1 flex items-center justify-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />{' '}
                      Active
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Settings
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">Change Password</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Update your account password.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPasswordSection(s => !s);
                      if (!showPasswordSection) {
                        setTimeout(
                          () =>
                            document
                              .getElementById('password-section')
                              ?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              }),
                          60
                        );
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition ${showPasswordSection ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700'}`}
                  >
                    {showPasswordSection ? 'Hide' : 'Open'}
                  </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">
                      Logout Other Devices
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Sign out from other active sessions.
                    </p>
                  </div>
                  <button
                    onClick={logoutOtherDevices}
                    className="px-3 py-1.5 rounded-md border border-gray-200 hover:border-red-300 hover:bg-red-50 transition text-xs font-medium text-red-600"
                  >
                    Logout
                  </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-800">Dark Mode</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      (Coming soon) Switch theme.
                    </p>
                  </div>
                  <button
                    disabled
                    className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-gray-400 text-xs font-medium cursor-not-allowed"
                  >
                    Soon
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-8">
            <form
              onSubmit={handleSave}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Update your account's profile information.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="reset"
                    onClick={() => setForm(original)}
                    className="px-3 py-2 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={saving || form.name === original.name}
                    className="px-4 py-2 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              {globalMsg && (
                <div className="mb-4 text-[11px] text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 flex items-start gap-2">
                  <span>✔</span>
                  <span>{globalMsg}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    ref={nameInputRef}
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full rounded-md border ${highlightName ? 'border-indigo-400 ring-2 ring-indigo-300' : 'border-gray-300'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2 text-sm outline-none transition`}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    value={form.email}
                    disabled
                    className="w-full rounded-md border border-gray-300 bg-gray-50 text-gray-600 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    value={form.role}
                    disabled
                    className="w-full rounded-md border border-gray-300 bg-gray-50 text-gray-600 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </form>
            {showPasswordSection && (
              <div
                id="password-section"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Change Password
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to keep current password.
                    </p>
                  </div>
                </div>
                {pwErrors && (
                  <div className="mb-4 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{pwErrors}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={e =>
                        setPwForm(p => ({ ...p, current: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={pwForm.next}
                      onChange={e =>
                        setPwForm(p => ({ ...p, next: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="At least 6 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={e =>
                        setPwForm(p => ({ ...p, confirm: e.target.value }))
                      }
                      className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 bg-white px-3 py-2 text-sm outline-none"
                      placeholder="Repeat new"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      setPwForm({ current: '', next: '', confirm: '' });
                      setPwErrors(null);
                    }}
                    type="button"
                    className="px-4 py-2 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    Reset Fields
                  </button>
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={pwSaving}
                    className="px-4 py-2 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {pwSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
