/**
 * Loading Spinner Component
 * Simple, elegant loading indicator
 */

export const LoadingSpinner: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                border: '4px solid #1e293b',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <p style={{
                marginTop: '24px',
                fontSize: '18px',
                fontWeight: '500',
            }}>
                Carregando dados...
            </p>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

/**
 * Error Message Component
 * Displays error with retry option
 */

interface ErrorMessageProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            padding: '24px',
        }}>
            <div style={{
                backgroundColor: '#1e293b',
                padding: '32px',
                borderRadius: '12px',
                maxWidth: '500px',
                textAlign: 'center',
                border: '2px solid #ef4444',
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                }}>⚠️</div>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#ef4444',
                }}>
                    Erro ao Carregar Dados
                </h2>
                <p style={{
                    fontSize: '16px',
                    color: '#94a3b8',
                    marginBottom: '24px',
                }}>
                    {error}
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        Tentar Novamente
                    </button>
                )}
            </div>
        </div>
    );
};
