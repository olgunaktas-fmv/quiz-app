import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="screen error-boundary">
          <h2>Bir şeyler ters gitti</h2>
          <p className="muted">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyin.
          </p>
          <pre>{String(this.state.error.message || this.state.error)}</pre>
          <button onClick={() => window.location.reload()}>Yenile</button>
        </div>
      );
    }
    return this.props.children;
  }
}
