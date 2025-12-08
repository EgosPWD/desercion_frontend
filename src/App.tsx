import { useState } from "react";
import PrediccionForm from "./components/PrediccionForm";
import AnalisisMasivo from "./components/AnalisisMasivo";
import { getIconSvg } from "./assets/svg";
import "./App.css";

type Vista = "individual" | "masivo";

export default function App() {
  const [vistaActual, setVistaActual] = useState<Vista>("individual");

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="app-card">
          <div className="app-header">
            <h1 className="app-title">
              Predicción de Deserción Universitaria
            </h1>
            <p className="app-subtitle">
              Sistema de predicción basado en análisis de datos académicos
            </p>
          </div>

          {/* Navegación */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${vistaActual === "individual" ? "active" : ""}`}
              onClick={() => setVistaActual("individual")}
            >
              <span className="nav-icon" dangerouslySetInnerHTML={{ __html: getIconSvg('user') }} />
              Análisis Individual
            </button>
            <button
              className={`nav-tab ${vistaActual === "masivo" ? "active" : ""}`}
              onClick={() => setVistaActual("masivo")}
            >
              <span className="nav-icon" dangerouslySetInnerHTML={{ __html: getIconSvg('users') }} />
              Análisis Masivo
            </button>
          </div>

          <div className="app-content">
            {vistaActual === "individual" ? <PrediccionForm /> : <AnalisisMasivo />}
          </div>
        </div>

        <div className="app-footer">
          <p>Sistema de predicción v2.0 - Universidad</p>
        </div>
      </div>
    </div>
  );
}
