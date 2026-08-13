"use client";

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-surface rounded-2xl border border-accent-rose/50 m-4">
          <h2 className="text-accent-rose font-display text-xl mb-2">Terjadi Kesalahan</h2>
          <p className="text-ink-muted text-sm mb-4">
            Maaf, kami tidak dapat memuat bagian ini.
          </p>
          <pre className="text-left text-xs bg-red-100 p-2 text-red-900 rounded mb-4 overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-surface-alt text-ink rounded-lg font-medium"
          >
            Muat Ulang
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
