import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040711] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel rounded-2xl p-8 text-center">
            <h1 className="font-display text-xl font-bold text-white mb-3">REIVON VALE</h1>
            <p className="text-sm text-slate-300 mb-6">
              Something interrupted the current view. Reload to continue cleanly.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-electric text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
