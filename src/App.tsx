import { useState } from "react";
import PrediccionForm from "./components/PrediccionForm";
import AnalisisMasivo from "./components/AnalisisMasivo";
import "./App.css";

type Vista = "individual" | "masivo";

export default function App() {
  const [vistaActual, setVistaActual] = useState<Vista>("individual");

  return (
    <div className="app-layout">

      {/* ── Top Bar ── */}
      <header className="topbar">
        <span className="topbar-brand">DESERCION</span>

        <nav className="topbar-nav">
          <button
            className={`topbar-tab ${vistaActual === "individual" ? "active" : ""}`}
            onClick={() => setVistaActual("individual")}
          >
            Individual
          </button>
          <button
            className={`topbar-tab ${vistaActual === "masivo" ? "active" : ""}`}
            onClick={() => setVistaActual("masivo")}
          >
            Masivo
          </button>
        </nav>

        <div className="topbar-right">
          <span className="topbar-version">v2.0</span>
        </div>
      </header>

      {/* ── Workspace ── */}
      <div className="workspace">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-unit">
            <div className="unit-icon" aria-hidden="true">■</div>
            <div className="unit-meta">
              <span className="unit-name">PREDICTIVE UNIT</span>
              <span className="unit-version">v.2.0.4</span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Secciones">
            <span className={`sidebar-nav-item ${vistaActual === "individual" ? "active" : ""}`}>
              OVERVIEW
            </span>
            <span className="sidebar-nav-item">RISK_PROFILES</span>
            <span className="sidebar-nav-item">INTERVENTIONS</span>
            <span className="sidebar-nav-item muted">HISTORY</span>
          </nav>

          <div className="sidebar-footer">
            <span className="sidebar-footer-link">SUPPORT</span>
            <span className="sidebar-footer-link">DOCUMENTATION</span>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="main-content">
          {vistaActual === "individual" ? <PrediccionForm /> : <AnalisisMasivo />}
        </main>
      </div>
    </div>
  );
}
