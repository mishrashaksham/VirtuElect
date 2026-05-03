import React from 'react';

/**
 * Global ErrorBoundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of crashing the app.
 *
 * @class ErrorBoundary
 * @extends React.Component
 */
class ErrorBoundary extends React.Component {
  /**
   * @param {Object} props - The component props.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state so the next render will show the fallback UI.
   *
   * @param {Error} error - The error that was thrown.
   * @returns {Object} State object indicating an error occurred.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Log the error to an error reporting service.
   *
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} errorInfo - Additional information about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  /**
   * Render method for the ErrorBoundary.
   *
   * @returns {React.ReactNode} The fallback UI if an error occurred, otherwise the children.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0A0A0A] p-4">
          <div className="glass-panel p-8 max-w-lg w-full text-center border border-accent-red/30 bg-surface-color">
            <h1 className="text-3xl font-bold text-accent-red mb-4 flex items-center justify-center gap-2">
              <span>⚠️</span> Something went wrong
            </h1>
            <p className="text-text-secondary mb-6">
              We've encountered an unexpected error. Our team has been notified.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary bg-accent-red hover:bg-accent-red/90 text-white w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
