import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });

    // 🔧 Send error to monitoring/log service if needed
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo);
    }

    console.error('🧨 Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    if (this.props.onReload) {
      this.props.onReload();
    } else {
      window.location.reload();
    }
  };

  renderDevDetails() {
    const { error, errorInfo } = this.state;

    return (
      <details className="mt-4 text-start">
        <summary>Error Details (Development Only)</summary>
        <pre className="text-danger small mt-2">
          {error?.toString()}
          <br />
          {errorInfo?.componentStack}
        </pre>
      </details>
    );
  }

  renderFallback() {
    const { fallback } = this.props;

    if (fallback) return fallback;

    return (
      <div className="error-boundary">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="mb-3">⚠️ Something went wrong</h2>
              <p className="text-muted">
                We're sorry, but an unexpected error occurred. Please try again.
              </p>
              <button className="btn btn-primary mt-3" onClick={this.handleReload}>
                🔄 Reload Page
              </button>

              {import.meta.env.DEV && this.renderDevDetails()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
