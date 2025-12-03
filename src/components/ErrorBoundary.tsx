import React, { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {

  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const { t } = useTranslation();
  
  return (
    <div className="error-boundary-fallback">
      <h3>{t('error.boundary.title', 'Something went wrong')}</h3>
      <p>{t('error.boundary.message', 'An unexpected error occurred. Please try refreshing the page.')}</p>
      {error && (
        <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
          <summary>{t('error.boundary.details', 'Error details')}</summary>
          {error.toString()}
        </details>
      )}
    </div>
  );
};

export default ErrorBoundary;