import { Component, type ReactNode, type ErrorInfo } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Error details are captured in state via getDerivedStateFromError
    // In production, integrate with an error tracking service (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="gradient-leaf-radial flex min-h-screen items-center justify-center px-4">
          <div className="animate-fade-in w-full max-w-md text-center">
            <div className="bg-danger/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
              <span className="text-4xl" aria-hidden="true">
                ⚠️
              </span>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
              Something went wrong
            </h1>
            <p className="mb-6 text-sm text-[var(--text-secondary)]">
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <p className="mb-6 rounded-xl bg-[var(--bg-card-hover)] p-3 font-mono text-xs break-all text-[var(--text-muted)]">
                {this.state.error.message}
              </p>
            )}
            <div className="flex justify-center gap-3">
              <Button variant="primary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
