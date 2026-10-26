import { Component } from 'react';

// Prevents a render error from leaving the user on a blank page.
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  // Drops the persisted session in case corrupted auth state caused the crash
  handleReset = () => {
    try {
      window.localStorage.removeItem('persist:auth');
    } catch {
      // storage unavailable
    }
    window.location.assign('/login');
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-sm w-full bg-white rounded-xl shadow p-6 text-center">
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            The page failed to load. Try reloading, or sign in again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
            >
              Sign in again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
