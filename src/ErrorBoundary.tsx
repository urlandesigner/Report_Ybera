import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Algo deu errado</h1>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Abra o console do navegador (F12 → Console) para ver o erro.
          </p>
          {this.state.error && (
            <pre style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', fontSize: '12px', overflow: 'auto' }}>
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
