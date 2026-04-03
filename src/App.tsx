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

          <nav className="sidebar-nav" aria-label="Vistas">
            <button
              className={`sidebar-nav-item sidebar-nav-btn ${vistaActual === "individual" ? "active" : ""}`}
              onClick={() => setVistaActual("individual")}
            >
              INDIVIDUAL
            </button>
            <button
              className={`sidebar-nav-item sidebar-nav-btn ${vistaActual === "masivo" ? "active" : ""}`}
              onClick={() => setVistaActual("masivo")}
            >
              MASIVO
            </button>
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
