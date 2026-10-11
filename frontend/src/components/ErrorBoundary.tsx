import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JalFaasla Error Boundary Caught:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--ink)',
          padding: '24px',
          fontFamily: 'var(--font-body)'
        }}>
          <div style={{
            maxWidth: '520px',
            background: 'var(--paper)',
            border: '2px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg)',
              border: '1.5px solid var(--line)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={32} color="var(--alert)" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--alert)' }}>
              ਐਪਲੀਕੇਸ਼ਨ ਰੀਲੋਡ ਕਰੋ (Application Notice)
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              A temporary display error occurred. Click below to reload the dashboard:
            </p>
            <button
              onClick={this.handleReload}
              className="btn-primary"
            >
              <RefreshCw size={16} />
              <span>ਮੁੜ ਚਲਾਓ (Reload Dashboard)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
